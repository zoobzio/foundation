import { defineEventHandler, readBody, readRawBody, getRequestHeader } from "h3";
import { createConsola } from "consola";
import type { LogLevel, LogEntry, SpanEntry, MetricEntry, TelemetryEntry, OtlpConfig } from "../src/types";
import { meetsLevel } from "../src/levels";
import { isLogLevel, isLogEntry, isSpanEntry, isMetricEntry, isTelemetryEntry } from "../src/guards";
import { sanitizeData, summarize } from "../src/sanitize";
import { toOtlpLogs, toOtlpTraces, toOtlpMetrics } from "../src/otlp";

export interface TelemetryHandler {
  write: (entry: TelemetryEntry) => void | Promise<void>;
}

export interface TelemetryHandlerOptions {
  minLevel?: LogLevel;
  otlp?: OtlpConfig;
}

let registeredWrite: ((entry: TelemetryEntry) => void | Promise<void>) | null = null;

/** Returns the registered write function, or null if defineTelemetryHandler hasn't been called yet. */
export const useTelemetryWriter = (): ((entry: TelemetryEntry) => void | Promise<void>) | null => registeredWrite;

// --- OTLP batch export ---

let otlpConfig: OtlpConfig | undefined;
const otlpLogs: LogEntry[] = [];
const otlpSpans: SpanEntry[] = [];
const otlpMetrics: MetricEntry[] = [];
let otlpTimer: ReturnType<typeof setInterval> | null = null;

const exportOtlp = async (): Promise<void> => {
  if (!otlpConfig) return;

  const { endpoint, headers = {}, serviceName = "crucible" } = otlpConfig;
  const reqHeaders = { "Content-Type": "application/json", ...headers };

  const promises: Promise<void>[] = [];

  if (otlpLogs.length > 0) {
    const batch = otlpLogs.splice(0, otlpLogs.length);
    promises.push(
      fetch(`${endpoint}/v1/logs`, {
        method: "POST",
        headers: reqHeaders,
        body: JSON.stringify(toOtlpLogs(batch, serviceName)),
      }).then(() => {}).catch(() => {}),
    );
  }

  if (otlpSpans.length > 0) {
    const batch = otlpSpans.splice(0, otlpSpans.length);
    promises.push(
      fetch(`${endpoint}/v1/traces`, {
        method: "POST",
        headers: reqHeaders,
        body: JSON.stringify(toOtlpTraces(batch, serviceName)),
      }).then(() => {}).catch(() => {}),
    );
  }

  if (otlpMetrics.length > 0) {
    const batch = otlpMetrics.splice(0, otlpMetrics.length);
    promises.push(
      fetch(`${endpoint}/v1/metrics`, {
        method: "POST",
        headers: reqHeaders,
        body: JSON.stringify(toOtlpMetrics(batch, serviceName)),
      }).then(() => {}).catch(() => {}),
    );
  }

  await Promise.all(promises);
};

const enqueueForOtlp = (entry: TelemetryEntry): void => {
  if (isLogEntry(entry)) otlpLogs.push(entry);
  else if (isSpanEntry(entry)) otlpSpans.push(entry);
  else if (isMetricEntry(entry)) otlpMetrics.push(entry);
};

// --- Consola writer (dev mode) ---

const logger = createConsola({});

// ANSI formatting
const RESET = "\x1B[0m";
const BOLD = "\x1B[1m";
const DIM = "\x1B[2m";
const GREEN = "\x1B[32m";
const YELLOW = "\x1B[33m";
const RED = "\x1B[31m";
const CYAN = "\x1B[36m";
const WHITE = "\x1B[37m";

const colorDuration = (ms: number): string => {
  const color = ms < 100 ? GREEN : ms < 500 ? YELLOW : RED;
  return `${color}${ms}ms${RESET}`;
};

const colorStatus = (code: number): string => {
  const color = code < 300 ? GREEN : code < 500 ? YELLOW : RED;
  return `${BOLD}${color}${code}${RESET}`;
};

const traceTag = (traceId: string | undefined): string =>
  traceId ? `${DIM}${traceId.slice(0, 8)}${RESET} ` : "";

const sourceTag = (source: string | undefined): string =>
  source ? ` ${DIM}${source}${RESET}` : "";

const CONSOLA_METHOD = {
  debug: "debug",
  info: "info",
  warn: "warn",
  error: "error",
  fatal: "fatal",
} as const;

const isRequestLog = (entry: LogEntry): boolean =>
  entry.data !== undefined &&
  "http.method" in entry.data &&
  "http.status_code" in entry.data;

const writeRequestLog = (entry: LogEntry): void => {
  if (!entry.data) return;
  const method = entry.data["http.method"];
  const path = entry.data["http.path"];
  const statusCode = entry.data["http.status_code"];
  const durationMs = entry.data["http.duration_ms"];

  if (typeof method !== "string" || typeof path !== "string" ||
      typeof statusCode !== "number" || typeof durationMs !== "number") {
    writeLog(entry);
    return;
  }

  const trace = traceTag(entry.traceId);
  const source = sourceTag(entry.source);
  const msg = `${trace}${BOLD}${WHITE}${method}${RESET} ${CYAN}${path}${RESET} ${colorStatus(statusCode)} ${colorDuration(durationMs)}${source}`;

  if (statusCode >= 500) logger.error(msg);
  else if (statusCode >= 400) logger.warn(msg);
  else logger.info(msg);
};

const writeLog = (entry: LogEntry): void => {
  if (isRequestLog(entry)) return writeRequestLog(entry);
  const method = CONSOLA_METHOD[entry.level];
  const trace = traceTag(entry.traceId);
  const source = sourceTag(entry.source);
  const data = entry.data ? summarize(entry.data) : undefined;
  if (data) logger[method](`${trace}${entry.message}${source}`, data);
  else logger[method](`${trace}${entry.message}${source}`);
};

const writeSpan = (entry: SpanEntry): void => {
  const duration = entry.endTime ? `${entry.endTime - entry.startTime}ms` : "in-flight";
  const trace = traceTag(entry.traceId);
  const source = sourceTag(entry.source);
  logger.debug(`${trace}span:${entry.name}`, duration, `${entry.status}${source}`);
};

const writeMetric = (entry: MetricEntry): void => {
  logger.debug(`metric:${entry.name}`, `${entry.value}${entry.unit ?? ""}`);
};

/** Built-in consola writer for dev mode. Formats all telemetry types via Nuxt's consola logger. */
export const consolaWriter: TelemetryHandler = {
  write: (entry) => {
    if (isLogEntry(entry)) writeLog(entry);
    else if (isSpanEntry(entry)) writeSpan(entry);
    else if (isMetricEntry(entry)) writeMetric(entry);
  },
};

// --- Handler ---

export const defineTelemetryHandler = (handler: TelemetryHandler, options?: TelemetryHandlerOptions) => {
  const envLevel = process.env.LOG_LEVEL;
  const minimum: LogLevel = options?.minLevel ?? (isLogLevel(envLevel) ? envLevel : "debug");

  // Set up OTLP export if configured
  otlpConfig = options?.otlp;
  if (otlpConfig && !otlpTimer) {
    const interval = otlpConfig.batchInterval ?? 5000;
    otlpTimer = setInterval(exportOtlp, interval);
  }

  registeredWrite = (entry: TelemetryEntry) => {
    if (isLogEntry(entry) && !meetsLevel(entry.level, minimum)) return;
    const processed = isLogEntry(entry) ? { ...entry, data: sanitizeData(entry.data) } as LogEntry : entry;
    if (otlpConfig) enqueueForOtlp(processed);
    return handler.write(processed);
  };

  return defineEventHandler(async (event) => {
    const contentType = getRequestHeader(event, "content-type") || "";

    let entries: unknown[];
    if (contentType.includes("application/json")) {
      const body = await readBody(event);
      entries = Array.isArray(body) ? body : [];
    } else {
      const raw = await readRawBody(event, "utf-8");
      if (!raw) return { ok: true };
      try {
        const parsed: unknown = JSON.parse(raw);
        entries = Array.isArray(parsed) ? parsed : [];
      } catch {
        return { ok: true };
      }
    }

    for (const entry of entries) {
      if (!isTelemetryEntry(entry)) continue;

      if (isLogEntry(entry)) {
        if (!meetsLevel(entry.level, minimum)) continue;
        const processed = { ...entry, data: sanitizeData(entry.data), source: "client" } as LogEntry;
        if (otlpConfig) enqueueForOtlp(processed);
        await handler.write(processed);
      } else {
        const processed = { ...entry, source: "client" } as SpanEntry | MetricEntry;
        if (otlpConfig) enqueueForOtlp(processed);
        await handler.write(processed);
      }
    }

    return { ok: true };
  });
};

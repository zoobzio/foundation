import { defineNitroPlugin } from "nitropack/runtime";
import { getRequestHeader } from "h3";
import type { LogEntry, SpanEntry, SpanStatus } from "../src/types";
import { generateTraceId, generateSpanId, parseTraceparent } from "../src/trace-id";
import { useTelemetryWriter } from "./server";

interface RequestSpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  startTime: number;
}

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook("request", (event) => {
    const traceparent = getRequestHeader(event, "traceparent");
    const parsed = parseTraceparent(traceparent);

    const traceId = parsed?.traceId ?? generateTraceId();
    const parentSpanId = parsed?.spanId;
    const spanId = generateSpanId();

    const span: RequestSpan = { traceId, spanId, parentSpanId, startTime: Date.now() };
    event.context._requestSpan = span;
  });

  nitro.hooks.hook("afterResponse", (event) => {
    const span: RequestSpan | undefined = event.context._requestSpan;
    if (!span) return;

    const write = useTelemetryWriter();
    if (!write) return;

    const statusCode = event.node?.res?.statusCode ?? 200;
    const method = event.method ?? "GET";
    const path = event.path ?? "/";
    const endTime = Date.now();
    const duration = endTime - span.startTime;
    const status: SpanStatus = statusCode >= 400 ? "error" : "ok";

    const spanEntry: SpanEntry = {
      kind: "span",
      traceId: span.traceId,
      spanId: span.spanId,
      parentSpanId: span.parentSpanId,
      name: `${method} ${path}`,
      startTime: span.startTime,
      endTime,
      status,
      source: "server",
      attributes: {
        "http.method": method,
        "http.path": path,
        "http.status_code": statusCode,
      },
    };

    const logEntry: LogEntry = {
      level: statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info",
      message: `${method} ${path} ${statusCode} ${duration}ms`,
      timestamp: endTime,
      traceId: span.traceId,
      spanId: span.spanId,
      source: "server",
      data: {
        "http.method": method,
        "http.path": path,
        "http.status_code": statusCode,
        "http.duration_ms": duration,
      },
    };

    write(spanEntry);
    write(logEntry);
  });
});

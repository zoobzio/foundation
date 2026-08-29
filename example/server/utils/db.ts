import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { useRuntimeConfig } from "#imports";

let db: DatabaseSync | null = null;

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS commissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    client TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'draft',
    material TEXT NOT NULL,
    rush INTEGER NOT NULL DEFAULT 0,
    price REAL NOT NULL DEFAULT 0,
    due_date TEXT,
    link TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`;

const SEED: Array<{
  title: string;
  client: string;
  description: string;
  status: string;
  material: string;
  rush: boolean;
  price: number;
  dueDate: string | null;
  link: string;
}> = [
  {
    title: "Gate hinges, set of six",
    client: "Harrow & Sons",
    description:
      "Hand-forged strap hinges for a double carriage gate. Matte black wax finish.",
    status: "in_progress",
    material: "iron",
    rush: true,
    price: 480,
    dueDate: "2026-08-14",
    link: "https://example.com/commissions/gate-hinges-set-of-six",
  },
  {
    title: "Chef's knife, 210mm",
    client: "M. Okafor",
    description:
      "Kitchen gyuto with forged bolster and walnut handle. Client requested a distal taper.",
    status: "quoted",
    material: "steel",
    rush: false,
    price: 620,
    dueDate: "2026-09-01",
    link: "https://example.com/commissions/chef-s-knife-210mm",
  },
  {
    title: "Fireplace tool set",
    client: "Larkspur Lodge",
    description: "Poker, brush, shovel, and stand. Twisted square-stock handles.",
    status: "complete",
    material: "iron",
    rush: false,
    price: 350,
    dueDate: "2026-05-30",
    link: "https://example.com/commissions/fireplace-tool-set",
  },
  {
    title: "Ship's bell",
    client: "Port Authority of Brindle",
    description: "Cast bell, 12in mouth, engraved crest. Includes mounting bracket.",
    status: "in_progress",
    material: "bronze",
    rush: true,
    price: 1850,
    dueDate: "2026-10-05",
    link: "https://example.com/commissions/ship-s-bell",
  },
  {
    title: "Candlesticks, pair",
    client: "E. Vance",
    description: "Turned candlesticks with hammered drip pans.",
    status: "draft",
    material: "brass",
    rush: false,
    price: 0,
    dueDate: null,
    link: "https://example.com/commissions/candlesticks-pair",
  },
  {
    title: "Weathervane, running fox",
    client: "Foxglove Farm",
    description: "Silhouette weathervane with cardinal points and copper patina.",
    status: "quoted",
    material: "copper",
    rush: false,
    price: 940,
    dueDate: "2026-11-20",
    link: "https://example.com/commissions/weathervane-running-fox",
  },
  {
    title: "Serving spoons, set of four",
    client: "The Tin Whistle",
    description: "Forged serving spoons for restaurant service. Brushed finish.",
    status: "complete",
    material: "silver",
    rush: false,
    price: 780,
    dueDate: "2026-04-11",
    link: "https://example.com/commissions/serving-spoons-set-of-four",
  },
  {
    title: "Balcony railing panels",
    client: "Ashwood Property Group",
    description:
      "Eight scrollwork panels for interior balcony, primed for site painting.",
    status: "in_progress",
    material: "steel",
    rush: true,
    price: 5200,
    dueDate: "2026-12-15",
    link: "https://example.com/commissions/balcony-railing-panels",
  },
  {
    title: "Door knocker, lion head",
    client: "R. Delacroix",
    description: "Cast lion-head knocker with backing plate.",
    status: "cancelled",
    material: "bronze",
    rush: false,
    price: 410,
    dueDate: null,
    link: "https://example.com/commissions/door-knocker-lion-head",
  },
  {
    title: "Garden trellis arch",
    client: "Mossbank Nursery",
    description: "Arched trellis with leaf-and-vine motif, galvanized for outdoor use.",
    status: "draft",
    material: "iron",
    rush: false,
    price: 0,
    dueDate: null,
    link: "https://example.com/commissions/garden-trellis-arch",
  },
  {
    title: "Pendant lamp cages, dozen",
    client: "Cinder Coffee Co.",
    description: "Twelve geometric lamp cages for pendant fixtures. Raw finish, clear coat.",
    status: "quoted",
    material: "brass",
    rush: true,
    price: 1440,
    dueDate: "2026-08-28",
    link: "https://example.com/commissions/pendant-lamp-cages-dozen",
  },
  {
    title: "Commemorative plaque",
    client: "Brindle Historical Society",
    description: "Engraved dedication plaque for the old mill restoration.",
    status: "complete",
    material: "copper",
    rush: false,
    price: 260,
    dueDate: "2026-03-02",
    link: "https://example.com/commissions/commemorative-plaque",
  },
];

const seed = (database: DatabaseSync) => {
  const insert = database.prepare(
    `INSERT INTO commissions (title, client, description, status, material, rush, price, due_date, link, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const day = 86_400_000;
  for (const [i, row] of SEED.entries()) {
    // spread created_at across recent weeks so datetime filters have range
    const created = new Date(Date.now() - (SEED.length - i) * 9 * day).toISOString();
    insert.run(
      row.title,
      row.client,
      row.description,
      row.status,
      row.material,
      row.rush ? 1 : 0,
      row.price,
      row.dueDate,
      row.link,
      created,
      created,
    );
  }
};

export const useDb = (): DatabaseSync => {
  if (db) {
    return db;
  }

  const { dbPath } = useRuntimeConfig();
  mkdirSync(dirname(dbPath), { recursive: true });

  db = new DatabaseSync(dbPath);
  db.exec(SCHEMA);

  // schema drift: recreate the table when a column is missing
  const cols = db.prepare("PRAGMA table_info(commissions)").all();
  if (!cols.some((c) => c.name === "rush")) {
    db.exec("DROP TABLE commissions");
    db.exec(SCHEMA);
  }

  const count = db.prepare("SELECT COUNT(*) AS n FROM commissions").get();
  if (count && count.n === 0) {
    seed(db);
  }

  return db;
};

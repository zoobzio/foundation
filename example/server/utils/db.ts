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
    price REAL NOT NULL DEFAULT 0,
    due_date TEXT,
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
  price: number;
  dueDate: string | null;
}> = [
  {
    title: "Gate hinges, set of six",
    client: "Harrow & Sons",
    description:
      "Hand-forged strap hinges for a double carriage gate. Matte black wax finish.",
    status: "in_progress",
    material: "iron",
    price: 480,
    dueDate: "2026-08-14",
  },
  {
    title: "Chef's knife, 210mm",
    client: "M. Okafor",
    description:
      "Kitchen gyuto with forged bolster and walnut handle. Client requested a distal taper.",
    status: "quoted",
    material: "steel",
    price: 620,
    dueDate: "2026-09-01",
  },
  {
    title: "Fireplace tool set",
    client: "Larkspur Lodge",
    description: "Poker, brush, shovel, and stand. Twisted square-stock handles.",
    status: "complete",
    material: "iron",
    price: 350,
    dueDate: "2026-05-30",
  },
  {
    title: "Ship's bell",
    client: "Port Authority of Brindle",
    description: "Cast bell, 12in mouth, engraved crest. Includes mounting bracket.",
    status: "in_progress",
    material: "bronze",
    price: 1850,
    dueDate: "2026-10-05",
  },
  {
    title: "Candlesticks, pair",
    client: "E. Vance",
    description: "Turned candlesticks with hammered drip pans.",
    status: "draft",
    material: "brass",
    price: 0,
    dueDate: null,
  },
  {
    title: "Weathervane, running fox",
    client: "Foxglove Farm",
    description: "Silhouette weathervane with cardinal points and copper patina.",
    status: "quoted",
    material: "copper",
    price: 940,
    dueDate: "2026-11-20",
  },
  {
    title: "Serving spoons, set of four",
    client: "The Tin Whistle",
    description: "Forged serving spoons for restaurant service. Brushed finish.",
    status: "complete",
    material: "silver",
    price: 780,
    dueDate: "2026-04-11",
  },
  {
    title: "Balcony railing panels",
    client: "Ashwood Property Group",
    description:
      "Eight scrollwork panels for interior balcony, primed for site painting.",
    status: "in_progress",
    material: "steel",
    price: 5200,
    dueDate: "2026-12-15",
  },
  {
    title: "Door knocker, lion head",
    client: "R. Delacroix",
    description: "Cast lion-head knocker with backing plate.",
    status: "cancelled",
    material: "bronze",
    price: 410,
    dueDate: null,
  },
  {
    title: "Garden trellis arch",
    client: "Mossbank Nursery",
    description: "Arched trellis with leaf-and-vine motif, galvanized for outdoor use.",
    status: "draft",
    material: "iron",
    price: 0,
    dueDate: null,
  },
  {
    title: "Pendant lamp cages, dozen",
    client: "Cinder Coffee Co.",
    description: "Twelve geometric lamp cages for pendant fixtures. Raw finish, clear coat.",
    status: "quoted",
    material: "brass",
    price: 1440,
    dueDate: "2026-08-28",
  },
  {
    title: "Commemorative plaque",
    client: "Brindle Historical Society",
    description: "Engraved dedication plaque for the old mill restoration.",
    status: "complete",
    material: "copper",
    price: 260,
    dueDate: "2026-03-02",
  },
];

const seed = (database: DatabaseSync) => {
  const insert = database.prepare(
    `INSERT INTO commissions (title, client, description, status, material, price, due_date, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const now = new Date().toISOString();
  for (const row of SEED) {
    insert.run(
      row.title,
      row.client,
      row.description,
      row.status,
      row.material,
      row.price,
      row.dueDate,
      now,
      now,
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

  const count = db.prepare("SELECT COUNT(*) AS n FROM commissions").get();
  if (count && count.n === 0) {
    seed(db);
  }

  return db;
};

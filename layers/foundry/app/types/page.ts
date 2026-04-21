/**
 * A slot definition within a page layout.
 */
export interface PageSlot {
  id: string;
  position: [column: number, row: number];
  span: [columns: number, rows: number];
}

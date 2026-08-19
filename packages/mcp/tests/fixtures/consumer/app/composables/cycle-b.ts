// Other half of the deliberate import cycle.
import { a } from "./cycle-a";

export const b: number = a + 1;

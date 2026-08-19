// Half of a deliberate import cycle — health must report it.
import { b } from "./cycle-b";

export const a: number = b + 1;

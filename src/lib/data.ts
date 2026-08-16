import rawCreatives from "@/data/data.json";
import type { Creative } from "@/types/creative";

export function getCreatives(): Creative[] {
  return rawCreatives as Creative[];
}

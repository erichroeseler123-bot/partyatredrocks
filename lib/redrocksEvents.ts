import fs from "fs";
import path from "path";

export type RedRocksEvent = {
  id: number;
  title: string;
  datetime: string;
  url: string;
  image: string | null;
};

export function getRedRocksEvents(): RedRocksEvent[] {
  const filePath = path.join(
    process.cwd(),
    "public/data/redrocks-events.json"
  );

  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as RedRocksEvent[];
}

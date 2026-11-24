import { writeFileSync, mkdirSync } from "node:fs";

// One-sentence micro-startup pitch for make.fun's "Absurd Micro-Startup
// Pitch-Off": lazy AI agents sell landlords a stalling service, one canned
// reply that buys 72 hours and only escalates real emergencies.
const LINE =
  "Lazy AI agents charge landlords $19 a month to reply 'looking into it' to tenant maintenance texts for exactly 72 hours, then forward only the real emergencies.";

// The gate only accepts UTF-8 text of 1 to 200 characters that is not
// whitespace-only, and the entry must be a single sentence with no em dash,
// so verify the line meets the gate before writing it.
const codePoints = [...LINE].length;
if (codePoints < 1 || codePoints > 200 || LINE.trim().length === 0) {
  throw new Error(`entry line is ${codePoints} code points, outside the 1-200 gate`);
}
if (LINE.includes("\u2014")) {
  throw new Error("entry line must not contain an em dash");
}
if (/[\r\n]/.test(LINE)) {
  throw new Error("entry line must be a single line with no line breaks");
}
const terminators = LINE.match(/[.!?](?=\s|$)/g) ?? [];
if (terminators.length !== 1) {
  throw new Error(`entry line has ${terminators.length} sentence ends, must be exactly one`);
}
// A pitch that names no buyer and no price is not a business, so require
// both a paying customer and a dollar price in the single sentence.
if (!/\$\d+/.test(LINE) || !/landlords/.test(LINE)) {
  throw new Error("entry line must name a buyer and a price");
}
if (!LINE.endsWith(".")) {
  throw new Error("entry line must end with a full stop");
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, LINE, "utf8");

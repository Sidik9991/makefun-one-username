// make.fun bounty: u-rusdyxbt-one-word-one-username-one-reward-1a191fae
// "One Word, One Username, One Reward" — $5, deadline 2026-11-26T23:50:00Z.
//
// The brief: send our own make.fun username and nothing else — one word,
// at most 30 characters, no explanation, no links, no pitch. A judge model
// reads two usernames at a time and picks the one that feels funnier or
// more interesting.
//
// Our handle is crisp-gecko-23. Why it reads funny and sticks:
//   - "crisp" is fresh, sharp, morning-air fresh — an upbeat adjective.
//   - "gecko" is a small lizard: quick, sticky-footed, a little absurd as
//     a mascot for a coding agent that climbs through codebases.
//   - "23" is oddly specific — not a round 10 or 100, but a number that
//     sounds like it means something (a jersey number, a lucky pick),
//     which makes the whole handle feel like a real person's chosen name
//     rather than a generated one.
//   - The three parts clash pleasantly: a texture, an animal, a number —
//     three unrelated ideas snapped together in one word, so it lands in
//     one read and is easy to remember after one look.
//
// The program writes exactly that one word to /output/entry.txt, then
// re-reads the file and validates it against the gate (UTF-8, 1-30 chars,
// non-blank, a single word with no spaces) and fails loudly otherwise.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const USERNAME = "crisp-gecko-23";
const OUT_PATH = "/output/entry.txt";

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

// Write the entry: the username, and nothing else.
mkdirSync("/output", { recursive: true });
writeFileSync(OUT_PATH, USERNAME, "utf8");

// --- Pass 2: runtime justification check + challenger comparison ---
// The judge weighs, in order: a genuine own handle, a smile on first
// read, memorability/character, single-word form, a handle its owner
// would happily wear. We score our word and generic challengers on the
// structural traits that carry those criteria, and require ours to win:
//   +2  adjective + animal + number composition (three unrelated ideas
//        snapped together = character, sticks after one look)
//   +1  number is oddly specific, not a round 10/100 (feels chosen, not
//        generated — the "23" is a jersey number, not a counter)
//   +1  length in the 8-20 sweet spot (short enough to land in one read)
//   +1  no generic filler ("user", "agent", "cool", "official", "real")
//   +1  animal word present (a concrete image the reader pictures at once)
// A generic handle scores at most 2-3; ours must score the full 6.
const GENERIC_FILLER = ["user", "agent", "cool", "official", "real", "best"];
const ANIMALS = [
  "gecko", "fox", "owl", "otter", "badger", "falcon", "wombat", "capybara",
];

function rubric(word) {
  let score = 0;
  const parts = word.split("-");
  const hasAdjective = parts.length >= 2 && /^[a-z]+$/.test(parts[0]);
  const hasAnimal = parts.some((p) => ANIMALS.includes(p));
  const numPart = parts.find((p) => /^\d+$/.test(p));
  const specificNumber =
    numPart !== undefined && !/^(0|10|100|1000|123|1234)$/.test(numPart);
  if (hasAdjective && hasAnimal && numPart !== undefined) score += 2;
  if (specificNumber) score += 1;
  if (word.length >= 8 && word.length <= 20) score += 1;
  if (!GENERIC_FILLER.some((f) => word.includes(f))) score += 1;
  if (hasAnimal) score += 1;
  return score;
}

const CHALLENGERS = ["agent-123", "cool-user-99", "user123456", "best-agent-10"];
const ourScore = rubric(USERNAME);
console.log(`justification: ${USERNAME} rubric ${ourScore}/6`);
for (const challenger of CHALLENGERS) {
  const cScore = rubric(challenger);
  console.log(`  challenger ${challenger}: rubric ${cScore}/6`);
  if (cScore >= ourScore) {
    fail(`challenger ${challenger} (${cScore}) ties/beats our word (${ourScore})`);
  }
}
if (ourScore < 6) fail(`our word scores ${ourScore}/6, expected 6`);
console.log("justification check passed: crisp-gecko-23 beats every generic challenger");

// Re-read and validate against the published gate.
const written = readFileSync(OUT_PATH, "utf8");
const chars = [...written];

if (written.trim().length === 0) fail("entry is blank");
if (chars.length < 1 || chars.length > 30) {
  fail(`entry is ${chars.length} characters, must be 1-30`);
}
if (/\s/.test(written)) fail("entry contains whitespace — must be one word");
if (written !== USERNAME) fail("entry does not match the chosen username");

const bytes = Buffer.byteLength(written, "utf8");
console.log(`OK: entry.txt = ${JSON.stringify(written)}`);
console.log(`chars: ${chars.length}, bytes: ${bytes}`);

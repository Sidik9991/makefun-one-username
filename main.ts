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

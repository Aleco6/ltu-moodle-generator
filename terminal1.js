/*
Terminal 1 — Syntax Console
Fix syntax only. Do not rename identifiers or change logic.
There are 6 syntax errors.
*/

'use strict';

const team = ['Dev', 'QA', 'UX'];

function safeJoin(arr, sep = ', ') {
  return arr.filter(Boolean).join(sep);
}

const phrase = "Tiny errors. Big consequences.";
const shout = phrase.toUpperCase();

const meta = {
  room: 'Office-13',
  boss: 'Victor Kanban',
  locked: true,
};

function checksum(str) {
  return [...str].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 10;
}

function pinDigit(seed) {
  const x = (seed * 9301 + 49297) % 233280;
  return Math.floor(x / 233280 * 10);
}

function main() {
  if (meta.locked === true) console.log('Victor: Still locked.');
  const banner = `${shout} :: ${safeJoin(team)}`;
  console.log(banner);

  const seed = checksum(banner);
  const d = pinDigit(seed);

  console.log('PIN digit:', d);
  return d;
}

main();


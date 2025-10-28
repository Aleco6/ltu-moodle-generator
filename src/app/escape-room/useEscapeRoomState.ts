"use client";

import { useMemo, useState } from "react";
import type { InventoryItem, SafeDigits } from "./types";

export function useEscapeRoomState() {
  // Answers (could be externalized/configured)
  const SAFE_CODE = useMemo(() => ["3", "5", "4"], []);
  const WORD_CODE = useMemo(() => "LAMP", []);

  // Safe lock
  const [safeDigits, setSafeDigits] = useState<SafeDigits>({ a: "", b: "", c: "" });
  const [safeSolved, setSafeSolved] = useState(false);
  const [safeError, setSafeError] = useState<string | null>(null);
  const [showSafeHint, setShowSafeHint] = useState(false);

  // Word lock
  const [word, setWord] = useState("");
  const [wordSolved, setWordSolved] = useState(false);
  const [wordError, setWordError] = useState<string | null>(null);
  const [showWordHint, setShowWordHint] = useState(false);

  // Exploration
  const [foundDeskNote, setFoundDeskNote] = useState(false);
  const [foundPaintingNote, setFoundPaintingNote] = useState(false);

  // Final door
  const [doorUnlocked, setDoorUnlocked] = useState(false);

  const inventory: InventoryItem[] = useMemo(() => {
    const items: InventoryItem[] = [];
    if (foundDeskNote) {
      items.push({
        id: "desk-note",
        label: "Note: Sum Twelve",
        note:
          "Three digits. They add to 12. The second is two more than the first. The third is one more than the first.",
      });
    }
    if (foundPaintingNote) {
      items.push({
        id: "painting-note",
        label: "Note: Caesar -1",
        note: "A scrap reads 'MBNQ'. Below it: 'Shift each letter back by one'.",
      });
    }
    return items;
  }, [foundDeskNote, foundPaintingNote]);

  const hasKey = safeSolved && wordSolved;

  function trySafe() {
    const attempt = [safeDigits.a, safeDigits.b, safeDigits.c];
    if (attempt.join("") === SAFE_CODE.join("")) {
      setSafeSolved(true);
      setSafeError(null);
    } else {
      setSafeSolved(false);
      setSafeError("That combination doesn’t open the safe.");
    }
  }

  function tryWord() {
    if (word.toUpperCase().trim() === WORD_CODE) {
      setWordSolved(true);
      setWordError(null);
    } else {
      setWordSolved(false);
      setWordError("The lock doesn’t accept that word.");
    }
  }

  function unlockDoor() {
    if (hasKey) setDoorUnlocked(true);
  }

  return {
    // Safe
    safeDigits,
    setSafeDigits,
    safeSolved,
    safeError,
    trySafe,
    showSafeHint,
    toggleSafeHint: () => setShowSafeHint((s) => !s),
    // Word
    word,
    setWord,
    wordSolved,
    wordError,
    tryWord,
    showWordHint,
    toggleWordHint: () => setShowWordHint((s) => !s),
    // Exploration
    foundDeskNote,
    setFoundDeskNote,
    foundPaintingNote,
    setFoundPaintingNote,
    // Inventory
    inventory,
    hasKey,
    // Door
    doorUnlocked,
    unlockDoor,
  } as const;
}


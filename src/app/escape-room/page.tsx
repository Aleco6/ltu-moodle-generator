"use client";

import InventoryPanel from "./components/InventoryPanel";
import Exploration from "./components/Exploration";
import SafeLock from "./components/SafeLock";
import WordLock from "./components/WordLock";
import DoorPanel from "./components/DoorPanel";
import { useEscapeRoomState } from "./useEscapeRoomState";

export default function EscapeRoomPage() {
  const state = useEscapeRoomState();

  return (
    <section className="max-w-5xl mx-auto p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Escape Room</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Basics: explore, collect notes, solve two locks, and open the door.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-lg border p-4 bg-white/60 dark:bg-zinc-900/60">
          <h2 className="text-lg font-medium mb-2">The Room</h2>
          {!state.doorUnlocked ? (
            <p className="text-sm leading-relaxed">
              You wake in a quiet study. A sturdy door blocks your escape. A
              tidy desk sits under a lamp, and a portrait hangs slightly askew.
              Somewhere in here are the clues you need.
            </p>
          ) : (
            <p className="text-sm leading-relaxed">
              The door swings open with a satisfying click. You made it out —
              nicely done!
            </p>
          )}
        </div>

        <InventoryPanel
          items={state.inventory}
          hasKey={state.hasKey}
          doorUnlocked={state.doorUnlocked}
        />
      </div>

      <Exploration
        foundDeskNote={state.foundDeskNote}
        onPickupDesk={() => state.setFoundDeskNote(true)}
        foundPaintingNote={state.foundPaintingNote}
        onPickupPainting={() => state.setFoundPaintingNote(true)}
      />

      <section className="grid gap-4 md:grid-cols-2">
        <SafeLock
          digits={state.safeDigits}
          setDigits={state.setSafeDigits}
          solved={state.safeSolved}
          error={state.safeError}
          onTry={state.trySafe}
          showHint={state.showSafeHint}
          onToggleHint={state.toggleSafeHint}
        />

        <WordLock
          word={state.word}
          setWord={state.setWord}
          solved={state.wordSolved}
          error={state.wordError}
          onTry={state.tryWord}
          showHint={state.showWordHint}
          onToggleHint={state.toggleWordHint}
        />
      </section>

      <DoorPanel
        hasKey={state.hasKey}
        doorUnlocked={state.doorUnlocked}
        onUnlock={state.unlockDoor}
      />
    </section>
  );
}

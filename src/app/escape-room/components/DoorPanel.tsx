type Props = {
  hasKey: boolean;
  doorUnlocked: boolean;
  onUnlock: () => void;
};

export default function DoorPanel({ hasKey, doorUnlocked, onUnlock }: Props) {
  return (
    <section className="rounded-lg border p-4 bg-white/60 dark:bg-zinc-900/60">
      <h3 className="font-semibold">The Door</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
        A heavy lock sits beneath the handle.
      </p>

      <div className="mt-3 flex items-center gap-3">
        <button
          className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-60"
          onClick={onUnlock}
          disabled={!hasKey || doorUnlocked}
          title={!hasKey ? "You need the key first" : "Unlock the door"}
        >
          {doorUnlocked ? "Door Unlocked" : "Use the key"}
        </button>
        {!hasKey && !doorUnlocked && (
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Find and combine what you discovered.
          </span>
        )}
      </div>
    </section>
  );
}


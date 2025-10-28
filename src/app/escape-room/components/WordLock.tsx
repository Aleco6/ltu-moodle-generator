type Props = {
  word: string;
  setWord: (value: string) => void;
  solved: boolean;
  error: string | null;
  onTry: () => void;
  showHint: boolean;
  onToggleHint: () => void;
};

export default function WordLock({
  word,
  setWord,
  solved,
  error,
  onTry,
  showHint,
  onToggleHint,
}: Props) {
  return (
    <div className="rounded-lg border p-4 bg-white/60 dark:bg-zinc-900/60">
      <h3 className="font-semibold">Drawer Word Lock (4 letters)</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
        Enter the four-letter word to release the latch.
      </p>

      <div className="mt-3 flex gap-2 items-end">
        <input
          value={word}
          onChange={(e) => setWord(e.target.value)}
          disabled={solved}
          className="flex-1 rounded-md border p-2 uppercase tracking-widest disabled:bg-gray-100 dark:disabled:bg-zinc-800"
          placeholder="WORD"
          maxLength={12}
        />
        <button
          className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800"
          onClick={onTry}
          disabled={solved}
        >
          Try
        </button>
      </div>

      {error && !solved && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</div>
      )}

      {solved && (
        <div className="mt-2 rounded border border-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 p-2 text-sm text-emerald-700 dark:text-emerald-200">
          The drawer slides open. Inside is a small brass keyplate.
        </div>
      )}

      <button
        className="mt-3 text-xs text-blue-700 hover:underline dark:text-blue-300"
        onClick={onToggleHint}
      >
        {showHint ? "Hide hint" : "Show hint"}
      </button>
      {showHint && (
        <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
          The scrap reads “MBNQ”. A scribble below says: “Shift each letter
          back by one.”
        </div>
      )}
    </div>
  );
}


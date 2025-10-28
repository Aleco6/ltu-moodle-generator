import type { SafeDigits } from "../types";

type Props = {
  digits: SafeDigits;
  setDigits: (updater: (prev: SafeDigits) => SafeDigits) => void;
  solved: boolean;
  error: string | null;
  onTry: () => void;
  showHint: boolean;
  onToggleHint: () => void;
};

export default function SafeLock({
  digits,
  setDigits,
  solved,
  error,
  onTry,
  showHint,
  onToggleHint,
}: Props) {
  return (
    <div className="rounded-lg border p-4 bg-white/60 dark:bg-zinc-900/60">
      <h3 className="font-semibold">Desk Safe (3 digits)</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
        Enter the three-digit combination to open the safe.
      </p>

      <div className="mt-3 flex gap-2">
        {["a", "b", "c"].map((k) => (
          <input
            key={k}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={(digits as any)[k]}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 1);
              setDigits((prev) => ({ ...prev, [k]: v }));
            }}
            disabled={solved}
            className="w-12 rounded-md border p-2 text-center text-lg tracking-widest disabled:bg-gray-100 dark:disabled:bg-zinc-800"
            placeholder="-"
          />
        ))}
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
          Click! Inside you find a small brass token.
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
          The sticky note mentions: “Three digits add to 12. The second is two
          more than the first. The third is one more than the first.”
        </div>
      )}
    </div>
  );
}


type Props = {
  foundDeskNote: boolean;
  onPickupDesk: () => void;
  foundPaintingNote: boolean;
  onPickupPainting: () => void;
};

export default function Exploration({
  foundDeskNote,
  onPickupDesk,
  foundPaintingNote,
  onPickupPainting,
}: Props) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border p-4 bg-white/60 dark:bg-zinc-900/60">
        <h3 className="font-medium mb-1">Examine Desk</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          The desk drawer has a three-digit safe and a loose sticky note.
        </p>
        {!foundDeskNote ? (
          <button
            className="mt-3 inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800"
            onClick={onPickupDesk}
          >
            Take the sticky note
          </button>
        ) : (
          <div className="mt-3 text-sm text-emerald-700 dark:text-emerald-200">
            You pocket the note.
          </div>
        )}
      </div>

      <div className="rounded-lg border p-4 bg-white/60 dark:bg-zinc-900/60">
        <h3 className="font-medium mb-1">Check the Painting</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          The portrait is slightly crooked. Behind it, a small scrap of paper
          flutters free.
        </p>
        {!foundPaintingNote ? (
          <button
            className="mt-3 inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-zinc-800"
            onClick={onPickupPainting}
          >
            Take the scrap
          </button>
        ) : (
          <div className="mt-3 text-sm text-emerald-700 dark:text-emerald-200">
            You pocket the scrap.
          </div>
        )}
      </div>
    </section>
  );
}


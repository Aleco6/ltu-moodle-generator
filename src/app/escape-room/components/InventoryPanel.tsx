import type { InventoryItem } from "../types";

type Props = {
  items: InventoryItem[];
  hasKey: boolean;
  doorUnlocked: boolean;
};

export default function InventoryPanel({ items, hasKey, doorUnlocked }: Props) {
  return (
    <aside className="rounded-lg border p-4 bg-white/60 dark:bg-zinc-900/60">
      <h2 className="text-lg font-medium mb-2">Inventory</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">Empty</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="text-sm">
              <div className="font-medium">{item.label}</div>
              {item.note && (
                <div className="text-gray-700 dark:text-gray-300 mt-0.5">{item.note}</div>
              )}
            </li>
          ))}
        </ul>
      )}
      {hasKey && !doorUnlocked && (
        <div className="mt-3 rounded border border-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 p-2 text-sm text-emerald-700 dark:text-emerald-200">
          You found a small key.
        </div>
      )}
    </aside>
  );
}


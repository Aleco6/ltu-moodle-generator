"use client";

import { useState, useMemo, useEffect } from "react";
import { getStoredTabData, storeTabData } from "@/lib/storage";

export default function TabsBuilder() {
  const [title, setTitle] = useState("LTU Moodle - Tabs Generator");
  const [tabCount, setTabCount] = useState(1);
  const [labels, setLabels] = useState<string[]>(["Tab 1"]);
  const [contents, setContents] = useState<string[]>([
    "Replace this with your content for Tab 1.",
  ]);
  const [accent, setAccent] = useState("#2563eb");
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const stored = getStoredTabData();
    setTitle(stored.title);
    setTabCount(stored.count);
    setLabels(stored.labels);
    setContents(stored.contents);
    setAccent(stored.accent);
    setIsLoading(false);
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    storeTabData({
      title,
      count: tabCount,
      labels,
      contents,
      accent,
    });
  }, [title, tabCount, labels, contents, accent, hasLoaded]);

  const uiLabels = useMemo(() => {
    const a = [...labels];
    while (a.length < tabCount) a.push("");
    return a.slice(0, tabCount);
  }, [labels, tabCount]);

  const uiContents = useMemo(() => {
    const a = [...contents];
    while (a.length < tabCount) a.push("");
    return a.slice(0, tabCount);
  }, [contents, tabCount]);

  const snippet = useMemo(
    () => generateTabsHTML({ title, labels: uiLabels, contents: uiContents, themeColor: accent }),
    [title, uiLabels, uiContents, accent]
  );

  const validateTabCount = (count: number) => {
    return Math.max(1, Math.min(8, count));
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      alert("Copied! Paste into Hello.html and open it.");
    } catch {
      alert("Copy failed. Select the text manually.");
    }
  };

  const download = () => {
    const blob = new Blob([snippet], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Hello.html";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Tabs Generator</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Outputs HTML5 + JS with <strong>inline CSS only</strong> (no classes).
        </p>
      </header>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1">
          <label className="block text-sm font-medium" htmlFor="title">Title</label>
          <input
            id="title"
            className="w-full rounded border px-3 py-2 bg-white dark:bg-neutral-900"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium" htmlFor="count">Tabs</label>
          <input
            id="count"
            type="number"
            min={1}
            max={8}
            className="w-full rounded border px-3 py-2 bg-white dark:bg-neutral-900"
            value={tabCount}
            onChange={(e) => setTabCount(validateTabCount(Number(e.target.value)))}
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium" htmlFor="accent">Accent</label>
          <input 
            id="accent" 
            type="color" 
            value={accent} 
            onChange={(e) => setAccent(e.target.value)} 
          />
        </div>
        <div className="md:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold">Tab Labels</h2>
          {uiLabels.map((lbl, i) => (
            <div key={`label-${i}`} className="space-y-1">
              <label className="block text-xs font-medium" htmlFor={`label-${i}`}>
                Label for Tab {i + 1}
              </label>
              <input
                id={`label-${i}`}
                className="w-full rounded border px-3 py-2 text-sm bg-white dark:bg-neutral-900"
                placeholder={`Tab ${i + 1}`}
                value={lbl}
                onChange={(e) => {
                  const next = [...labels];
                  while (next.length < i + 1) next.push("");
                  next[i] = e.target.value;
                  setLabels(next);
                }}
              />
            </div>
          ))}
        </div>
        <div className="md:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold">Tab Contents</h2>
          {uiLabels.map((lbl, i) => (
            <div key={`content-${i}`} className="space-y-1">
              <label className="block text-xs font-medium" htmlFor={`content-${i}`}>
                Content for &quot;{lbl?.trim() ? lbl : `Tab ${i + 1}`}&quot;
              </label>
              <textarea
                id={`content-${i}`}
                className="w-full rounded border p-2 text-sm bg-white dark:bg-neutral-900"
                rows={4}
                placeholder={`Replace this with your content for ${lbl?.trim() ? lbl : `Tab ${i + 1}`}.`}
                value={uiContents[i] ?? ""}
                onChange={(e) => {
                  const next = [...contents];
                  while (next.length < i + 1) next.push("");
                  next[i] = e.target.value;
                  setContents(next);
                }}
              />
            </div>
          ))}
        </div>
      </form>
      <div className="flex gap-3">
        <button onClick={copy} className="rounded bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700">
          Copy
        </button>
        <button onClick={download} className="rounded border px-3 py-2 text-sm">
          Download Hello.html
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Generated Output</label>
        <textarea
          readOnly
          className="w-full h-[420px] rounded border p-3 font-mono text-xs bg-white dark:bg-neutral-900"
          value={snippet}
        />
      </div>
    </section>
  );
}

function generateTabsHTML({
  title,
  labels,
  contents,
  themeColor,
}: {
  title: string;
  labels: string[];
  contents: string[];
  themeColor: string;
}) {
  const safeLabels = labels.map((l, i) => (l?.trim() ? l : `Tab ${i + 1}`));
  const safeContents = contents.map((c, i) =>
    (c?.length ? c : `Replace this with your content for ${safeLabels[i]}.`)
  );
  const tabButtons = safeLabels
    .map((label, i) => {
      const tabId = `tab-${i + 1}`;
      const panelId = `panel-${i + 1}`;
      const isSelected = i === 0;
      return `<button role="tab" id="${tabId}" aria-controls="${panelId}" aria-selected="${isSelected}" tabindex="${
        isSelected ? "0" : "-1"
      }" style="padding:8px 12px; border:1px solid ${themeColor}; background:${isSelected ? themeColor : "transparent"}; color:${
        isSelected ? "#ffffff" : themeColor
      }; border-radius:6px; cursor:pointer; margin-right:8px;">${escapeHtml(label)}</button>`;
    })
    .join("\n");
  const panels = safeLabels
    .map((label, i) => {
      const tabId = `tab-${i + 1}`;
      const panelId = `panel-${i + 1}`;
      const isSelected = i === 0;
      const body = escapeHtmlWithBreaks(safeContents[i]);
      return `<div role="tabpanel" id="${panelId}" aria-labelledby="${tabId}" ${
        isSelected ? "" : "hidden"
      } style="padding:16px; border:1px solid #e5e7eb; border-radius:8px; margin-top:12px;">
  <h2 style="margin:0 0 8px 0; font-size:18px;">${escapeHtml(label)}</h2>
  <p style="margin:0; line-height:1.5;">${body}</p>
</div>`;
    })
    .join("\n");
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;; line-height: 1.5; padding: 24px;">
    
    <h1 style="margin-top: 0; font-size: 24px;">${escapeHtml(title)}</h1>

    <div role="tablist" aria-label="Tabs" style="display: flex; flex-wrap: wrap; align-items: center;">
      ${tabButtons}
    </div>

    ${panels}

    <script>
      (function () {
        var tablist = document.querySelector('[role="tablist"]');
        if (!tablist) return;

        function setActive(index) {
          var tabs = tablist.querySelectorAll('[role="tab"]');
          var panels = document.querySelectorAll('[role="tabpanel"]');

          tabs.forEach(function (tab, i) {
            var selected = i === index;

            tab.setAttribute('aria-selected', String(selected));
            tab.setAttribute('tabindex', selected ? '0' : '-1');

            var panelId = tab.getAttribute('aria-controls');
            var panel = panelId ? document.getElementById(panelId) : null;

            if (panel) {
              if (selected) {
                panel.removeAttribute('hidden');
              } else {
                panel.setAttribute('hidden', '');
              }
            }

            tab.style.background = selected ? '${themeColor}' : 'transparent';
            tab.style.color = selected ? '#ffffff' : '${themeColor}';
          });

          if (tabs[index] && typeof tabs[index].focus === 'function') {
            tabs[index].focus();
          }
        }

        tablist.addEventListener('click', function (e) {
          var target = e.target;
          if (!(target instanceof HTMLElement)) return;

          if (target.getAttribute('role') === 'tab') {
            var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
            var index = tabs.indexOf(target);
            if (index > -1) setActive(index);
          }
        });

        tablist.addEventListener('keydown', function (e) {
          var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
          var current = tabs.findIndex(function (t) {
            return t.getAttribute('aria-selected') === 'true';
          });

          if (current < 0) current = 0;

          if (e.key === 'ArrowRight') {
            e.preventDefault();
            setActive((current + 1) % tabs.length);
          }

          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setActive((current - 1 + tabs.length) % tabs.length);
          }

          if (e.key === 'Home') {
            e.preventDefault();
            setActive(0);
          }

          if (e.key === 'End') {
            e.preventDefault();
            setActive(tabs.length - 1);
          }
        });
      })();
    </script>

  </body>
</html>`;
}

function escapeHtml(s: string) {
  return s.replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeHtmlWithBreaks(s: string) {
  return escapeHtml(s).replaceAll("\n", "<br>");
}

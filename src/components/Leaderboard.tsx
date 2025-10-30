'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';

interface Attempt {
  id: string;
  player: string;
  difficulty: Difficulty;
  durationSec: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const difficultyLabels: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard'
};

const sortAttempts = (attempts: Attempt[]) =>
  [...attempts].sort((a, b) => {
    if (a.durationSec !== b.durationSec) {
      return a.durationSec - b.durationSec;
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

const formatDuration = (seconds: number) => {
  if (!Number.isFinite(seconds)) {
    return '-';
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const API_BASE = '/api/attempts';

export function Leaderboard() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadAttempts = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(API_BASE, { cache: 'no-store' });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? 'Failed to load leaderboard.');
      }
      const data = await response.json();
      // Handle both array format and object with attempts property
      const attemptsArray = Array.isArray(data) ? data : (data.attempts ?? []);
      setAttempts(sortAttempts(attemptsArray));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAttempts();
  }, [loadAttempts]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAttempts();
    setRefreshing(false);
  };

  const bestTime = useMemo(() => {
    if (!attempts.length) return null;
    return attempts[0].durationSec;
  }, [attempts]);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Leaderboard</h1>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Attempts are logged automatically when players escape. Faster clears rise to the top.
            </p>
            {bestTime !== null && (
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-green-600 dark:text-green-400">
                Current record: {formatDuration(bestTime)}
              </p>
            )}
          </div>
          <Button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            variant="outline"
            className="gap-2"
          >
            {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-100/10 p-4 text-sm text-red-600 dark:border-red-500/60 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
          <thead className="bg-neutral-100 text-xs font-semibold uppercase tracking-widest text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            <tr>
              <th className="px-4 py-3 text-left">Rank</th>
              <th className="px-4 py-3 text-left">Player</th>
              <th className="px-4 py-3 text-left">Difficulty</th>
              <th className="px-4 py-3 text-left">Duration</th>
              <th className="px-4 py-3 text-left">Completed</th>
              <th className="px-4 py-3 text-left">Recorded</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 text-sm dark:divide-neutral-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading attempts...
                  </div>
                </td>
              </tr>
            ) : attempts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-neutral-500 dark:text-neutral-400">
                  No escape attempts recorded yet.
                </td>
              </tr>
            ) : (
              attempts.map((attempt, index) => {
                const isLeader = bestTime !== null && attempt.durationSec === bestTime;
                return (
                  <tr
                    key={attempt.id}
                    className={isLeader ? 'bg-green-50 dark:bg-green-950/30' : ''}
                  >
                    <td className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-300">
                      #{index + 1}
                    </td>
                    <td className="px-4 py-3 font-mono tracking-widest text-neutral-800 dark:text-neutral-200">
                      {attempt.player}
                    </td>
                    <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">
                      {difficultyLabels[attempt.difficulty]}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {formatDuration(attempt.durationSec)}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {attempt.durationSec} sec
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          attempt.completed
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                            : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
                        }`}
                      >
                        {attempt.completed ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">
                      {new Date(attempt.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

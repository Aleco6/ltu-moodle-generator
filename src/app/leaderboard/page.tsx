import { Metadata } from 'next';
import { Leaderboard } from '@/components/Leaderboard';

export const metadata: Metadata = {
  title: 'Leaderboard | Scrum Mastermind Escape Room',
  description: 'Track the fastest escape attempts across all difficulties.'
};

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-10 dark:bg-neutral-950">
      <div className="mx-auto w-full max-w-6xl px-4">
        <Leaderboard />
      </div>
    </div>
  );
}

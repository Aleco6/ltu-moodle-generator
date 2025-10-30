import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Trophy, Timer, ListOrdered, User, AlertCircle, RotateCw, ArrowRight } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';
type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface VictoryDialogProps {
  playerName: string;
  difficulty: Difficulty;
  durationSec: number;
  totalTasks: number;
  completedTasks: number;
  attemptId?: string | null;
  saveState: SaveState;
  saveError?: string | null;
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
  onRetrySave: () => void;
}

const difficultyLabels: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard'
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function VictoryDialog({
  playerName,
  difficulty,
  durationSec,
  totalTasks,
  completedTasks,
  attemptId,
  saveState,
  saveError,
  onPlayAgain,
  onViewLeaderboard,
  onRetrySave
}: VictoryDialogProps) {
  const renderSaveMessage = () => {
    if (saveState === 'error') {
      return (
        <div className="flex items-start gap-3 rounded-md border border-red-500/60 bg-red-950/50 p-3 text-left">
          <AlertCircle className="mt-0.5 h-5 w-5 text-red-300" />
          <div>
            <p className="font-semibold text-red-200">Attempt not saved</p>
            <p className="text-sm text-red-200/80">{saveError ?? 'Unknown error occurred.'}</p>
            <Button
              onClick={onRetrySave}
              size="sm"
              variant="outline"
              className="mt-3 border-red-500 text-red-200 hover:bg-red-900"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Retry Save
            </Button>
          </div>
        </div>
      );
    }

    if (saveState === 'saved') {
      return (
        <div className="rounded-md border border-green-500/70 bg-green-900/40 p-3 text-left text-green-200">
          Attempt saved to the leaderboard{attemptId ? ` (#${attemptId})` : ''}!
        </div>
      );
    }

    const message = saveState === 'saving'
      ? 'Saving your run to the leaderboard...'
      : 'Preparing your leaderboard entry...';

    return (
      <div className="rounded-md border border-slate-500/70 bg-slate-900/40 p-3 text-left text-slate-200">
        {message}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-gradient-to-br from-green-900 to-slate-900 border-2 border-green-500 rounded-lg p-8 shadow-2xl"
      >
        <div className="space-y-6 text-center">
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 2
            }}
            className="flex justify-center"
          >
            <Trophy className="h-24 w-24 text-yellow-400" />
          </motion.div>

          <div>
            <h1 className="text-4xl font-bold text-green-300">Escape Successful!</h1>
            <p className="mt-2 text-slate-200">
              Sprint Zero has been conquered. The door swings wide open.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
            <div className="rounded-lg border border-green-500/50 bg-slate-950/40 p-4">
              <div className="flex items-center gap-2 text-green-300">
                <User className="h-5 w-5" />
                <span className="text-sm uppercase tracking-widest">{playerName}</span>
              </div>
              <p className="mt-2 text-xs text-slate-300/80">Arcade Champion</p>
            </div>
            <div className="rounded-lg border border-green-500/50 bg-slate-950/40 p-4">
              <div className="flex items-center gap-2 text-green-300">
                <Timer className="h-5 w-5" />
                <span className="text-lg font-semibold">{formatDuration(durationSec)}</span>
              </div>
              <p className="mt-2 text-xs text-slate-300/80">Clear Time ({difficultyLabels[difficulty]})</p>
            </div>
            <div className="rounded-lg border border-green-500/50 bg-slate-950/40 p-4">
              <div className="flex items-center gap-2 text-green-300">
                <ListOrdered className="h-5 w-5" />
                <span className="text-lg font-semibold">
                  {completedTasks}/{totalTasks}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-300/80">Challenges Completed</p>
            </div>
          </div>

          {renderSaveMessage()}

          <div className="space-y-3 pt-2">
            <Button
              onClick={onViewLeaderboard}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              View Leaderboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={onPlayAgain}
              variant="outline"
              className="w-full border-green-500 text-green-300 hover:bg-green-900"
              size="lg"
            >
              Play Again
            </Button>
          </div>

          <p className="pt-2 text-xs text-slate-400">
            Thanks for playing &quot;The Scrum Mastermind Escape Room&quot;
          </p>
        </div>
      </motion.div>
    </div>
  );
}

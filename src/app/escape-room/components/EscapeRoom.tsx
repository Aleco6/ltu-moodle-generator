import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Timer, AlertTriangle } from 'lucide-react';
import { getTasksForDifficulty } from '../challengeBank';
import { ChallengeDialog } from './ChallengeDialog';
import { HintDialog } from './HintDialog';
import { PinDialog } from './PinDialog';
import { VictoryDialog } from './VictoryDialog';

interface Terminal {
  id: number;
  title: string;
  description: string;
  position: { x: string; y: string };
}

interface HintSpot {
  id: number;
  terminalId: number;
  position: { x: string; y: string };
  hint: string;
}

type Difficulty = 'easy' | 'medium' | 'hard';

type AttemptSaveState = 'idle' | 'saving' | 'saved' | 'error';

interface AttemptRecord {
  id: string;
  player: string;
  difficulty: Difficulty;
  durationSec: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EscapeRoomProps {
  playerName: string;
  difficulty: Difficulty;
  timerMinutes: number;
}

// Terminal positions (RED DOTS)
const terminals: Terminal[] = [
  {
    id: 1,
    title: 'Terminal 1: Syntax Sprint',
    description: 'Fix syntax errors and complete basic functions',
    position: { x: '22%', y: '45%' }
  },
  {
    id: 2,
    title: 'Terminal 2: Transform Test',
    description: 'Master data transformation challenges',
    position: { x: '59.7%', y: '50.5%' }
  },
  {
    id: 3,
    title: 'Terminal 3: Debug Deploy',
    description: 'Hunt down and fix logic bugs',
    position: { x: '41.0%', y: '62.5%' }
  }
];

// Hint paper positions (BLUE DOTS)
const hintSpots: HintSpot[] = [
  {
    id: 1,
    terminalId: 1,
    position: { x: '21.0%', y: '67.0%' },
    hint: 'For syntax errors: Look for missing commas, semicolons, and comparison operators.'
  },
  {
    id: 2,
    terminalId: 2,
    position: { x: '49.1%', y: '55.0%' },
    hint: 'For transformations: Use forEach/map/filter/reduce to manipulate arrays and objects.'
  },
  {
    id: 3,
    terminalId: 3,
    position: { x: '21.1%', y: '30.4%' },
    hint: 'For debugging: Check operators (= vs ===), loop conditions, and variable scope.'
  }
];

// Door position (GREEN DOT)
const doorPosition = { x: '90.4%', y: '47.8%' };

export function EscapeRoom({ playerName, difficulty, timerMinutes }: EscapeRoomProps) {
  const [selectedTerminal, setSelectedTerminal] = useState<{ terminal: Terminal; taskIndex: number } | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [terminalProgress, setTerminalProgress] = useState<Map<number, number>>(new Map([[1, 0], [2, 0], [3, 0]]));
  const [collectedDigits, setCollectedDigits] = useState<number[]>([]);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [selectedHint, setSelectedHint] = useState<HintSpot | null>(null);
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());
  const [positioningMode, setPositioningMode] = useState(false);
  const [clickedPosition, setClickedPosition] = useState<{ x: string; y: string } | null>(null);
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(timerMinutes * 60); // Convert to seconds
  const [timerActive, setTimerActive] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [durationSec, setDurationSec] = useState<number | null>(null);
  const [attemptSaveState, setAttemptSaveState] = useState<AttemptSaveState>('idle');
  const [attemptError, setAttemptError] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const tasks = getTasksForDifficulty(difficulty);
  const totalTasksPerTerminal = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
  const totalTasks = totalTasksPerTerminal * 3;
  const allTerminalsComplete = Array.from(terminalProgress.values()).every(
    progress => progress === totalTasksPerTerminal
  );

  // Timer countdown effect
  useEffect(() => {
    if (!timerActive || timeRemaining <= 0 || showVictory) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setGameOver(true);
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timeRemaining, showVictory]);

  useEffect(() => {
    if (!showVictory || durationSec === null || attemptSaveState !== 'idle') {
      return;
    }

    const controller = new AbortController();

    const submitAttempt = async () => {
      try {
        setAttemptSaveState('saving');
        setAttemptError(null);

        const response = await fetch('/api/attempts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            player: playerName,
            difficulty,
            durationSec,
            completed: true
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`Failed to save attempt (${response.status})`);
        }

        const data = (await response.json()) as { attempt?: AttemptRecord };
        if (data.attempt?.id) {
          setAttemptId(data.attempt.id);
        }

        setAttemptSaveState('saved');
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error('Failed to save attempt', error);
        setAttemptError(error instanceof Error ? error.message : 'Unknown error');
        setAttemptSaveState('error');
      }
    };

    submitAttempt();

    return () => {
      controller.abort();
    };
  }, [showVictory, durationSec, attemptSaveState, playerName, difficulty]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const percentage = (timeRemaining / (timerMinutes * 60)) * 100;
    if (percentage > 50) return 'text-green-400';
    if (percentage > 25) return 'text-yellow-400';
    return 'text-red-400';
  };

  const handleTaskComplete = (taskId: string, terminalId: number, digit: number) => {
    setCompletedTasks(prev => new Set([...prev, taskId]));
    setTerminalProgress(prev => {
      const newMap = new Map(prev);
      newMap.set(terminalId, (newMap.get(terminalId) || 0) + 1);
      return newMap;
    });
    setCollectedDigits(prev => [...prev, digit]);
    setSelectedTerminal(null);
  };

  const handleTerminalClick = (terminal: Terminal) => {
    if (gameOver) return;
    
    const currentProgress = terminalProgress.get(terminal.id) || 0;
    if (currentProgress >= totalTasksPerTerminal) return; // Terminal complete
    
    setSelectedTerminal({ terminal, taskIndex: currentProgress });
  };

  const handlePinSubmit = () => {
    if (allTerminalsComplete) {
      const elapsed = Math.max(timerMinutes * 60 - timeRemaining, 0);
      setDurationSec(elapsed);
      setAttemptSaveState('idle');
      setAttemptError(null);
      setAttemptId(null);
      setShowVictory(true);
      setTimerActive(false);
    }
  };

  const handleHintClick = (hint: HintSpot) => {
    setRevealedHints(prev => new Set([...prev, hint.id]));
    setSelectedHint(hint);
  };

  const handleDoorClick = () => {
    if (allTerminalsComplete) {
      setShowPinDialog(true);
    }
  };

  const handleRetrySaveAttempt = () => {
    if (attemptSaveState === 'saving') {
      return;
    }
    setAttemptError(null);
    setAttemptId(null);
    setAttemptSaveState('idle');
  };

  const handleManualSave = async () => {
    if (attemptSaveState === 'saving' || attemptSaveState === 'saved') {
      return;
    }

    try {
      setAttemptSaveState('saving');
      setAttemptError(null);

      const currentDuration = (timerMinutes * 60) - timeRemaining;
      const isCompleted = allTerminalsComplete && showVictory;

      const response = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player: playerName,
          difficulty,
          durationSec: currentDuration,
          completed: isCompleted
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save attempt (${response.status})`);
      }

      const data = (await response.json()) as { id?: string };
      if (data.id) {
        setAttemptId(data.id);
      }

      setAttemptSaveState('saved');
      
      // Reset to idle after 3 seconds to allow saving again
      setTimeout(() => {
        setAttemptSaveState('idle');
      }, 3000);
    } catch (error) {
      console.error('Failed to save attempt', error);
      setAttemptError(error instanceof Error ? error.message : 'Unknown error');
      setAttemptSaveState('error');
    }
  };

  const handlePlayAgain = () => {
    window.location.reload();
  };

  const handleViewLeaderboard = () => {
    window.location.href = '/leaderboard';
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!positioningMode) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
    setClickedPosition({ x: x + '%', y: y + '%' });
    console.log(`Position: { x: '${x}%', y: '${y}%' }`);
  };

  // Game Over Screen
  if (gameOver) {
    return (
      <div className="min-h-screen bg-red-50 dark:bg-red-950 flex items-center justify-center p-4">
        <div className="max-w-2xl bg-red-100 dark:bg-red-900 border-2 border-red-500 rounded-lg p-8 shadow-2xl text-center">
          <AlertTriangle className="w-24 h-24 text-red-700 dark:text-red-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-red-700 dark:text-red-400 mb-4">TIME&apos;S UP!</h1>
          <p className="text-xl text-red-700 dark:text-red-200 mb-6">
            Sprint Zero claims another victim. The project manager&apos;s process has consumed you.
          </p>
          <div className="bg-red-50 dark:bg-red-950/50 p-4 rounded border border-red-300 dark:border-red-400/50 mb-6">
            <p className="text-red-700 dark:text-red-300 italic">
              &quot;Perhaps next time you&apos;ll plan your sprints better. Consider this... a lesson in time management.&quot;
            </p>
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700"
            size="lg"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Victory Screen
  if (showVictory) {
    const finalDuration = durationSec ?? Math.max(timerMinutes * 60 - timeRemaining, 0);
    return (
      <VictoryDialog
        playerName={playerName}
        difficulty={difficulty}
        durationSec={finalDuration}
        totalTasks={totalTasks}
        completedTasks={completedTasks.size}
        attemptId={attemptId}
        saveState={attemptSaveState}
        saveError={attemptError}
        onPlayAgain={handlePlayAgain}
        onViewLeaderboard={handleViewLeaderboard}
        onRetrySave={handleRetrySaveAttempt}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
            Sprint Zero Escape Room
          </h1>
          
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <span>Player</span>
            <Badge variant="outline" className="border-red-500 text-red-600 dark:text-red-400">
              {playerName}
            </Badge>
          </div>
          
          {/* Timer */}
          <div className={`flex items-center gap-2 ${getTimerColor()}`}>
            <Timer className="w-6 h-6" />
            <span className="text-2xl font-bold">{formatTime(timeRemaining)}</span>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleManualSave}
              disabled={attemptSaveState === 'saving'}
              variant={attemptSaveState === 'saved' ? 'default' : 'outline'}
              size="sm"
              className={
                attemptSaveState === 'saved' 
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : attemptSaveState === 'error'
                  ? 'border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                  : ''
              }
            >
              {attemptSaveState === 'saving' ? 'Saving...' : 
               attemptSaveState === 'saved' ? 'Saved!' : 
               attemptSaveState === 'error' ? 'Retry Save' : 'Save Progress'}
            </Button>
            {attemptError && (
              <span className="text-xs text-red-600 dark:text-red-400 max-w-32 truncate" title={attemptError}>
                {attemptError}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-neutral-300 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Progress: {completedTasks.size} / {totalTasks} tasks completed
            </span>
            <Badge variant={allTerminalsComplete ? 'default' : 'outline'}>
              {allTerminalsComplete ? 'Ready to Escape!' : `Collected: ${collectedDigits.length} digits`}
            </Badge>
          </div>
          <Progress 
            value={(completedTasks.size / totalTasks) * 100} 
            className="h-2"
          />
        </div>

        {/* PIN Tracker */}
        <div className="mt-4 bg-white dark:bg-slate-800 rounded-lg p-4 border border-neutral-300 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              PIN Tracker
            </span>
            <Badge variant="outline" className="text-xs">
              {collectedDigits.length}/{totalTasks} digits logged
            </Badge>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-2">
            {Array.from({ length: totalTasks }).map((_, index) => {
              const digit = collectedDigits[index];
              return (
                <div
                  key={`pin-digit-${index}`}
                  className={`flex h-12 items-center justify-center rounded-md border text-lg font-semibold tracking-widest ${
                    digit !== undefined
                      ? 'border-green-500 bg-green-50 text-green-700 dark:border-green-500/70 dark:bg-green-900/30 dark:text-green-300'
                      : 'border-dashed border-slate-400 bg-slate-100 text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-600'
                  }`}
                >
                  {digit !== undefined ? digit : '—'}
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Each completed challenge logs a digit here. Use them in order when you reach the door terminal.
          </p>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-6xl mx-auto">
        <div className="relative bg-white dark:bg-slate-800 rounded-lg border border-neutral-300 dark:border-neutral-700 overflow-hidden">
          {/* Room Image */}
          <div 
            className="relative w-full cursor-pointer"
            onClick={handleImageClick}
          >
            <img 
              src="/room.png" 
              alt="Sprint Zero Development Room"
              className="w-full h-auto object-contain"
            />
            
            {/* Dark overlay for better dot visibility */}
            <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>

            {/* Terminal Dots (RED) */}
            {terminals.map((terminal) => {
              const progress = terminalProgress.get(terminal.id) || 0;
              const isComplete = progress >= totalTasksPerTerminal;
              
              return (
                <button
                  key={terminal.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTerminalClick(terminal);
                  }}
                  className={`absolute w-6 h-6 rounded-full border-3 border-white shadow-2xl transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-all z-10 ${
                    isComplete 
                      ? 'bg-green-500 hover:bg-green-400 shadow-green-500/50' 
                      : 'bg-red-500 hover:bg-red-400 shadow-red-500/50'
                  }`}
                  style={{ left: terminal.position.x, top: terminal.position.y }}
                  title={`${terminal.title} - ${progress}/${totalTasksPerTerminal} tasks complete`}
                />
              );
            })}

            {/* Hint Dots (BLUE) */}
            {hintSpots.map((hint) => (
              <button
                key={hint.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleHintClick(hint);
                }}
                className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-xl transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-all z-10 ${
                  revealedHints.has(hint.id)
                    ? 'bg-blue-300 hover:bg-blue-200 shadow-blue-300/50'
                    : 'bg-blue-500 hover:bg-blue-400 shadow-blue-500/50'
                }`}
                style={{ left: hint.position.x, top: hint.position.y }}
                title={`Hint for Terminal ${hint.terminalId} ${revealedHints.has(hint.id) ? '(viewed)' : ''}`}
              />
            ))}

            {/* Door Dot (GREEN) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDoorClick();
              }}
              className={`absolute w-7 h-7 rounded-full border-3 border-white shadow-2xl transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-all z-10 ${
                allTerminalsComplete
                  ? 'bg-green-500 hover:bg-green-400 animate-pulse shadow-green-500/70'
                  : 'bg-gray-500 cursor-not-allowed shadow-gray-500/30'
              }`}
              style={{ left: doorPosition.x, top: doorPosition.y }}
              title={allTerminalsComplete ? 'Click to enter PIN and escape!' : 'Complete all terminals first'}
              disabled={!allTerminalsComplete}
            />

            {/* Debug positioning dot */}
            {positioningMode && clickedPosition && (
              <div
                className="absolute w-2 h-2 bg-yellow-400 border border-black transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: clickedPosition.x, top: clickedPosition.y }}
              />
            )}
          </div>

          {/* Legend */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                <span>Coding Terminals</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                <span>Hint Papers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                <span>Exit Door</span>
              </div>
            </div>
          </div>
        </div>

        {/* Development Mode Toggle */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPositioningMode(!positioningMode)}
            >
              {positioningMode ? 'Exit' : 'Enter'} Positioning Mode
            </Button>
          </div>
        )}
      </div>

      {/* Dialogs */}
      {selectedTerminal && (
        <ChallengeDialog
          task={tasks[selectedTerminal.terminal.id as keyof typeof tasks][selectedTerminal.taskIndex]}
          terminalTitle={selectedTerminal.terminal.title}
          currentStage={selectedTerminal.taskIndex + 1}
          totalStages={totalTasksPerTerminal}
          onComplete={handleTaskComplete}
          onClose={() => setSelectedTerminal(null)}
        />
      )}

      {selectedHint && (
        <HintDialog
          hint={selectedHint}
          onClose={() => setSelectedHint(null)}
        />
      )}

      {showPinDialog && (
        <PinDialog
          expectedDigits={collectedDigits}
          onSubmit={handlePinSubmit}
          onClose={() => setShowPinDialog(false)}
        />
      )}
    </div>
  );
}

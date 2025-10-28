import { useState } from 'react';
import { EscapeRoom } from './components/EscapeRoom';
import { IntroDialog } from './components/IntroDialog';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function EscapeRoomPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [timerMinutes, setTimerMinutes] = useState(30);

  const handleStart = (selectedDifficulty: Difficulty, selectedTimer: number) => {
    setDifficulty(selectedDifficulty);
    setTimerMinutes(selectedTimer);
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen bg-purple-50 dark:bg-purple-950">
      {!gameStarted ? (
        <IntroDialog onStart={handleStart} />
      ) : (
        <EscapeRoom difficulty={difficulty} timerMinutes={timerMinutes} />
      )}
    </div>
  );
}
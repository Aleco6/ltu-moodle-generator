import { useState } from 'react';
import { EscapeRoom } from './components/EscapeRoom';
import { IntroDialog } from './components/IntroDialog';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function EscapeRoomPage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [timerMinutes, setTimerMinutes] = useState(30);
  const [playerName, setPlayerName] = useState('');

  const handleStart = (name: string, selectedDifficulty: Difficulty, selectedTimer: number) => {
    setPlayerName(name);
    setDifficulty(selectedDifficulty);
    setTimerMinutes(selectedTimer);
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {!gameStarted ? (
        <IntroDialog onStart={handleStart} />
      ) : (
        <EscapeRoom playerName={playerName} difficulty={difficulty} timerMinutes={timerMinutes} />
      )}
    </div>
  );
}

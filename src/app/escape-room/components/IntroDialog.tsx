import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Clock } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';

interface IntroDialogProps {
  onStart: (difficulty: Difficulty, timerMinutes: number) => void;
}

export function IntroDialog({ onStart }: IntroDialogProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [timerMinutes, setTimerMinutes] = useState(30);

  const difficultyOptions = [
    {
      value: 'easy' as Difficulty,
      color: 'green',
      label: 'Easy',
      tasks: 3,
      description: '1 task per terminal',
      defaultTime: 30
    },
    {
      value: 'medium' as Difficulty,
      color: 'orange',
      label: 'Medium',
      tasks: 6,
      description: '2 tasks per terminal',
      defaultTime: 45
    },
    {
      value: 'hard' as Difficulty,
      color: 'red',
      label: 'Hard',
      tasks: 9,
      description: '3 tasks per terminal',
      defaultTime: 60
    }
  ];

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    const option = difficultyOptions.find(opt => opt.value === difficulty);
    if (option) {
      setTimerMinutes(option.defaultTime);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl bg-white dark:bg-slate-800 border-2 border-red-500 rounded-lg p-8 shadow-2xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-red-500 mb-2">The Scrum Mastermind Escape Room</h1>
        </div>
        
        <div className="space-y-4 mb-6 text-slate-700 dark:text-slate-300">
          <div>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-2">Setting</h2>
            <p>
              You&apos;re a junior dev team trapped in Sprint Zero, the company&apos;s cursed innovation lab. Your project manager has gone mad with process power.
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded border-l-4 border-red-500">
            <p className="italic text-slate-600 dark:text-slate-400">
              &quot;You said you could deliver features every sprint. Let&apos;s see if you can deliver your freedom. 
              Three terminals, multiple tasks, one release. Consider this… your final stand-up.&quot;
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-2">Objective</h2>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Complete coding challenges at each terminal.</li>
              <li>Each finished challenge reveals one random digit of a PIN.</li>
              <li>Enter the full PIN code at the door terminal to escape.</li>
            </ul>
          </div>

          {/* Difficulty Selection */}
          <div className="border-t border-slate-300 dark:border-slate-700 pt-4">
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-3">Choose Your Challenge</h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {difficultyOptions.map((option) => {
                const isSelected = selectedDifficulty === option.value;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => handleDifficultySelect(option.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? `border-${option.color}-500 bg-${option.color}-50 dark:bg-${option.color}-900/20`
                        : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                    }`}
                  >
                    <div className="text-center">
                      <Badge variant={isSelected ? 'default' : 'outline'} className="mb-2">
                        {option.label}
                      </Badge>
                      <div className="text-sm font-medium">{option.tasks} Total Tasks</div>
                      <div className="text-xs text-slate-500">{option.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timer Selection */}
          {selectedDifficulty && (
            <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded border border-slate-300 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Timer Duration</span>
                </div>
                <Badge variant="outline" className="border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-400">
                  {timerMinutes} minutes
                </Badge>
              </div>
              <Slider
                value={[timerMinutes]}
                onValueChange={(value: number[]) => setTimerMinutes(value[0])}
                min={10}
                max={120}
                step={5}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500">
                <span>10 min</span>
                <span>60 min</span>
                <span>120 min</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                {timerMinutes < 20 && "Speed run mode!"}
                {timerMinutes >= 20 && timerMinutes < 60 && "Balanced challenge"}
                {timerMinutes >= 60 && "Take your time to debug properly"}
              </p>
            </div>
          )}
        </div>

        <Button 
          onClick={() => selectedDifficulty && onStart(selectedDifficulty, timerMinutes)}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
          disabled={!selectedDifficulty}
        >
          {selectedDifficulty ? 'Enter Sprint Zero' : 'Select Difficulty to Continue'}
        </Button>
      </div>
    </div>
  );
}
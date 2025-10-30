import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Terminal, Code2, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';
import { Task } from '../challengeBank';

interface ChallengeDialogProps {
  task: Task;
  terminalTitle: string;
  currentStage: number;
  totalStages: number;
  onComplete: (taskId: string, terminalId: number, digit: number) => void;
  onClose: () => void;
}

export function ChallengeDialog({ 
  task, 
  terminalTitle, 
  currentStage, 
  totalStages, 
  onComplete, 
  onClose 
}: ChallengeDialogProps) {
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [showHint, setShowHint] = useState(false);

  const sanitizeForCheck = (input: string) => {
    // Remove single-line and block comments so solutions with helpful notes still pass.
    return input
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '')
      .trim();
  };
  
  const checkSolution = () => {
    // Use the task's built-in check function
    const sanitized = sanitizeForCheck(code);
    const isCorrect = task.checkFunction(sanitized);
    
    if (isCorrect) {
      const randomDigit = Math.floor(Math.random() * 10);
      setFeedback({
        type: 'success',
        message: `Task ${currentStage} completed! PIN digit revealed: ${randomDigit}`
      });
      setTimeout(() => {
        onComplete(task.id, task.terminalId, randomDigit);
      }, 2000);
    } else {
      setFeedback({
        type: 'error',
        message: 'Not quite right. Check your code carefully or use the hint.'
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-neutral-300 dark:border-neutral-700">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              {terminalTitle}
            </div>
            <Badge variant="outline" className="border-neutral-500 dark:border-neutral-500 text-neutral-700 dark:text-neutral-300">
              Stage {currentStage}/{totalStages}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Complete all stages to earn your PIN digit
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Goal */}
          <Alert className="bg-neutral-100 dark:bg-neutral-900/20 border-neutral-500">
            <Code2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            <AlertDescription className="text-neutral-800 dark:text-neutral-300">
              <strong>Goal:</strong> {task.goal}
            </AlertDescription>
          </Alert>

          {/* Starter Code */}
          <div>
            <h3 className="text-orange-700 dark:text-orange-400 mb-2">Starter Code:</h3>
            <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded font-mono text-sm text-slate-800 dark:text-slate-300 whitespace-pre-wrap border border-slate-300 dark:border-slate-700 max-h-64 overflow-y-auto">
              {task.starterCode}
            </div>
          </div>

          {/* Code Editor */}
          <div>
            <label className="text-slate-700 dark:text-slate-300 text-sm mb-2 block">Your Solution:</label>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your solution here..."
              className="font-mono text-sm min-h-[300px] bg-slate-50 dark:bg-slate-950 text-green-700 dark:text-green-400 border-neutral-300 dark:border-neutral-700"
            />
          </div>

          {/* Feedback */}
          {feedback && (
            <Alert className={feedback.type === 'success' ? 'bg-green-100 dark:bg-green-900/20 border-green-500' : 'bg-red-100 dark:bg-red-900/20 border-red-500'}>
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              )}
              <AlertDescription className={feedback.type === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                {feedback.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Hint Section */}
          <div className="border border-blue-500 rounded p-4 bg-blue-100 dark:bg-blue-900/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-700 dark:text-blue-400 text-sm">Need Help?</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="text-blue-700 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
              >
                {showHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </Button>
            </div>
            {showHint && (
              <p className="text-blue-800 dark:text-blue-300 text-sm italic mt-2 p-3 bg-blue-200 dark:bg-blue-950/30 rounded">
                {task.hint}
              </p>
            )}
            {!showHint && (
              <p className="text-blue-600 dark:text-blue-400 text-sm">
                Click above to reveal a helpful hint for this challenge.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={checkSolution}
              className="bg-neutral-800 hover:bg-neutral-700 text-white"
              disabled={!code.trim()}
            >
              Check Solution
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

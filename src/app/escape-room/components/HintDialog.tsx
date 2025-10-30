import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb } from 'lucide-react';

interface HintSpot {
  id: number;
  terminalId: number;
  position: { x: string; y: string };
  hint: string;
}

interface HintDialogProps {
  hint: HintSpot;
  onClose: () => void;
}

export function HintDialog({ hint, onClose }: HintDialogProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-slate-900 border-blue-500">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <Lightbulb className="w-5 h-5" />
            Hint Found!
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            A clue for Terminal #{hint.terminalId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Paper Note Visual */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-sm shadow-lg border-2 border-yellow-200 dark:border-yellow-700 rotate-1">
            <div className="space-y-2">
              <div className="text-xs text-yellow-800/50 dark:text-yellow-300/60 font-mono">{/* Scribbled note: */}</div>
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {hint.hint}
              </p>
            </div>
          </div>

          <Alert className="bg-blue-100 dark:bg-blue-900/20 border-blue-500">
            <AlertDescription className="text-blue-700 dark:text-blue-400 text-sm">
              💡 Use this hint to help solve Terminal #{hint.terminalId} challenges
            </AlertDescription>
          </Alert>

          <Button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

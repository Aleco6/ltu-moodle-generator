import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, CheckCircle2, XCircle } from 'lucide-react';

interface PinDialogProps {
  expectedDigits: number[];
  onSubmit: (pin: string) => void;
  onClose: () => void;
}

export function PinDialog({ expectedDigits, onSubmit, onClose }: PinDialogProps) {
  const [pin, setPin] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = () => {
    const expectedPin = expectedDigits.join('');
    
    if (pin === expectedPin) {
      setFeedback({
        type: 'success',
        message: '🎉 ACCESS GRANTED! The door unlocks...'
      });
      setTimeout(() => {
        onSubmit(pin);
      }, 1500);
    } else {
      setFeedback({
        type: 'error',
        message: 'Incorrect PIN. Check your collected digits.'
      });
      setPin('');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-900 border-green-500">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-400">
            <Lock className="w-5 h-5" />
            Exit Terminal
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Enter the 3-digit PIN to unlock the door
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Hint */}
          <Alert className="bg-blue-900/20 border-blue-500">
            <AlertDescription className="text-blue-400 text-sm">
              💡 Use the digits you collected from completing the challenges, in order.
            </AlertDescription>
          </Alert>

          {/* PIN Input */}
          <div className="flex flex-col items-center gap-4">
            <label className="text-slate-300 text-sm">Enter PIN:</label>
            <InputOTP
              maxLength={3}
              value={pin}
              onChange={(value: string) => setPin(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="w-16 h-16 text-2xl bg-slate-950 border-purple-500" />
                <InputOTPSlot index={1} className="w-16 h-16 text-2xl bg-slate-950 border-purple-500" />
                <InputOTPSlot index={2} className="w-16 h-16 text-2xl bg-slate-950 border-purple-500" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Feedback */}
          {feedback && (
            <Alert className={feedback.type === 'success' ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}>
              <div className="flex items-center gap-2">
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                <AlertDescription className={feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}>
                  {feedback.message}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={pin.length !== 3}
            >
              Unlock Door
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
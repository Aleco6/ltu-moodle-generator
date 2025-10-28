import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Trophy, Github, Coffee } from 'lucide-react';

export function VictoryDialog() {
  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl bg-gradient-to-br from-green-900 to-slate-900 border-2 border-green-500 rounded-lg p-8 shadow-2xl"
      >
        <div className="text-center space-y-6">
          {/* Trophy */}
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
            <Trophy className="w-24 h-24 text-yellow-400" />
          </motion.div>

          {/* Victory Message */}
          <div>
            <h1 className="text-4xl font-bold text-green-400 mb-2">ESCAPE SUCCESSFUL!</h1>
            <p className="text-xl text-slate-300">
              You&apos;ve broken free from Sprint Zero
            </p>
          </div>

          {/* Final Message */}
          <div className="bg-slate-950/50 p-6 rounded-lg border border-green-500/50">
            <p className="text-slate-300 italic mb-2">
              The door slides open:
            </p>
            <p className="text-green-400 text-lg">
              &quot;Impressive. You&apos;ve proven your worth. Perhaps you understand Agile after all... 
              or maybe you just got lucky. Either way, you&apos;re free to go. 
              <span className="text-yellow-400"> Consider this sprint... DONE.</span>&quot;
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="bg-slate-950/30 p-4 rounded">
              <div className="text-2xl text-purple-400">3/3</div>
              <div className="text-sm text-slate-400">Challenges</div>
            </div>
            <div className="bg-slate-950/30 p-4 rounded">
              <div className="text-2xl text-green-400">100%</div>
              <div className="text-sm text-slate-400">Completion</div>
            </div>
            <div className="bg-slate-950/30 p-4 rounded">
              <div className="text-2xl text-yellow-400">Excellent</div>
              <div className="text-sm text-slate-400">Rating</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleRestart}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              Play Again
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-slate-600 text-slate-400"
                onClick={() => window.open('https://github.com', '_blank')}
              >
                <Github className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-slate-600 text-slate-400"
              >
                <Coffee className="w-4 h-4 mr-2" />
                More Games
              </Button>
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-slate-500 pt-4">
            Thanks for playing &quot;The Scrum Mastermind Escape Room&quot;
          </p>
        </div>
      </motion.div>
    </div>
  );
}
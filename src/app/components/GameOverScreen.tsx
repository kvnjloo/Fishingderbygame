import { XCircle, RotateCcw } from 'lucide-react';

interface GameOverScreenProps {
  score: number;
  level: number;
  fishRemoved: number;
  hazardsCleared: number;
  onRestart: () => void;
}

export function GameOverScreen({
  score,
  level,
  fishRemoved,
  hazardsCleared,
  onRestart,
}: GameOverScreenProps) {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-red-950 to-gray-950 flex items-center justify-center z-10 p-8">
      <div className="text-center max-w-2xl">
        {/* Game Over Title */}
        <div className="mb-8">
          <XCircle className="w-24 h-24 text-red-500 mx-auto mb-4 animate-pulse" />
          <h1 className="text-6xl font-bold text-red-500 mb-4 tracking-wider pixel-title">
            GAME OVER
          </h1>
          <div className="text-white text-xl font-mono">
            Too many fish were harmed!
          </div>
        </div>

        {/* Stats */}
        <div className="bg-black/50 p-8 rounded-lg border-4 border-red-700 mb-8">
          <div className="grid grid-cols-2 gap-6">
            {/* Final Score */}
            <div className="bg-black p-4 rounded border-2 border-red-900">
              <div className="text-red-500 text-sm font-bold mb-2 tracking-wider">
                FINAL SCORE
              </div>
              <div
                className="text-red-400 text-4xl font-mono font-bold tracking-wider"
                style={{ textShadow: '0 0 10px currentColor' }}
              >
                {score.toString().padStart(6, '0')}
              </div>
            </div>

            {/* Level Reached */}
            <div className="bg-black p-4 rounded border-2 border-yellow-900">
              <div className="text-yellow-500 text-sm font-bold mb-2 tracking-wider">
                LEVEL REACHED
              </div>
              <div
                className="text-yellow-400 text-4xl font-mono font-bold tracking-wider"
                style={{ textShadow: '0 0 10px currentColor' }}
              >
                {level.toString().padStart(2, '0')}
              </div>
            </div>

            {/* Fish Lost */}
            <div className="bg-black p-4 rounded border-2 border-orange-900">
              <div className="text-orange-500 text-sm font-bold mb-2 tracking-wider">
                FISH LOST
              </div>
              <div
                className="text-orange-400 text-4xl font-mono font-bold tracking-wider"
                style={{ textShadow: '0 0 10px currentColor' }}
              >
                {fishRemoved}
              </div>
            </div>

            {/* Hazards Cleaned */}
            <div className="bg-black p-4 rounded border-2 border-green-900">
              <div className="text-green-500 text-sm font-bold mb-2 tracking-wider">
                HAZARDS CLEANED
              </div>
              <div
                className="text-green-400 text-4xl font-mono font-bold tracking-wider"
                style={{ textShadow: '0 0 10px currentColor' }}
              >
                {hazardsCleared}
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8 text-gray-300 text-lg font-mono leading-relaxed">
          The ocean needs more heroes like you!
          <br />
          Try again and save more marine life.
        </div>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-12 py-4 rounded-lg border-4 border-red-900 font-bold text-2xl shadow-lg transform hover:scale-105 transition-all flex items-center gap-3 mx-auto"
        >
          <RotateCcw className="w-6 h-6" />
          TRY AGAIN
        </button>
      </div>

      <style>{`
        .pixel-title {
          font-family: 'Courier New', monospace;
          text-shadow: 4px 4px 0px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}

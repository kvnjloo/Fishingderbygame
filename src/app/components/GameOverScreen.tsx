import { RotateCcw } from 'lucide-react';

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
    <div className="absolute inset-0 bg-gradient-to-b from-red-950 to-gray-950 flex items-center justify-center z-10 p-4 overflow-hidden">
      <div className="text-center w-full max-w-[700px] h-full flex flex-col justify-between py-4">
        {/* Game Over Title */}
        <div className="flex-shrink-0">
          <h1 className="text-5xl font-bold text-red-500 mb-2 tracking-wider pixel-title">
            GAME OVER
          </h1>
          <div className="text-white text-lg font-mono">
            Too many fish were harmed!
          </div>
        </div>

        {/* Stats */}
        <div className="bg-black/50 p-4 rounded-lg border-4 border-red-700 flex-1 flex items-center justify-center my-4">
          <div className="grid grid-cols-2 gap-4 w-full">
            {/* Final Score */}
            <div className="bg-black p-3 rounded border-2 border-red-900">
              <div className="text-red-500 text-xs font-bold mb-1 tracking-wider">
                FINAL SCORE
              </div>
              <div
                className="text-red-400 text-3xl font-mono font-bold tracking-wider"
                style={{ textShadow: '0 0 10px currentColor' }}
              >
                {score.toString().padStart(6, '0')}
              </div>
            </div>

            {/* Level Reached */}
            <div className="bg-black p-3 rounded border-2 border-yellow-900">
              <div className="text-yellow-500 text-xs font-bold mb-1 tracking-wider">
                LEVEL REACHED
              </div>
              <div
                className="text-yellow-400 text-3xl font-mono font-bold tracking-wider"
                style={{ textShadow: '0 0 10px currentColor' }}
              >
                {level.toString().padStart(2, '0')}
              </div>
            </div>

            {/* Fish Lost */}
            <div className="bg-black p-3 rounded border-2 border-orange-900">
              <div className="text-orange-500 text-xs font-bold mb-1 tracking-wider">
                FISH LOST
              </div>
              <div
                className="text-orange-400 text-3xl font-mono font-bold tracking-wider"
                style={{ textShadow: '0 0 10px currentColor' }}
              >
                {fishRemoved}
              </div>
            </div>

            {/* Hazards Cleaned */}
            <div className="bg-black p-3 rounded border-2 border-green-900">
              <div className="text-green-500 text-xs font-bold mb-1 tracking-wider">
                HAZARDS CLEANED
              </div>
              <div
                className="text-green-400 text-3xl font-mono font-bold tracking-wider"
                style={{ textShadow: '0 0 10px currentColor' }}
              >
                {hazardsCleared}
              </div>
            </div>
          </div>
        </div>

        {/* Message and Button */}
        <div className="flex-shrink-0">
          <div className="mb-4 text-gray-300 text-base font-mono leading-relaxed">
            The ocean needs more heroes like you!
            <br />
            Try again and save more marine life.
          </div>

          {/* Restart Button */}
          <button
            onClick={onRestart}
            className="bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white px-8 py-3 rounded-lg border-4 border-red-900 font-bold text-xl shadow-lg transition-colors flex items-center gap-3 mx-auto"
          >
            <RotateCcw className="w-5 h-5" />
            TRY AGAIN
          </button>
        </div>
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
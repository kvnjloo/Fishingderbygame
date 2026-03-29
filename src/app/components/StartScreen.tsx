import { Fish, Waves, Trophy } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-cyan-900 to-blue-950 flex items-center justify-center z-10">
      <div className="text-center px-8 max-w-2xl">
        {/* Title */}
        <div className="mb-8 animate-pulse">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Fish className="w-12 h-12 text-yellow-400" />
            <h1 className="text-6xl font-bold text-white tracking-wider pixel-title">
              FISHING
            </h1>
            <Waves className="w-12 h-12 text-blue-400" />
          </div>
          <h2 className="text-5xl font-bold text-yellow-400 tracking-wider pixel-title">
            DERBY
          </h2>
        </div>

        {/* Subtitle */}
        <div className="mb-8 text-cyan-200 text-xl font-mono">
          Clean the Ocean, Save the Fish!
        </div>

        {/* Game Info */}
        <div className="bg-black/50 p-6 rounded-lg border-4 border-cyan-700 mb-8">
          <div className="text-white text-left space-y-3 font-mono text-sm">
            <div className="flex items-start gap-3">
              <div className="text-yellow-400 font-bold min-w-[80px]">MISSION:</div>
              <div>Remove hazardous waste from the water without harming marine life</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-green-400 font-bold min-w-[80px]">LEVELS:</div>
              <div>5 challenging levels with trivia questions</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-red-400 font-bold min-w-[80px]">WARNING:</div>
              <div>Lose 3 fish and the game is over!</div>
            </div>
            <div className="flex items-start gap-3 pt-2 border-t border-cyan-700">
              <div className="text-blue-400 font-bold min-w-[80px]">POINTS:</div>
              <div className="space-y-1">
                <div>Plastic Rings: 50pts</div>
                <div>Plastic Bags: 75pts</div>
                <div>Fishing Nets: 100pts</div>
                <div>Fishing Line: 25pts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-gray-900 px-12 py-4 rounded-lg border-4 border-yellow-700 font-bold text-2xl shadow-lg transform hover:scale-105 transition-all"
        >
          START GAME
        </button>

        {/* Trophy Icon */}
        <div className="mt-8 flex items-center justify-center gap-2 text-yellow-400">
          <Trophy className="w-6 h-6" />
          <span className="font-mono text-sm">Save the Ocean, Be a Hero!</span>
          <Trophy className="w-6 h-6" />
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

import { Trophy } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-cyan-900 to-blue-950 flex items-center justify-center z-10 overflow-hidden">
      <div className="text-center px-6 w-full h-full flex flex-col justify-between py-6">
        {/* Game Info - Takes majority of space */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-black/50 p-6 rounded-lg border-4 border-cyan-700 w-full max-w-[700px]">
            <div className="text-white text-left space-y-4 font-mono">
              <div className="flex items-start gap-3">
                <div className="text-yellow-400 font-bold min-w-[80px] text-sm">MISSION:</div>
                <div className="text-sm">Remove hazardous waste from the water without harming marine life</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-green-400 font-bold min-w-[80px] text-sm">LEVELS:</div>
                <div className="text-sm">5 challenging levels with 2 trivia questions each</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-red-400 font-bold min-w-[80px] text-sm">WARNING:</div>
                <div className="text-sm">Lose 3 fish total and the game is over!</div>
              </div>
              <div className="flex items-start gap-3 pt-3 border-t border-cyan-700">
                <div className="text-blue-400 font-bold min-w-[80px] text-sm">POINTS:</div>
                <div className="space-y-1 text-sm">
                  <div>Fishing Line: 25pts</div>
                  <div>Plastic Rings: 50pts</div>
                  <div>Plastic Bags: 75pts</div>
                  <div>Fishing Nets: 100pts</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-gray-900 px-12 py-4 rounded-lg border-4 border-yellow-700 font-bold text-3xl shadow-lg transition-colors my-6"
        >
          START GAME
        </button>

        {/* Trophy Icon */}
        <div className="flex items-center justify-center gap-3 text-yellow-400 pb-2">
          <Trophy className="w-8 h-8" />
          <span className="font-mono text-lg font-bold">Save the Ocean, Be a Hero!</span>
          <Trophy className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}
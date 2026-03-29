import { GameState } from '../types/game';

interface ScorePanelProps {
  gameState: GameState;
}

export function ScorePanel({ gameState }: ScorePanelProps) {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-4 rounded-lg border-4 border-gray-700 shadow-lg">
      <div className="grid grid-cols-2 gap-4">
        {/* Score */}
        <div className="bg-black p-3 rounded border-2 border-red-900">
          <div className="text-red-500 text-xs font-bold mb-1 tracking-wider">SCORE</div>
          <div className="text-red-400 text-2xl font-mono font-bold tracking-wider digital-display">
            {gameState.score.toString().padStart(6, '0')}
          </div>
        </div>

        {/* Level */}
        <div className="bg-black p-3 rounded border-2 border-green-900">
          <div className="text-green-500 text-xs font-bold mb-1 tracking-wider">LEVEL</div>
          <div className="text-green-400 text-2xl font-mono font-bold tracking-wider digital-display">
            {gameState.level.toString().padStart(2, '0')}
          </div>
        </div>

        {/* Fish Removed */}
        <div className="bg-black p-3 rounded border-2 border-yellow-900">
          <div className="text-yellow-500 text-xs font-bold mb-1 tracking-wider">FISH LOST</div>
          <div className="text-yellow-400 text-2xl font-mono font-bold tracking-wider digital-display">
            {gameState.fishRemoved} / 3
          </div>
        </div>

        {/* Hazards Cleared */}
        <div className="bg-black p-3 rounded border-2 border-blue-900">
          <div className="text-blue-500 text-xs font-bold mb-1 tracking-wider">HAZARDS REMOVED</div>
          <div className="text-blue-400 text-2xl font-mono font-bold tracking-wider digital-display">
            {gameState.hazardsCleared.toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Hazards Guide */}
      <div className="mt-4 bg-black p-3 rounded border-2 border-purple-900">
        <div className="text-purple-400 text-xs font-bold mb-3 tracking-wider text-center">HAZARDS</div>
        <div className="space-y-2.5 text-purple-300 text-xs font-mono">
          {/* Fishing Line */}
          <div className="flex items-center gap-3">
            <div className="relative w-5 h-5 flex-shrink-0 flex items-center justify-center">
              {/* Spool shape */}
              <div
                className="absolute"
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#4A90E2',
                  borderRadius: '20%',
                }}
              >
                {/* Wrapped line texture */}
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="absolute left-0 w-full bg-blue-700"
                    style={{
                      top: `${(i + 1) * 25}%`,
                      height: 1,
                      opacity: 0.6,
                    }}
                  />
                ))}
              </div>
              {/* Center hole */}
              <div
                className="absolute"
                style={{
                  width: '30%',
                  height: '30%',
                  background: '#2a5a92',
                  borderRadius: '50%',
                }}
              />
            </div>
            <span className="text-[11px]">Fishing Line - 25 points</span>
          </div>
          
          {/* Plastic Drink Rings */}
          <div className="flex items-center gap-3">
            <div className="relative w-5 h-5 flex-shrink-0">
              {/* 2 rows of 3 rings */}
              {[0, 1, 2].map((row) =>
                [0, 1].map((col) => (
                  <div
                    key={`${row}-${col}`}
                    className="absolute border-2 rounded-full"
                    style={{
                      left: `${row * 33}%`,
                      top: `${col * 50}%`,
                      width: '30%',
                      height: '45%',
                      borderColor: '#9B59B6',
                      background: 'transparent',
                    }}
                  />
                ))
              )}
            </div>
            <span className="text-[11px]">Plastic Drink Rings - 50 points</span>
          </div>
          
          {/* Plastic Bags */}
          <div className="flex items-center gap-3">
            <div className="relative w-5 h-6 flex-shrink-0">
              {/* Bag handles */}
              <div
                className="absolute left-1/4 top-0"
                style={{
                  width: '50%',
                  height: '20%',
                  borderLeft: '2px solid rgba(230, 230, 230, 0.7)',
                  borderRight: '2px solid rgba(230, 230, 230, 0.7)',
                  borderTop: '2px solid rgba(230, 230, 230, 0.7)',
                  borderRadius: '50% 50% 0 0',
                }}
              />
              {/* Bag body */}
              <div
                className="absolute left-0 w-full"
                style={{
                  top: '15%',
                  height: '85%',
                  background: 'rgba(240, 240, 240, 0.6)',
                  border: '1px solid rgba(200, 200, 200, 0.8)',
                  clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
                }}
              >
                {/* Wrinkles */}
                <div className="absolute top-1/3 left-0 w-full h-px bg-gray-400 opacity-40" />
                <div className="absolute top-2/3 left-0 w-full h-px bg-gray-400 opacity-40" />
              </div>
            </div>
            <span className="text-[11px]">Plastic Bags - 75 points</span>
          </div>
          
          {/* Fishing Nets */}
          <div className="flex items-center gap-3">
            <div className="relative w-5 h-6 flex-shrink-0">
              {/* Handle - straight line at top */}
              <div
                className="absolute left-1/2 top-0"
                style={{
                  width: 2,
                  height: '25%',
                  background: '#444',
                  transform: 'translateX(-50%)',
                }}
              />
              {/* Handle grip */}
              <div
                className="absolute left-1/3 top-0"
                style={{
                  width: '34%',
                  height: '8%',
                  background: '#555',
                  borderRadius: '2px',
                }}
              />
              {/* Net mesh bag */}
              <div
                className="absolute left-0 w-full"
                style={{
                  top: '25%',
                  height: '75%',
                  background: '#666',
                  opacity: 0.7,
                  borderRadius: '0 0 40% 40%',
                }}
              >
                {/* Grid pattern for mesh */}
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute left-0 w-full bg-gray-800"
                    style={{
                      top: `${(i + 1) * 20}%`,
                      height: 1,
                    }}
                  />
                ))}
                {[0, 1, 2].map((i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute top-0 h-full bg-gray-800"
                    style={{
                      left: `${(i + 1) * 25}%`,
                      width: 1,
                    }}
                  />
                ))}
              </div>
            </div>
            <span className="text-[11px]">Fishing Nets - 100 points</span>
          </div>
        </div>
      </div>

      <style>{`
        .digital-display {
          text-shadow: 0 0 10px currentColor;
        }
      `}</style>
    </div>
  );
}
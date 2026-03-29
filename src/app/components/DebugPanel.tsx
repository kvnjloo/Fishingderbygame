import { GameState } from '../types/game';

interface DebugPanelProps {
  gameState: GameState;
}

export function DebugPanel({ gameState }: DebugPanelProps) {
  if (!gameState.debugMode) return null;

  return (
    <div className="bg-black/90 text-green-400 p-4 rounded-lg border-2 border-green-500 font-mono text-xs">
      <div className="text-green-300 font-bold mb-3 text-sm">🐛 DEBUG MODE</div>
      
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-green-300">Status:</div>
            <div>{gameState.status}</div>
          </div>
          <div>
            <div className="text-green-300">Level:</div>
            <div>{gameState.level}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-green-300">Fish Count:</div>
            <div>{gameState.fish.length}</div>
          </div>
          <div>
            <div className="text-green-300">Hazard Count:</div>
            <div>{gameState.hazards.length}</div>
          </div>
        </div>

        <div className="border-t border-green-700 pt-2">
          <div className="text-green-300 mb-1">Fishing Line:</div>
          <div>X: {Math.round(gameState.fishingLine.x)}</div>
          <div>Y: {Math.round(gameState.fishingLine.y)}</div>
          <div>Above Water: {gameState.fishingLine.aboveWater ? 'Yes' : 'No'}</div>
          <div>Attached: {gameState.fishingLine.attachedHazardId || 'None'}</div>
        </div>

        <div className="border-t border-green-700 pt-2">
          <div className="text-green-300 mb-1">Fish Positions:</div>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {gameState.fish.map((f) => (
              <div key={f.id} className="text-[10px]">
                {f.id}: ({Math.round(f.position.x)}, {Math.round(f.position.y)}) - {f.size}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-green-700 pt-2">
          <div className="text-green-300 mb-1">Hazards:</div>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {gameState.hazards.map((h) => (
              <div key={h.id} className="text-[10px]">
                {h.id}: {h.type} - {h.attached ? 'ATTACHED' : 'free'}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-green-700 pt-2">
          <div className="text-yellow-400 text-xs">
            ⚠️ Check browser console for detailed logs
          </div>
        </div>
      </div>
    </div>
  );
}

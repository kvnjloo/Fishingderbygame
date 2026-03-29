import { Pause, Play, RotateCcw, Bug } from 'lucide-react';

interface ControlPanelProps {
  isPaused: boolean;
  onPause: () => void;
  onReset: () => void;
  onToggleDebug: () => void;
  debugMode: boolean;
  disabled: boolean;
}

export function ControlPanel({
  isPaused,
  onPause,
  onReset,
  onToggleDebug,
  debugMode,
  disabled,
}: ControlPanelProps) {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-4 rounded-lg border-4 border-gray-700 shadow-lg">
      <div className="text-gray-400 text-xs font-bold mb-3 tracking-wider">CONTROLS</div>
      
      <div className="space-y-2">
        {/* Pause/Play */}
        <button
          onClick={onPause}
          disabled={disabled}
          className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 text-white px-4 py-3 rounded border-2 border-gray-600 font-mono text-sm flex items-center justify-center gap-2 transition-colors"
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          {isPaused ? 'RESUME (P)' : 'PAUSE (P)'}
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="w-full bg-red-900 hover:bg-red-800 text-white px-4 py-3 rounded border-2 border-red-700 font-mono text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          RESET
        </button>

        {/* Debug Mode */}
        <button
          onClick={onToggleDebug}
          className={`w-full ${
            debugMode ? 'bg-green-700 hover:bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
          } text-white px-4 py-3 rounded border-2 ${
            debugMode ? 'border-green-500' : 'border-gray-600'
          } font-mono text-sm flex items-center justify-center gap-2 transition-colors`}
        >
          <Bug className="w-4 h-4" />
          DEBUG {debugMode ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-black rounded border border-gray-700">
        <div className="text-gray-400 text-xs space-y-1 font-mono">
          <div className="text-yellow-500 font-bold mb-2">INSTRUCTIONS:</div>
          <div>← → Change direction</div>
          <div>↓ Drop line down</div>
          <div>↑ Pull line up</div>
          <div>SPACE Fast drop</div>
          <div className="pt-2 border-t border-gray-700 mt-2">
            <div className="text-yellow-500">GOAL:</div>
            <div>Remove hazards from water</div>
            <div className="text-red-400">Avoid hitting fish!</div>
          </div>
        </div>
      </div>
    </div>
  );
}
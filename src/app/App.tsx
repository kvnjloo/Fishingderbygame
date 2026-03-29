import { useCallback } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { useKeyboard } from './hooks/useKeyboard';
import { GameCanvas } from './components/GameCanvas';
import { ScorePanel } from './components/ScorePanel';
import { ControlPanel } from './components/ControlPanel';
import { StartScreen } from './components/StartScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { CelebrationScreen } from './components/CelebrationScreen';
import { DebugPanel } from './components/DebugPanel';

export default function App() {
  const {
    gameState,
    isPaused,
    startGame,
    resetGame,
    togglePause,
    toggleDebugMode,
    moveFishingLine,
    dropFishingLine,
    pullFishingLine,
    answerQuestion,
  } = useGameLogic();

  const handleLeft = useCallback(() => {
    moveFishingLine('left');
  }, [moveFishingLine]);

  const handleRight = useCallback(() => {
    moveFishingLine('right');
  }, [moveFishingLine]);

  const handleDown = useCallback(() => {
    dropFishingLine(3); // Normal drop speed
  }, [dropFishingLine]);

  const handleUp = useCallback(() => {
    pullFishingLine();
  }, [pullFishingLine]);

  const handleSpace = useCallback(() => {
    dropFishingLine(6); // Fast drop speed
  }, [dropFishingLine]);

  const handleSpaceUp = useCallback(() => {
    // Space key up doesn't need to do anything now since we're not using continuous drop
  }, []);

  useKeyboard({
    onLeft: handleLeft,
    onRight: handleRight,
    onDown: handleDown,
    onUp: handleUp,
    onSpace: handleSpace,
    onSpaceUp: handleSpaceUp,
    onPause: togglePause,
    enabled: gameState.status === 'playing' && !isPaused,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center p-8">
      <div className="w-full max-w-7xl">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-yellow-400 mb-2 tracking-wider pixel-title">
            🎣 FISHING DERBY 🌊
          </h1>
          <p className="text-cyan-300 text-lg font-mono">
            Clean the Ocean - Save Marine Life
          </p>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">
          {/* Left: Game Canvas */}
          <div className="relative">
            <GameCanvas gameState={gameState} />

            {/* Overlays */}
            {gameState.status === 'start' && <StartScreen onStart={startGame} />}
            {gameState.status === 'question' && (
              <QuestionScreen level={gameState.level} onAnswer={answerQuestion} />
            )}
            {gameState.status === 'gameover' && (
              <GameOverScreen
                score={gameState.score}
                level={gameState.level}
                fishRemoved={gameState.fishRemoved}
                hazardsCleared={gameState.hazardsCleared}
                onRestart={resetGame}
              />
            )}
            {gameState.status === 'celebration' && (
              <CelebrationScreen
                score={gameState.score}
                hazardsCleared={gameState.hazardsCleared}
                onRestart={resetGame}
              />
            )}

            {/* Pause overlay */}
            {isPaused && gameState.status === 'playing' && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
                <div className="text-center">
                  <div className="text-6xl font-bold text-white mb-4 font-mono">❚❚ PAUSED</div>
                  <div className="text-2xl text-cyan-300 font-mono">Press P to Resume</div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Panels */}
          <div className="space-y-6 lg:w-80">
            <ScorePanel gameState={gameState} />
            <ControlPanel
              isPaused={isPaused}
              onPause={togglePause}
              onReset={resetGame}
              onToggleDebug={toggleDebugMode}
              debugMode={gameState.debugMode}
              disabled={gameState.status !== 'playing'}
            />
            <DebugPanel gameState={gameState} />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-gray-400 text-sm font-mono">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="mb-2 text-yellow-400 font-bold">🌍 EDUCATIONAL MESSAGE 🌍</div>
            <div className="text-gray-300 leading-relaxed">
              Ocean pollution is a real threat to marine ecosystems. Millions of tons of plastic
              waste enter our oceans every year, harming fish, sea turtles, and other marine life.
              Every action we take to reduce pollution makes a difference!
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .pixel-title {
          font-family: 'Courier New', monospace;
          text-shadow: 3px 3px 0px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}
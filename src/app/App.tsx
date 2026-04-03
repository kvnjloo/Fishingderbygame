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
    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
      <div className="w-full h-screen flex flex-col p-2 sm:p-4 gap-2 sm:gap-3">
        {/* Title */}
        <div className="text-center flex-shrink-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-yellow-400 mb-1 tracking-wider pixel-title">
            🎣 FISHING DERBY 🌊
          </h1>
          <p className="text-cyan-300 text-xs sm:text-sm md:text-base font-mono">
            Clean the Ocean - Save Marine Life
          </p>
        </div>

        {/* Main Game Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-2 sm:gap-3 min-h-0">
          {/* Left: Game Canvas with responsive scaling */}
          <div className="relative flex items-center justify-center min-h-0 bg-gray-900 rounded-lg">
            <div 
              className="game-container"
              style={{
                width: '800px',
                height: '600px',
                maxWidth: '100%',
                maxHeight: '100%',
                transform: 'scale(var(--game-scale))',
                transformOrigin: 'center center',
              }}
            >
              <GameCanvas gameState={gameState} />

              {/* Overlays */}
              {gameState.status === 'start' && <StartScreen onStart={startGame} />}
              {gameState.status === 'question' && (
                <QuestionScreen 
                  level={gameState.level} 
                  questionNumber={gameState.questionNumber}
                  onAnswer={answerQuestion} 
                />
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
                    <div className="text-4xl md:text-6xl font-bold text-white mb-4 font-mono">❚❚ PAUSED</div>
                    <div className="text-xl md:text-2xl text-cyan-300 font-mono">Press P to Resume</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Panels */}
          <div className="space-y-2 sm:space-y-3 flex-shrink-0 overflow-y-auto">
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
        <div className="text-center text-gray-400 text-xs flex-shrink-0">
          <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700">
            <div className="mb-1 text-yellow-400 font-bold text-xs">🌍 EDUCATIONAL MESSAGE 🌍</div>
            <div className="text-gray-300 leading-relaxed text-xs">
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
        
        .game-container {
          position: relative;
          background: #000;
        }
        
        /* Calculate scale dynamically based on available space */
        :root {
          --game-scale: 1;
        }
        
        @media (max-width: 1023px) {
          :root {
            --available-width: calc(100vw - 1rem);
            --available-height: calc(100vh - 12rem);
            --scale-by-width: calc(var(--available-width) / 800);
            --scale-by-height: calc(var(--available-height) / 600);
            --game-scale: min(var(--scale-by-width), var(--scale-by-height), 1);
          }
        }
        
        @media (min-width: 1024px) {
          :root {
            --available-width: calc(100vw - 350px);
            --available-height: calc(100vh - 11rem);
            --scale-by-width: calc(var(--available-width) / 800);
            --scale-by-height: calc(var(--available-height) / 600);
            --game-scale: min(var(--scale-by-width), var(--scale-by-height), 1);
          }
        }
        
        @media (min-width: 1280px) {
          :root {
            --available-width: calc(100vw - 380px);
          }
        }
      `}</style>
    </div>
  );
}
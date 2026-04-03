import { useEffect } from 'react';
import { Trophy, Star, RotateCcw } from 'lucide-react';

interface CelebrationScreenProps {
  score: number;
  hazardsCleared: number;
  onRestart: () => void;
}

export function CelebrationScreen({ score, hazardsCleared, onRestart }: CelebrationScreenProps) {
  useEffect(() => {
    // Simple confetti animation using CSS
    const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#32CD32'];
    const container = document.getElementById('confetti-container');
    
    if (!container) return;

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDelay = `${Math.random() * 3}s`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDuration = `${3 + Math.random() * 2}s`;
      container.appendChild(confetti);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-blue-900 to-cyan-900 flex items-center justify-center z-10 p-4 overflow-hidden">
      {/* Confetti Container */}
      <div id="confetti-container" className="absolute inset-0 pointer-events-none" />

      <div className="text-center w-full max-w-[700px] h-full flex flex-col justify-between py-4 relative z-10">
        {/* Trophy Animation */}
        <div className="flex-shrink-0 animate-bounce">
          <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-2" />
          <Star className="w-12 h-12 text-yellow-300 mx-auto -mt-10 animate-spin" />
        </div>

        {/* Celebration Title */}
        <div className="flex-shrink-0">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2 tracking-wider pixel-title animate-pulse">
            CONGRATULATIONS!
          </h1>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">
            You Completed All 5 Levels!
          </h2>
          <div className="text-cyan-300 text-lg font-mono">
            🌊 Ocean Hero Achievement Unlocked! 🌊
          </div>
        </div>

        {/* Final Stats */}
        <div className="bg-black/50 p-4 rounded-lg border-4 border-yellow-500 shadow-2xl flex-1 flex items-center justify-center my-4">
          <div className="w-full">
            <div className="text-yellow-400 text-xl font-bold mb-4 tracking-wider">
              FINAL RESULTS
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Final Score */}
              <div className="bg-gradient-to-r from-yellow-900 to-orange-900 p-4 rounded border-4 border-yellow-600">
                <div className="text-yellow-300 text-sm font-bold mb-1 tracking-wider">
                  TOTAL SCORE
                </div>
                <div
                  className="text-yellow-200 text-4xl font-mono font-bold tracking-wider"
                  style={{ textShadow: '0 0 20px #FFD700' }}
                >
                  {score.toString().padStart(6, '0')}
                </div>
              </div>

              {/* Hazards Cleaned */}
              <div className="bg-gradient-to-r from-green-900 to-emerald-900 p-4 rounded border-4 border-green-600">
                <div className="text-green-300 text-sm font-bold mb-1 tracking-wider">
                  TOTAL HAZARDS CLEANED
                </div>
                <div
                  className="text-green-200 text-3xl font-mono font-bold tracking-wider"
                  style={{ textShadow: '0 0 20px #00FF00' }}
                >
                  {hazardsCleared}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Message and Button */}
        <div className="flex-shrink-0">
          <div className="mb-4">
            <div className="text-white text-xl font-bold mb-2">
              🎖️ You're a True Ocean Protector! 🎖️
            </div>
            <div className="text-cyan-200 text-sm font-mono leading-relaxed">
              Thanks to you, the ocean is cleaner and marine life is safer.
              <br />
              Every action counts in protecting our planet!
            </div>
          </div>

          {/* Play Again Button */}
          <button
            onClick={onRestart}
            className="bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-gray-900 px-8 py-3 rounded-lg border-4 border-yellow-700 font-bold text-xl shadow-lg transition-colors flex items-center gap-3 mx-auto"
          >
            <RotateCcw className="w-5 h-5" />
            PLAY AGAIN
          </button>
        </div>
      </div>

      <style>{`
        .pixel-title {
          font-family: 'Courier New', monospace;
          text-shadow: 4px 4px 0px rgba(0,0,0,0.5);
        }
        
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: fall linear infinite;
        }
        
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState } from '../types/game';
import {
  checkLineHazardCollision,
  checkHazardFishCollision,
  updateFish,
  updateHazards,
  generateFish,
  generateHazards,
  wallKick,
  getHazardScore,
} from '../utils/gameLogic';
import {
  GAME_WIDTH,
  SKY_HEIGHT,
  WATER_HEIGHT,
  FISHING_LINE_UP_SPEED,
  getPolePosition,
} from '../utils/constants';

export function useGameLogic() {
  // All hooks must be called in the same order every render
  const [gameState, setGameState] = useState<GameState>(() => ({
    status: 'start',
    score: 0,
    level: 1,
    fishRemoved: 0,
    hazardsCleared: 0,
    fish: [],
    hazards: [],
    fishingLine: {
      x: GAME_WIDTH / 2,
      y: SKY_HEIGHT,
      attachedHazardId: null,
      aboveWater: true,
    },
    fishermanDirection: 'right',
    debugMode: false,
  }));

  const [isPaused, setIsPaused] = useState(false);
  
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  // Initialize level
  const initializeLevel = useCallback((level: number) => {
    const fish = generateFish(level);
    const hazards = generateHazards(level);
    const polePos = getPolePosition('right');
    
    setGameState((prev) => ({
      ...prev,
      fish,
      hazards,
      fishingLine: {
        x: polePos.x,
        y: polePos.y + 10, // Start 10px below pole tip
        attachedHazardId: null,
        aboveWater: true,
      },
      fishermanDirection: 'right',
    }));
    
    if (gameState.debugMode) {
      console.log(`[Level Init] Level ${level}: ${fish.length} fish, ${hazards.length} hazards`);
    }
  }, [gameState.debugMode]);

  // Start game
  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      status: 'playing',
      score: 0,
      level: 1,
      fishRemoved: 0,
      hazardsCleared: 0,
    }));
    initializeLevel(1);
  }, [initializeLevel]);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState({
      status: 'start',
      score: 0,
      level: 1,
      fishRemoved: 0,
      hazardsCleared: 0,
      fish: [],
      hazards: [],
      fishingLine: {
        x: GAME_WIDTH / 2,
        y: SKY_HEIGHT,
        attachedHazardId: null,
        aboveWater: true,
      },
      fishermanDirection: 'right',
      debugMode: gameState.debugMode,
    });
    setIsPaused(false);
  }, [gameState.debugMode]);

  // Toggle pause
  const togglePause = useCallback(() => {
    if (gameState.status === 'playing') {
      setIsPaused((prev) => !prev);
      if (gameState.debugMode) {
        console.log('[Pause] Toggled');
      }
    }
  }, [gameState.status, gameState.debugMode]);

  // Toggle debug mode
  const toggleDebugMode = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      debugMode: !prev.debugMode,
    }));
  }, []);

  // Move fishing line left/right
  const moveFishingLine = useCallback((direction: 'left' | 'right') => {
    if (gameState.status !== 'playing' || isPaused) return;
    
    setGameState((prev) => {
      const { fishingLine, hazards, debugMode } = prev;
      
      if (fishingLine.aboveWater) {
        // Change fisherman direction
        return {
          ...prev,
          fishermanDirection: direction,
          fishingLine: {
            ...fishingLine,
            x: direction === 'left' ? GAME_WIDTH / 2 - 40 : GAME_WIDTH / 2 + 40,
          },
        };
      }
      
      // Move fishing line and attached hazard
      const moveAmount = direction === 'left' ? -4 : 4;
      let newX = fishingLine.x + moveAmount;
      
      // Check attached hazard
      if (fishingLine.attachedHazardId) {
        const attachedHazard = hazards.find(h => h.id === fishingLine.attachedHazardId);
        if (attachedHazard) {
          // Apply wall kick if needed
          newX = wallKick(newX - attachedHazard.width / 2, attachedHazard.width, debugMode);
          newX += attachedHazard.width / 2;
        }
      } else {
        // No attached hazard, simple boundary check
        newX = Math.max(0, Math.min(GAME_WIDTH, newX));
      }
      
      // Update hazard position if attached
      const updatedHazards = fishingLine.attachedHazardId
        ? hazards.map(h =>
            h.id === fishingLine.attachedHazardId
              ? {
                  ...h,
                  position: {
                    x: newX - h.width / 2,
                    y: fishingLine.y,
                  },
                }
              : h
          )
        : hazards;
      
      return {
        ...prev,
        fishingLine: { ...fishingLine, x: newX },
        hazards: updatedHazards,
      };
    });
  }, [gameState.status, isPaused]);

  // Drop fishing line down
  const dropFishingLine = useCallback((speed: number) => {
    if (gameState.status !== 'playing' || isPaused) return;
    
    setGameState((prev) => {
      const { fishingLine, hazards, fish, score, fishRemoved, debugMode } = prev;
      
      // Mark as in water
      const newAboveWater = false;
      let newY = fishingLine.y + speed;
      let newAttachedId = fishingLine.attachedHazardId;
      let updatedHazards = [...hazards];
      let updatedFish = [...fish];
      let newFishRemoved = fishRemoved;
      
      // Check if line is at bottom of water
      const waterBottom = SKY_HEIGHT + WATER_HEIGHT - 40; // 40 is floor height
      if (newY >= waterBottom) {
        newY = waterBottom;
      }
      
      // Check for hazard collision (only if not already attached)
      if (!newAttachedId) {
        const collidedHazard = checkLineHazardCollision(
          { ...fishingLine, y: newY },
          hazards
        );
        
        if (collidedHazard) {
          newAttachedId = collidedHazard.id;
          updatedHazards = hazards.map(h =>
            h.id === collidedHazard.id
              ? { ...h, attached: true, position: { x: fishingLine.x - h.width / 2, y: newY } }
              : h
          );
          
          if (debugMode) {
            console.log(`[Collision] Fishing line attached to hazard: ${collidedHazard.type}`);
          }
        }
      }
      
      // Check for fish collision if hazard is attached
      if (newAttachedId) {
        const attachedHazard = updatedHazards.find(h => h.id === newAttachedId);
        if (attachedHazard) {
          const collidedFish = checkHazardFishCollision(attachedHazard, updatedFish);
          
          if (collidedFish) {
            // Remove both fish and hazard, no points, reset line
            updatedFish = updatedFish.filter(f => f.id !== collidedFish.id);
            updatedHazards = updatedHazards.filter(h => h.id !== newAttachedId);
            newFishRemoved += 1;
            
            if (debugMode) {
              console.log(`[Collision] Hazard hit fish: 0 points. Fish removed: ${newFishRemoved}`);
            }
            
            // Reset line
            return {
              ...prev,
              fishingLine: {
                x: GAME_WIDTH / 2,
                y: SKY_HEIGHT,
                attachedHazardId: null,
                aboveWater: true,
              },
              hazards: updatedHazards,
              fish: updatedFish,
              fishRemoved: newFishRemoved,
            };
          }
        }
      }
      
      // Update attached hazard position
      if (newAttachedId) {
        updatedHazards = updatedHazards.map(h =>
          h.id === newAttachedId
            ? { ...h, position: { ...h.position, y: newY } }
            : h
        );
      }
      
      return {
        ...prev,
        fishingLine: {
          ...fishingLine,
          y: newY,
          attachedHazardId: newAttachedId,
          aboveWater: newAboveWater,
        },
        hazards: updatedHazards,
        fish: updatedFish,
        fishRemoved: newFishRemoved,
      };
    });
  }, [gameState.status, isPaused]);

  // Pull fishing line up
  const pullFishingLine = useCallback(() => {
    if (gameState.status !== 'playing' || isPaused) return;
    
    setGameState((prev) => {
      const { fishingLine, hazards, fish, score, hazardsCleared, fishRemoved, debugMode } = prev;
      
      let newY = fishingLine.y - FISHING_LINE_UP_SPEED;
      let updatedHazards = [...hazards];
      let updatedFish = [...fish];
      let newScore = score;
      let newHazardsCleared = hazardsCleared;
      let newFishRemoved = fishRemoved;
      let shouldResetLine = false;
      
      // Check for fish collision if hazard is attached (throughout the pull)
      if (fishingLine.attachedHazardId) {
        const attachedHazard = hazards.find(h => h.id === fishingLine.attachedHazardId);
        if (attachedHazard) {
          const collidedFish = checkHazardFishCollision(attachedHazard, updatedFish);
          
          if (collidedFish) {
            // Remove both fish and hazard, no points, reset line
            updatedFish = updatedFish.filter(f => f.id !== collidedFish.id);
            updatedHazards = updatedHazards.filter(h => h.id !== fishingLine.attachedHazardId);
            newFishRemoved += 1;
            
            if (debugMode) {
              console.log(`[Collision] Hazard hit fish during pull: 0 points. Fish removed: ${newFishRemoved}`);
            }
            
            // Reset line
            return {
              ...prev,
              fishingLine: {
                x: GAME_WIDTH / 2,
                y: SKY_HEIGHT,
                attachedHazardId: null,
                aboveWater: true,
              },
              hazards: updatedHazards,
              fish: updatedFish,
              fishRemoved: newFishRemoved,
            };
          }
        }
      }
      
      // Check if hazard has reached sky (above water surface)
      if (newY <= SKY_HEIGHT - 10 && fishingLine.attachedHazardId) {
        const attachedHazard = hazards.find(h => h.id === fishingLine.attachedHazardId);
        if (attachedHazard) {
          const points = getHazardScore(attachedHazard.type);
          newScore += points;
          newHazardsCleared += 1;
          updatedHazards = hazards.filter(h => h.id !== fishingLine.attachedHazardId);
          shouldResetLine = true;
          
          if (debugMode) {
            console.log(`[Scoring] Hazard removed into sky: ${attachedHazard.type} = ${points} points`);
            console.log(`[Scoring] New score: ${newScore}, Hazards cleared: ${newHazardsCleared}`);
          }
        }
      }
      
      // Reset line if hazard successfully removed
      if (shouldResetLine) {
        const polePos = getPolePosition(prev.fishermanDirection);
        return {
          ...prev,
          fishingLine: {
            x: polePos.x,
            y: polePos.y + 10, // Start 10px below pole tip
            attachedHazardId: null,
            aboveWater: true,
          },
          hazards: updatedHazards,
          score: newScore,
          hazardsCleared: newHazardsCleared,
        };
      }
      
      // Update attached hazard position
      if (fishingLine.attachedHazardId) {
        updatedHazards = updatedHazards.map(h =>
          h.id === fishingLine.attachedHazardId
            ? { ...h, position: { ...h.position, y: newY } }
            : h
        );
      }
      
      return {
        ...prev,
        fishingLine: {
          ...fishingLine,
          y: newY,
          aboveWater: newY <= SKY_HEIGHT,
        },
        hazards: updatedHazards,
      };
    });
  }, [gameState.status, isPaused]);

  // Game loop - only updates fish and hazards, no auto-drop
  useEffect(() => {
    if (gameState.status !== 'playing' || isPaused) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }
    
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateRef.current) / 16.67; // Normalize to 60fps
      lastUpdateRef.current = now;
      
      setGameState((prev) => {
        // Update fish and hazards (not attached ones)
        const updatedFish = updateFish(prev.fish, deltaTime);
        const updatedHazards = updateHazards(prev.hazards, deltaTime);
        
        return {
          ...prev,
          fish: updatedFish,
          hazards: updatedHazards,
        };
      });
      
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };
    
    lastUpdateRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.status, isPaused]);

  // Check game over and level completion
  useEffect(() => {
    if (gameState.status !== 'playing') return;
    
    // Check game over (3 fish removed)
    if (gameState.fishRemoved >= 3) {
      setGameState((prev) => ({ ...prev, status: 'gameover' }));
      if (gameState.debugMode) {
        console.log('[Game Over] 3 fish removed');
      }
      return;
    }
    
    // Check level completion (all hazards cleared)
    if (gameState.hazards.length === 0 && gameState.level <= 5) {
      setGameState((prev) => ({ ...prev, status: 'question' }));
      if (gameState.debugMode) {
        console.log(`[Level Complete] Level ${gameState.level} completed. Moving to question phase.`);
      }
    }
  }, [gameState.status, gameState.fishRemoved, gameState.hazards.length, gameState.level, gameState.debugMode]);

  // Answer question
  const answerQuestion = useCallback((answerIndex: number, isCorrect: boolean, timeRemaining: number) => {
    setGameState((prev) => {
      let scoreChange = 0;
      
      if (isCorrect) {
        // Calculate time-based score
        const maxTime = 30;
        const maxScore = 300;
        const minScore = 100;
        const ratio = timeRemaining / maxTime;
        scoreChange = Math.floor(minScore + (maxScore - minScore) * ratio);
      } else {
        scoreChange = -50;
      }
      
      const newScore = prev.score + scoreChange;
      const newLevel = prev.level + 1;
      
      if (prev.debugMode) {
        console.log(`[Question] ${isCorrect ? 'Correct' : 'Wrong'} answer. Score change: ${scoreChange}. New score: ${newScore}`);
      }
      
      // Check if game is complete
      if (newLevel > 5) {
        return {
          ...prev,
          score: newScore,
          status: 'celebration',
        };
      }
      
      return {
        ...prev,
        score: newScore,
        level: newLevel,
        status: 'playing',
        fishRemoved: 0,
      };
    });
    
    // Initialize next level
    if (gameState.level < 5) {
      setTimeout(() => {
        initializeLevel(gameState.level + 1);
      }, 100);
    }
  }, [gameState.level, gameState.debugMode, initializeLevel]);

  return {
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
  };
}
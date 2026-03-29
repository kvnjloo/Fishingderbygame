import {
  Fish,
  Hazard,
  FishingLine,
  HazardType,
  FishSize,
  HAZARD_SCORES,
} from '../types/game';
import {
  GAME_WIDTH,
  WATER_HEIGHT,
  SKY_HEIGHT,
  FISH_ZONE_HEIGHT,
  HAZARD_ZONE_START,
  FISH_SIZES,
  HAZARD_SIZES,
  LEVEL_CONFIG,
} from './constants';

// Collision detection
export function checkCollision(
  obj1: { x: number; y: number; width: number; height: number },
  obj2: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

// Check if fishing line collides with a hazard
export function checkLineHazardCollision(
  line: FishingLine,
  hazards: Hazard[]
): Hazard | null {
  if (line.attachedHazardId) return null;
  
  for (const hazard of hazards) {
    if (!hazard.attached) {
      const lineBox = {
        x: line.x - 1,
        y: line.y,
        width: 2,
        height: 10,
      };
      const hazardBox = {
        x: hazard.position.x,
        y: hazard.position.y,
        width: hazard.width,
        height: hazard.height,
      };
      
      if (checkCollision(lineBox, hazardBox)) {
        return hazard;
      }
    }
  }
  return null;
}

// Check if hazard collides with fish
export function checkHazardFishCollision(
  hazard: Hazard,
  fish: Fish[]
): Fish | null {
  for (const f of fish) {
    const hazardBox = {
      x: hazard.position.x,
      y: hazard.position.y,
      width: hazard.width,
      height: hazard.height,
    };
    const fishBox = {
      x: f.position.x,
      y: f.position.y,
      width: f.width,
      height: f.height,
    };
    
    if (checkCollision(hazardBox, fishBox)) {
      return f;
    }
  }
  return null;
}

// Update fish positions
export function updateFish(fish: Fish[], deltaTime: number = 1): Fish[] {
  return fish.map((f) => {
    let newX = f.position.x + f.velocityX * deltaTime;
    let newY = f.position.y + f.velocityY * deltaTime;
    let newVelocityX = f.velocityX;
    let newVelocityY = f.velocityY;
    let isDiving = f.divingBelowBoat || false;

    // Boat collision zone
    const boatLeft = GAME_WIDTH / 2 - 80;
    const boatRight = GAME_WIDTH / 2 + 80;
    const boatTop = SKY_HEIGHT - 10;
    const boatBottom = SKY_HEIGHT + 30;
    const belowBoatY = boatBottom + 10; // Clear zone below boat
    
    // Check if fish would enter boat zone
    const wouldHitBoat = 
      newX + f.width > boatLeft &&
      newX < boatRight &&
      newY + f.height > boatTop &&
      newY < boatBottom;
    
    if (wouldHitBoat && !isDiving) {
      // Start diving - move down below boat while maintaining direction
      isDiving = true;
      newVelocityY = 2; // Move down faster
      newY = f.position.y + newVelocityY * deltaTime;
    } else if (isDiving) {
      // Continue diving until below boat
      if (newY > belowBoatY) {
        // Done diving, resume normal swimming
        isDiving = false;
        newVelocityY = (Math.random() - 0.5) * 0.5; // Resume normal vertical movement
      } else {
        // Keep diving
        newVelocityY = 2;
      }
    }

    // Bounce off walls
    if (newX <= 0) {
      newVelocityX = Math.abs(newVelocityX);
      newX = 1;
    } else if (newX >= GAME_WIDTH - f.width) {
      newVelocityX = -Math.abs(newVelocityX);
      newX = GAME_WIDTH - f.width - 1;
    }

    // Stay in fish zone
    const minY = SKY_HEIGHT;
    const maxY = SKY_HEIGHT + FISH_ZONE_HEIGHT - f.height;
    
    if (newY <= minY) {
      newVelocityY = Math.abs(newVelocityY);
      newY = minY + 1;
    } else if (newY >= maxY) {
      newVelocityY = -Math.abs(newVelocityY);
      newY = maxY - 1;
    }

    return {
      ...f,
      position: { x: newX, y: newY },
      velocityX: newVelocityX,
      velocityY: newVelocityY,
      divingBelowBoat: isDiving,
    };
  });
}

// Update hazard positions (floating, not attached to line)
export function updateHazards(hazards: Hazard[], deltaTime: number = 1): Hazard[] {
  return hazards.map((h) => {
    // Skip attached hazards
    if (h.attached) {
      return h;
    }

    // Float in place - oscillate within 10px range (5px in each direction)
    const time = Date.now() / 1000; // Convert to seconds
    // Use hash of ID for consistent but unique seed
    const seed = h.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const offsetX = Math.sin(time + seed * 0.01) * 5; // 5px range left/right
    const offsetY = Math.cos(time * 0.7 + seed * 0.007) * 5; // 5px range up/down
    
    // Use original position or current position as base
    const basePosition = h.originalPosition || h.position;
    
    return {
      ...h,
      originalPosition: basePosition,
      position: {
        x: basePosition.x + offsetX,
        y: basePosition.y + offsetY,
      },
    };
  });
}

// Generate fish for a level
export function generateFish(level: number): Fish[] {
  const config = LEVEL_CONFIG[Math.min(level - 1, LEVEL_CONFIG.length - 1)];
  const fish: Fish[] = [];
  
  const fishSizes: FishSize[] = [
    ...Array(config.smallFish).fill('small'),
    ...Array(config.mediumFish).fill('medium'),
    ...Array(config.largeFish).fill('large'),
  ];
  
  fishSizes.forEach((size, index) => {
    const fishSize = FISH_SIZES[size];
    const x = Math.random() * (GAME_WIDTH - fishSize.width);
    const y = SKY_HEIGHT + Math.random() * (FISH_ZONE_HEIGHT - fishSize.height);
    
    fish.push({
      id: `fish-${level}-${index}`,
      size,
      position: { x, y },
      velocityX: (Math.random() - 0.5) * 2 + (Math.random() > 0.5 ? 0.5 : -0.5),
      velocityY: (Math.random() - 0.5) * 0.5,
      width: fishSize.width,
      height: fishSize.height,
    });
  });
  
  return fish;
}

// Generate hazards for a level
export function generateHazards(level: number): Hazard[] {
  const config = LEVEL_CONFIG[Math.min(level - 1, LEVEL_CONFIG.length - 1)];
  const hazards: Hazard[] = [];
  const hazardTypes: HazardType[] = ['rings', 'bag', 'net', 'line'];
  
  const BOUNDARY_MARGIN = 50; // Keep hazards 50px from boundaries
  
  for (let i = 0; i < config.hazardCount; i++) {
    const type = hazardTypes[Math.floor(Math.random() * hazardTypes.length)];
    const hazardSize = HAZARD_SIZES[type];
    
    // Generate X position with 50px margin from boundaries
    const minX = BOUNDARY_MARGIN;
    const maxX = GAME_WIDTH - hazardSize.width - BOUNDARY_MARGIN;
    const x = minX + Math.random() * (maxX - minX);
    
    const y = SKY_HEIGHT + HAZARD_ZONE_START + Math.random() * (WATER_HEIGHT - HAZARD_ZONE_START - 40 - hazardSize.height);
    
    const position = { x, y };
    
    hazards.push({
      id: `hazard-${level}-${i}`,
      type,
      position,
      originalPosition: { ...position }, // Set original position for floating
      velocityY: 0.3 + Math.random() * 0.3,
      width: hazardSize.width,
      height: hazardSize.height,
      attached: false,
    });
  }
  
  return hazards;
}

// Wall kick - try to find valid position for fishing line with hazard
export function wallKick(
  x: number,
  hazardWidth: number,
  debugMode: boolean
): number {
  // Check if current position is valid
  if (x >= 0 && x + hazardWidth <= GAME_WIDTH) {
    return x;
  }
  
  // Try offsets
  const offsets = [1, -1, 2, -2, 3, -3, 4, -4, 5, -5];
  for (const offset of offsets) {
    const newX = x + offset;
    if (newX >= 0 && newX + hazardWidth <= GAME_WIDTH) {
      if (debugMode) {
        console.log(`[Wall Kick] Offset ${offset} succeeded. New X: ${newX}`);
      }
      return newX;
    }
  }
  
  // Force within bounds
  const clampedX = Math.max(0, Math.min(GAME_WIDTH - hazardWidth, x));
  if (debugMode) {
    console.log(`[Wall Kick] All offsets failed. Clamping to ${clampedX}`);
  }
  return clampedX;
}

// Calculate time-based score for questions
export function calculateQuestionScore(timeRemaining: number): number {
  const maxTime = 30;
  const maxScore = 300;
  const minScore = 100;
  
  const ratio = timeRemaining / maxTime;
  return Math.floor(minScore + (maxScore - minScore) * ratio);
}

// Get score for hazard
export function getHazardScore(type: HazardType): number {
  return HAZARD_SCORES[type];
}
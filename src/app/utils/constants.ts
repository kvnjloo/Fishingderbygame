import { Question } from '../types/game';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const WATER_HEIGHT = GAME_HEIGHT * 0.75; // 75% of screen
export const SKY_HEIGHT = GAME_HEIGHT * 0.25; // 25% of screen
export const FLOOR_HEIGHT = 40;

export const FISH_ZONE_HEIGHT = WATER_HEIGHT * 0.25; // Top 25% of water
export const HAZARD_ZONE_START = FISH_ZONE_HEIGHT; // Remaining 75% of water

export const BOAT_WIDTH = 120;
export const BOAT_HEIGHT = 30; // Half the previous height
export const BOAT_Y = SKY_HEIGHT - 10; // Positioned at water surface

export const FISHERMAN_WIDTH = 30;
export const FISHERMAN_HEIGHT = 40;

// Calculate pole tip position based on fisherman direction
export function getPolePosition(direction: 'left' | 'right') {
  const poleX = direction === 'right' 
    ? GAME_WIDTH / 2 + 15 + FISHERMAN_WIDTH - 2
    : GAME_WIDTH / 2 - FISHERMAN_WIDTH - 15 - 2;
  const poleY = BOAT_Y;
  return { x: poleX, y: poleY };
}

export const FISHING_LINE_WIDTH = 2;
export const FISHING_LINE_SPEED = 3;
export const FISHING_LINE_FAST_SPEED = 6; // 2x speed for space bar
export const FISHING_LINE_UP_SPEED = 3; // Speed when pulling up

export const FISH_SIZES = {
  small: { width: 20, height: 12 },
  medium: { width: 30, height: 18 },
  large: { width: 40, height: 24 },
};

export const HAZARD_SIZES = {
  line: { width: 12, height: 12 },   // 25 points - smallest
  rings: { width: 16, height: 16 },  // 50 points
  bag: { width: 20, height: 26 },    // 75 points
  net: { width: 24, height: 24 },    // 100 points - largest
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is the most common type of ocean pollution?",
    answers: ["Plastic", "Oil", "Chemical waste", "Radioactive material"],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: "How long does it take for a plastic bottle to decompose in the ocean?",
    answers: ["50 years", "100 years", "450 years", "1000 years"],
    correctAnswer: 2,
  },
  {
    id: 3,
    question: "What percentage of ocean plastic pollution comes from land-based sources?",
    answers: ["40%", "60%", "80%", "90%"],
    correctAnswer: 2,
  },
  {
    id: 4,
    question: "Which ocean creature is most affected by plastic pollution?",
    answers: ["Sharks", "Sea turtles", "Dolphins", "Whales"],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: "What is the Great Pacific Garbage Patch?",
    answers: [
      "A garbage dump near California",
      "A large area of ocean with concentrated plastic debris",
      "A recycling facility",
      "An island made of trash"
    ],
    correctAnswer: 1,
  },
];

export const LEVEL_CONFIG = [
  { level: 1, fishCount: 5, smallFish: 5, mediumFish: 0, largeFish: 0, hazardCount: 3 },
  { level: 2, fishCount: 5, smallFish: 3, mediumFish: 2, largeFish: 0, hazardCount: 4 },
  { level: 3, fishCount: 5, smallFish: 2, mediumFish: 2, largeFish: 1, hazardCount: 5 },
  { level: 4, fishCount: 5, smallFish: 1, mediumFish: 2, largeFish: 2, hazardCount: 6 },
  { level: 5, fishCount: 5, smallFish: 0, mediumFish: 2, largeFish: 3, hazardCount: 7 },
];
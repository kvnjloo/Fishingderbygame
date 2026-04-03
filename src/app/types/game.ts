export type GameStatus = 'start' | 'playing' | 'paused' | 'question' | 'gameover' | 'celebration';

export type FishSize = 'small' | 'medium' | 'large';

export type HazardType = 'rings' | 'bag' | 'net' | 'line';

export interface Position {
  x: number;
  y: number;
}

export interface Fish {
  id: string;
  size: FishSize;
  position: Position;
  velocityX: number;
  velocityY: number;
  width: number;
  height: number;
  divingBelowBoat?: boolean; // Flag when diving to avoid boat
}

export interface Hazard {
  id: string;
  type: HazardType;
  position: Position;
  originalPosition?: Position; // For floating animation
  velocityY: number;
  width: number;
  height: number;
  attached: boolean;
}

export interface FishingLine {
  x: number;
  y: number;
  attachedHazardId: string | null;
  aboveWater: boolean;
}

export interface GameState {
  status: GameStatus;
  score: number;
  level: number;
  questionNumber: number; // Track which question (1-10) we're on
  fishRemoved: number;
  hazardsCleared: number;
  fish: Fish[];
  hazards: Hazard[];
  fishingLine: FishingLine;
  fishermanDirection: 'left' | 'right';
  debugMode: boolean;
}

export interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
}

export const HAZARD_SCORES: Record<HazardType, number> = {
  rings: 50,
  bag: 75,
  net: 100,
  line: 25,
};
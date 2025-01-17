export enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
  Expert = 'expert',
}

export const DifficultyLevels: Record<
  Difficulty,
  { name: string; clues: number; multiplier: number }
> = {
  [Difficulty.Easy]: {
    name: 'Easy',
    clues: 36,
    multiplier: 1,
  },
  [Difficulty.Medium]: {
    name: 'Medium',
    clues: 33,
    multiplier: 1.5,
  },
  [Difficulty.Hard]: {
    name: 'Hard',
    clues: 30,
    multiplier: 2,
  },
  [Difficulty.Expert]: {
    name: 'Expert',
    clues: 25,
    multiplier: 2.5,
  },
};

export const MISTAKE_LIMIT = 3;

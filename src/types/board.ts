import { Difficulty } from './difficulty';

/**
 * Represents the 9x9 Sudoku board.
 * A 0 value represents an empty cell.
 */
export type Puzzle = number[][];

export interface BoardData {
  cells: CellData[][];
  solution: number[][];
}

export interface CellData {
  value: number;
  prefilled: boolean;
}

export interface Cell {
  row: number;
  col: number;
}

export enum GameOverStatus {
  Ongoing = 'ongoing',
  Completed = 'completed',
  MistakeExceeded = 'mistake_exceeded',
}

export interface GameState {
  board: BoardData | null;
  selectedCell: { row: number; col: number } | null;
  difficulty: Difficulty;
  mistakes: number;
  gameOver: GameOverStatus;
  elapsedTime: number;
  lastMoveTime: number;
  score: number;
  history: BoardData[];
  historyOffset: number;
}

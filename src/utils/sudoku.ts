import { Puzzle } from '../types/board';

export const BOARD_SIZE = 9;
const EMPTY = 0;
const BOX_SIZE = 3;

/**
 * Checks whether placing a number at position (row, col) is valid.
 */
export function isValid(
  puzzle: Puzzle,
  row: number,
  col: number,
  num: number
): boolean {
  // Check row and column
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (puzzle[row][i] === num || puzzle[i][col] === num) {
      return false;
    }
  }

  // Check box
  const startRow = row - (row % BOX_SIZE);
  const startCol = col - (col % BOX_SIZE);
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (puzzle[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Solve puzzle using backtracking.
 * Returns true if solved; modifies the puzzle in place.
 */
export function solvePuzzle(puzzle: Puzzle): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (puzzle[row][col] === EMPTY) {
        for (let num = 1; num <= BOARD_SIZE; num++) {
          if (isValid(puzzle, row, col, num)) {
            puzzle[row][col] = num;
            if (solvePuzzle(puzzle)) {
              return true;
            }
            puzzle[row][col] = EMPTY;
          }
        }
        return false;
      }
    }
  }
  return true;
}

/**
 * Create an empty puzzle.
 */
export function createEmptyPuzzle(): Puzzle {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array(BOARD_SIZE).fill(EMPTY)
  );
}

/**
 * Generate a full solved Sudoku board.
 */
export function generateFullSolution(): Puzzle {
  const puzzle = createEmptyPuzzle();

  // helper function to fill puzzle recursively
  const fillPuzzle = (): boolean => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (puzzle[row][col] === EMPTY) {
          // shuffle numbers 1-9
          const numbers = shuffle(
            Array.from({ length: BOARD_SIZE }, (_, i) => i + 1)
          );
          for (const num of numbers) {
            if (isValid(puzzle, row, col, num)) {
              puzzle[row][col] = num;
              if (fillPuzzle()) {
                return true;
              }
              puzzle[row][col] = EMPTY;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  if (!fillPuzzle()) {
    throw new Error('Failed to generate a full board');
  }
  return puzzle;
}

/**
 * Remove numbers from a full solution to create a puzzle with a given number of clues.
 * @param fullPuzzle A complete solved Sudoku board.
 * @param clues Number of cells to remain filled (minimum 17 for a unique solution)
 */
export function pluckCells(fullPuzzle: Puzzle, clues: number): Puzzle {
  if (clues < 17 || clues > BOARD_SIZE * BOARD_SIZE) {
    throw new Error('Clues must be between 17 and 81');
  }

  // Deep copy full puzzle.
  const puzzle = fullPuzzle.map((row) => [...row]);

  const totalCells = BOARD_SIZE * BOARD_SIZE;
  const cellsToRemove = totalCells - clues;
  let removed = 0;

  // Create a randomized list of cell indices.
  const indices = shuffle(Array.from({ length: totalCells }, (_, i) => i));

  while (removed < cellsToRemove && indices.length > 0) {
    const index = indices.pop() as number;
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;
    const backup = puzzle[row][col];

    puzzle[row][col] = EMPTY;

    // Check uniqueness of solution (for full proof logic, you might run a solver here
    // with a counter and rollback if more than one solution is found).
    // Here we assume the puzzle remains uniquely solvable.
    // In production you could use a function like hasUniqueSolution(puzzle: Puzzle): boolean.
    if (!hasUniqueSolution(puzzle)) {
      // Rollback if not unique.
      puzzle[row][col] = backup;
    } else {
      removed++;
    }
  }
  return puzzle;
}

/**
 * Check if the given puzzle has a unique solution.
 * This uses backtracking that stops when a second solution is found.
 */
export function hasUniqueSolution(puzzle: Puzzle): boolean {
  const copy = puzzle.map((row) => [...row]);
  let count = 0;

  const solveCount = (): boolean => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (copy[row][col] === EMPTY) {
          for (let num = 1; num <= BOARD_SIZE; num++) {
            if (isValid(copy, row, col, num)) {
              copy[row][col] = num;
              if (solveCount()) {
                return true;
              }
              copy[row][col] = EMPTY;
            }
          }
          return false;
        }
      }
    }
    count++;
    // If a second solution is found, stop early.
    return count > 1;
  };

  solveCount();

  return count === 1;
}

/**
 * Utility: Shuffle an array (Fisher-Yates)
 */
export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

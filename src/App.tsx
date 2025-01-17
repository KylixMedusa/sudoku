import React, { useEffect, useState } from 'react';

import './App.scss';
import HomeScreen from './pages/HomeScreen/HomeScreen';
import { Difficulty, DifficultyLevels } from './types/difficulty';
import { generateFullSolution, pluckCells } from './utils/sudoku';
import { BoardData, Cell, CellData, GameState } from './types/board';
import GameScreen from './pages/GameScreen/GameScreen';
import { loadGameState } from './types/localstorage';
import Loader from './components/Loader/Loader';

enum Screen {
  Home = 'home',
  Game = 'game',
}

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.Home);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [existingGame, setExistingGame] = useState<GameState | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [board, setBoard] = useState<BoardData | null>(null);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  const startNewGame = (difficulty: Difficulty) => {
    try {
      const clues = DifficultyLevels[difficulty].clues;
      const solution = generateFullSolution();
      const puzzle = pluckCells(solution, clues);

      // Create cells that indicate whether they are prefilled (given) or user added.
      const cells: CellData[][] = puzzle.map((row) =>
        row.map((value) => ({
          value,
          // A cell is prefilled if its value is nonzero in the puzzle.
          prefilled: value !== 0,
        }))
      );
      setExistingGame(null);
      setDifficulty(difficulty);
      setBoard({ cells, solution });
      setSelectedCell(null);
      setScreen(Screen.Game);
    } catch (error) {
      console.error('Error generating puzzle', error);
    }
  };

  const continueGame = (existingGame: GameState) => {
    setDifficulty(existingGame.difficulty);
    setBoard(existingGame.board);
    setSelectedCell(existingGame.selectedCell);
    setScreen(Screen.Game);
  };

  useEffect(() => {
    if (screen === Screen.Home) {
      const gameState = loadGameState();
      setExistingGame(gameState);
    }
  }, [screen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {screen === Screen.Home && (
            <HomeScreen
              startNewGame={startNewGame}
              existingGame={existingGame}
              continueGame={continueGame}
            />
          )}
          {screen === Screen.Game && board ? (
            <GameScreen
              existingGame={existingGame}
              difficulty={difficulty}
              board={board}
              setBoard={setBoard}
              selectedCell={selectedCell}
              setSelectedCell={setSelectedCell}
              closeGame={() => setScreen(Screen.Home)}
            />
          ) : (
            <Loader />
          )}
        </>
      )}
    </>
  );
};

export default App;

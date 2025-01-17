import React, { useEffect, useMemo, useRef, useState } from 'react';

import './styles.scss';

import { BoardData, Cell, GameOverStatus, GameState } from '../../types/board';
import Board from '../../components/Board/Board';
import BoardControls from '../../components/BoardControls/BoardControls';
import { ChevronBack } from 'react-ionicons';
import { Difficulty, MISTAKE_LIMIT } from '../../types/difficulty';
import { clearGameState, saveGameState } from '../../types/localstorage';
import GameStats from '../../components/GameStats/GameStats';
import GameOverModal from '../../components/Modal/GameOverModal';
import PauseModal from '../../components/Modal/PauseModal';

interface Props {
  difficulty: Difficulty;
  board: BoardData;
  setBoard: React.Dispatch<React.SetStateAction<BoardData | null>>;
  selectedCell: Cell | null;
  setSelectedCell: React.Dispatch<React.SetStateAction<Cell | null>>;
  closeGame: () => void;
  existingGame: GameState | null;
}

const BASE_SCORE = 1000; // starting score for a new game
const MOVE_BONUS = 1000; // bonus points on each correct move
const TIME_DEDUCTION_RATE = 2; // points per second deducted (or you can factor this in bonus)
const MISTAKE_PENALTY = 500; // penalty for each mistake
const HINT_PENALTY = 750; // penalty for each hint

const GameScreen: React.FC<Props> = ({
  difficulty,
  board,
  setBoard,
  selectedCell,
  setSelectedCell,
  existingGame,
  closeGame,
}) => {
  // Track number of mistakes
  const [mistakes, setMistakes] = useState<number>(0);
  // Flag for game over status
  const [gameOver, setGameOver] = useState<GameOverStatus>(
    GameOverStatus.Ongoing
  );

  // Timer state
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const timerRef = useRef<number | null>(null);
  const lastMoveTime = useRef<number>(0);

  // Score state
  const [score, setScore] = useState<number>(BASE_SCORE);

  // History for undo/redo
  const [history, setHistory] = useState<BoardData[]>([]);
  const [historyOffset, setHistoryOffset] = useState<number>(0);

  const [isGameOverModalVisible, setIsGameOverModalVisible] = useState(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const init = () => {
    if (existingGame) {
      setHistory(existingGame.history);
      setHistoryOffset(existingGame.historyOffset);
      setMistakes(existingGame.mistakes);
      setGameOver(existingGame.gameOver);
      setScore(existingGame.score);
      setElapsedTime(existingGame.elapsedTime);
      lastMoveTime.current = existingGame.lastMoveTime;
    } else {
      setHistory([board]);
      setHistoryOffset(0);
      setMistakes(0);
      setGameOver(GameOverStatus.Ongoing);
      setScore(BASE_SCORE);
      setElapsedTime(0);
      lastMoveTime.current = 0;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => {
      startTimer();
    }, 1000);
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveState = () => {
    saveGameState({
      board,
      difficulty,
      elapsedTime,
      gameOver,
      history,
      historyOffset,
      lastMoveTime: lastMoveTime.current,
      mistakes,
      score,
      selectedCell,
    });
  };

  useEffect(() => {
    saveState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsedTime]);

  useEffect(() => {
    if (
      gameOver === GameOverStatus.Completed ||
      gameOver === GameOverStatus.MistakeExceeded
    ) {
      clearGameState();
      setIsGameOverModalVisible(true);
    }
  }, [gameOver]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Document is hidden: pause the timer.
        pauseTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Timer functions
  const startTimer = () => {
    setIsTimerRunning(true);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resumeTimer = () => {
    if (!isTimerRunning) {
      startTimer();
    }
  };

  // Check if the puzzle is solved.
  const isPuzzleSolved = (currentBoard: BoardData): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (
          currentBoard.cells[row][col].value !== currentBoard.solution[row][col]
        ) {
          return false;
        }
      }
    }
    return true;
  };

  // fill cell if valid
  const handleCellClick = (row: number, col: number) => {
    const cell = board?.cells[row][col];
    if (cell?.prefilled) return;
    setSelectedCell({ row, col });
  };

  // Update board state and add the new state to history.
  const updateBoardState = (newBoard: BoardData) => {
    // Remove any "redo" history beyond the current step.
    const newHistory = history.slice(0, historyOffset + 1);
    newHistory.push(newBoard);
    setHistory(newHistory);
    setHistoryOffset(newHistory.length - 1);
    setBoard(newBoard);
  };

  // Update cell value when a user makes a move.
  // Increment mistake counter if the entered value does not match the solution.
  const updateCellValue = (value: number) => {
    // Prevent moves if game is over.
    if (gameOver !== GameOverStatus.Ongoing) return;
    if (!board || !selectedCell) return;
    const { row, col } = selectedCell;
    const cell = board.cells[row][col];
    if (cell.prefilled) return;

    const correctValue = board.solution[row][col];
    const isCorrect = value === correctValue;

    // If the entered value is non-zero and incorrect, increment mistakes.
    if (value !== 0 && !isCorrect) {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setScore((prev) => Math.max(0, prev - MISTAKE_PENALTY));
      // If limit exceeded, declare game over.
      if (newMistakes >= MISTAKE_LIMIT) {
        setGameOver(GameOverStatus.MistakeExceeded);
        pauseTimer();
      }
    } else if (isCorrect && value !== 0) {
      const moveTime = elapsedTime - lastMoveTime.current;
      const moveBonus = Math.max(
        0,
        MOVE_BONUS - moveTime * TIME_DEDUCTION_RATE
      );
      lastMoveTime.current = elapsedTime;
      // For a correct move, add a bonus.
      setScore((prev) => prev + moveBonus);
    }

    const newCells = board.cells.map((r, i) =>
      r.map((cellData, j) => {
        if (i === row && j === col) {
          return { ...cellData, value };
        }
        return cellData;
      })
    );
    const newBoard: BoardData = { ...board, cells: newCells };
    updateBoardState(newBoard);

    // Check if the puzzle has been solved.
    if (isPuzzleSolved(newBoard)) {
      setGameOver(GameOverStatus.Completed);
      pauseTimer();
    }
  };

  // Undo: move one step back in history.
  const undo = () => {
    if (historyOffset > 0) {
      const newOffset = historyOffset - 1;
      setHistoryOffset(newOffset);
      setBoard(history[newOffset]);
    }
  };

  // Redo: move one step forward in history.
  const redo = () => {
    if (historyOffset < history.length - 1) {
      const newOffset = historyOffset + 1;
      setHistoryOffset(newOffset);
      setBoard(history[newOffset]);
    }
  };

  // Hint: fill in the currently selected cell with the correct value from the solution.
  const hint = () => {
    if (!board || !selectedCell) return;
    const { row, col } = selectedCell;
    const cell = board.cells[row][col];
    if (cell.prefilled) return; // Already given
    // Do nothing if the cell already has the correct answer.
    if (cell.value === board.solution[row][col]) return;

    // Update the cell with the correct value.
    const newCells = board.cells.map((r, i) =>
      r.map((cellData, j) => {
        if (i === row && j === col) {
          return { ...cellData, value: board.solution[row][col] };
        }
        return cellData;
      })
    );
    const newBoard: BoardData = { ...board, cells: newCells };
    updateBoardState(newBoard);
    // Deduct points for using a hint.
    setScore((prev) => Math.max(0, prev - HINT_PENALTY));

    if (isPuzzleSolved(newBoard)) {
      setGameOver(GameOverStatus.Completed);
      pauseTimer();
    }
  };

  const frequencies = useMemo(() => {
    const frequencies: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    };
    board.cells.forEach((row, rowIndex) =>
      row.forEach((cell, colIndex) => {
        const solution = board.solution[rowIndex][colIndex];
        if (cell.value !== 0 && cell.value === solution) {
          frequencies[cell.value] = (frequencies[cell.value] || 0) + 1;
        }
      })
    );
    return frequencies;
  }, [board]);

  return (
    <div className="sudoku-game">
      <button className="back-button" onClick={closeGame}>
        <ChevronBack />
      </button>
      <h1 className="title-font game-title">Sudoku</h1>
      <div className="game-layout">
        <GameStats
          score={score}
          mistakes={mistakes}
          elapsedTime={elapsedTime}
          isTimerRunning={isTimerRunning}
          pauseTimer={pauseTimer}
          resumeTimer={resumeTimer}
          difficulty={difficulty}
        />
        <Board
          board={board}
          selectedCell={selectedCell}
          onCellClick={handleCellClick}
        />
        <BoardControls
          onSelectNumber={updateCellValue}
          onUndo={undo}
          onRedo={redo}
          onHint={hint}
          frequencies={frequencies}
        />
      </div>
      {isGameOverModalVisible ? (
        <GameOverModal
          score={score}
          elapsedTime={elapsedTime}
          mistakes={mistakes}
          difficulty={difficulty}
          onClose={closeGame}
        />
      ) : !isTimerRunning ? (
        <PauseModal onResume={resumeTimer} onClose={closeGame} />
      ) : null}
    </div>
  );
};

export default GameScreen;

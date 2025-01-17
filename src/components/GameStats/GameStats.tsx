import React from 'react';

import { Pause, Play } from 'react-ionicons';
import { formatTime } from '../../types/common';
import {
  Difficulty,
  DifficultyLevels,
  MISTAKE_LIMIT,
} from '../../types/difficulty';

interface Props {
  score: number;
  mistakes: number;
  elapsedTime: number;
  isTimerRunning: boolean;
  pauseTimer: () => void;
  resumeTimer: () => void;
  difficulty: Difficulty;
  showTimerButton?: boolean;
}

const GameStats: React.FC<Props> = ({
  score,
  mistakes,
  elapsedTime,
  isTimerRunning,
  pauseTimer,
  resumeTimer,
  difficulty,
  showTimerButton = true,
}) => {
  return (
    <div className="game-stats">
      <div>
        <h5>Difficulty</h5>
        <p>{DifficultyLevels[difficulty].name}</p>
      </div>
      <div>
        <h5>Mistakes</h5>
        <p>{
          // Display the number of mistakes made.
          `${mistakes} / ${MISTAKE_LIMIT}`
        }</p>
      </div>
      <div>
        <h5>Score</h5>
        <p>{score}</p>
      </div>
      <div className="time">
        <div>
          <h5>Time</h5>
          <p>{formatTime(elapsedTime)}</p>
        </div>
        {showTimerButton && (
          <button
            onClick={() => {
              if (isTimerRunning) {
                pauseTimer();
              } else {
                resumeTimer();
              }
            }}
          >
            {isTimerRunning ? <Pause /> : <Play />}
          </button>
        )}
      </div>
    </div>
  );
};

export default GameStats;

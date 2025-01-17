import React from 'react';

import Modal from './Modal';
import { Difficulty, MISTAKE_LIMIT } from '../../types/difficulty';
import GameStats from '../GameStats/GameStats';

interface Props {
  score: number;
  elapsedTime: number;
  mistakes: number;
  difficulty: Difficulty;
  onClose: () => void;
}

const GameOverModal: React.FC<Props> = ({
  score,
  elapsedTime,
  mistakes,
  difficulty,
  onClose,
}) => {
  const isGameLost = mistakes >= MISTAKE_LIMIT;
  return (
    <Modal>
      <div className="modal-header">
        <h4 className="modal-title title-font">
          {isGameLost ? 'Game Over!' : 'Game Won!'}
        </h4>
      </div>
      <div className="modal-body">
        <p>
          {isGameLost
            ? 'You have made too many mistakes. Better luck next time!'
            : 'Congratulations! You have won the game!'}
        </p>
        <GameStats
          score={score}
          elapsedTime={elapsedTime}
          mistakes={mistakes}
          difficulty={difficulty}
          showTimerButton={false}
          isTimerRunning={false}
          pauseTimer={() => {}}
          resumeTimer={() => {}}
        />
      </div>
      <div className="modal-footer">
        <button onClick={onClose} className="button">
          Close
        </button>
      </div>
    </Modal>
  );
};

export default GameOverModal;

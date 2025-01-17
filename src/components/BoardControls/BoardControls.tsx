import React from 'react';
import {
  ArrowRedoOutline,
  ArrowUndoOutline,
  BulbOutline,
  RemoveCircleOutline,
} from 'react-ionicons';

import './styles.scss';
import { BOARD_SIZE } from '../../utils/sudoku';

interface Props {
  onSelectNumber: (number: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onHint: () => void;
  frequencies: Record<number, number>;
}

const BoardControls: React.FC<Props> = ({
  onSelectNumber,
  onUndo,
  onRedo,
  onHint,
  frequencies,
}) => {
  const isExhausted = (num: number) => frequencies[num] >= BOARD_SIZE;

  return (
    <div className="controls">
      <div className="controls__buttons">
        <button onClick={onUndo}>
          <ArrowUndoOutline />
          <span>Undo</span>
        </button>
        <button onClick={onRedo}>
          <ArrowRedoOutline />
          <span>Redo</span>
        </button>
        <button onClick={() => onSelectNumber(0)}>
          <RemoveCircleOutline />
          <span>Erase</span>
        </button>
        <button onClick={onHint}>
          <BulbOutline />
          <span>Hint</span>
        </button>
      </div>
      <div className="number__buttons">
        {Array.from({ length: 9 }, (_, i) => {
          const num = i + 1;
          return (
            <button
              key={num}
              onClick={() => onSelectNumber(num)}
              disabled={isExhausted(num)}
              className={isExhausted(num) ? 'exhausted' : ''}
              title={`Used ${frequencies[num] || 0} times`}
            >
              {num}
              <span className="frequency">
                {BOARD_SIZE - (frequencies[num] || 0)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BoardControls;

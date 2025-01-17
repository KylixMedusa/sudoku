import React from 'react';

import './styles.scss';

import { BoardData } from '../../types/board';

interface BoardProps {
  board: BoardData | null;
  selectedCell: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
}

const Board: React.FC<BoardProps> = ({ board, selectedCell, onCellClick }) => {
  if (!board) return <div>Loading puzzle...</div>;

  const inSameBox = (
    row: number,
    col: number,
    selRow: number,
    selCol: number
  ) =>
    Math.floor(row / 3) === Math.floor(selRow / 3) &&
    Math.floor(col / 3) === Math.floor(selCol / 3);

  const selectedValue =
    selectedCell && board.cells[selectedCell.row][selectedCell.col].value;

  return (
    <div className="board">
      {board.cells.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => {
            const isSelected =
              selectedCell &&
              selectedCell.row === rowIndex &&
              selectedCell.col === colIndex;
            const inSameRow = selectedCell && selectedCell.row === rowIndex;
            const inSameCol = selectedCell && selectedCell.col === colIndex;
            const inBox =
              selectedCell &&
              inSameBox(rowIndex, colIndex, selectedCell.row, selectedCell.col);
            const isSameValue =
              selectedValue && cell.value !== 0 && cell.value === selectedValue;

            // Build the CSS classes
            let extraClasses = '';
            if (isSelected) extraClasses += ' selected';
            if (inSameRow || inSameCol || inBox) extraClasses += ' highlighted';
            if (isSameValue) extraClasses += ' same-value';
            if (cell.prefilled) extraClasses += ' prefilled';

            // Check if the user has filled an incorrect value.
            const isError =
              cell.value !== 0 &&
              cell.value !== board.solution[rowIndex][colIndex];

            return (
              <div
                key={colIndex}
                className={`board-cell${extraClasses}${
                  isError ? ' error' : ''
                }`}
                onClick={() => {
                  // Prevent clicking prefilled cells if desired
                  if (!cell.prefilled) {
                    onCellClick(rowIndex, colIndex);
                  }
                }}
              >
                {cell.value !== 0 ? cell.value : ''}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Board;

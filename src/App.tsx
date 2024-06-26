import React, { useState } from 'react';
import './App.css';
import {getOthello} from './othello_facade';
import { OthelloType, Piece } from './othello_rules'

const App: React.FC = () => {
  const [othello] = useState(getOthello());

  const [board, setBoard] = useState<(Piece | null)[][]>(othello.getBoard());

  const [blackCount, setBlackCount] = useState(0);
  const [whiteCount, setWhiteCount] = useState(0);

  const handleCellClick = (row: number, col: number) => {
    if (!othello.putPiece(row, col)) {
      return;
    }

    setBoard([...othello.getBoard()]);
    const counts = othello.getPieceCounts();
    setBlackCount(counts.black);
    setWhiteCount(counts.white);

    if (othello.isGameOver()) {
      alert('Game Over');
    }
  };

  const handleReset = () => {
    othello.resetGame();
    setBoard([...othello.getBoard()]);
    setBlackCount(0);
    setWhiteCount(0);
  };

  return (
    <div>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell === Piece.BLACK ? 'black' : cell === Piece.WHITE ? 'white' : ''}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="info">
        <p>Black: {blackCount}</p>
        <p>White: {whiteCount}</p>
      </div>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default App;

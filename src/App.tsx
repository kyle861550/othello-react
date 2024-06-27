import React, { useState } from 'react';
import './App.css';
import {getOthelloFacade, IOthelloFacade, Piece} from './othello';

const othello: IOthelloFacade = getOthelloFacade();

const App: React.FC = () => {

  const [board, setBoard] = useState<(Piece | null)[][]>(othello.getBoard());

  const [blackCount, setBlackCount] = useState(0);
  const [whiteCount, setWhiteCount] = useState(0);

  const onCellClick = (row: number, col: number) => {
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

  const onReset = () => {
    othello.resetGame();
    setBoard([...othello.getBoard()]);
    setBlackCount(0);
    setWhiteCount(0);
  };

  return (
    <div>
      <div className="board-description">
        <p>Board Size: {`${othello.othelloType.rows} x ${othello.othelloType.cols}`}</p>
      </div>

      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell === Piece.BLACK ? 'black' : cell === Piece.WHITE ? 'white' : ''}`}
                onClick={() => onCellClick(rowIndex, colIndex)}
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
      
      <button onClick={onReset}>Reset</button>
    </div>
  );
};

export default App;

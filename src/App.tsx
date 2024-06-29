import React, { useEffect, useState } from 'react';
import './App.css';
import {
  Piece,
  Player, 
  PieceCounts,
  IOthelloRule,
} from './othello';

import {  
  OthelloError, 
  OthelloGame,
  IOthelloAction,
} from './othello_framework';


const App: React.FC = () => {

    const onError = (error: OthelloError) => {
        alert(`Error: ${OthelloError[error]}`);
    };

    const onGameOver = (winner: Player) => {
        let winner_str = winner === Player.BLACK_PLAYER ? "Block" : "White";
        alert(`Game Over! Winner: ${winner_str}`);
    };

    const onBoardChange = (counts: PieceCounts, board: (Piece | null)[][]) => {
        updateBoard([...board]);
        updateCounts(counts);
    };

    const [game] = useState<OthelloGame>(new OthelloGame(onError, onGameOver, onBoardChange));
    const [gameRules] = useState<IOthelloRule>(game.rules);
    const [gameAction] = useState<IOthelloAction>(game.action);
    const [board, updateBoard] = useState<(Piece | null)[][]>(gameAction.information.getBoard());
    const [counts, updateCounts] = useState<PieceCounts>(gameAction.information.getPieceCounts);
    const [selectedType, setSelectedType] = useState<string>(gameAction.information.getType().descript);

    useEffect(() => {
        gameAction.resetGame();
    }, [gameAction]);


    const onCellClick = (row: number, col: number) => {
        gameAction.putPiece(row, col);
    };

    const onReset = () => {
        gameAction.resetGame();
    };

    const onOthelloTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDescription = event.target.value;
        const selectedType = gameRules.values().find(
            type => type.descript === selectedDescription) || gameRules.getDefaultCustomType();

        setSelectedType(selectedType.descript);

        gameAction.setType(selectedType);
    };
  

    const onCustomSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const size = parseInt(event.target.value, 10);

        gameAction.setType(gameRules.createCustomOthelloType(size));
    };
  

    const getBoardSizeDescription = (gameAction: IOthelloAction) => {
        const type = gameAction.information.getType();
        return `${type.rows} x ${type.cols}`;
    };

    const getCellClassName = (cell: Piece | null) => {
        return `cell ${cell === Piece.BLACK ? 'black' : cell === Piece.WHITE ? 'white' : ''}`;
    };

    const gridTemplateStyle = {
        gridTemplateRows: `repeat(${board.length}, 1fr)`,
        gridTemplateColumns: `repeat(${board[0].length}, 1fr)`
    };

  return (
    <div>
        <div className="controls">
            <select onChange={onOthelloTypeChange} value={selectedType}>
                {gameRules.values().map((type) => (
                    <option key={type.descript} value={type.descript}>
                        {type.descript}
                    </option>
                ))}
            </select>
            {selectedType === gameRules.getDefaultCustomType().descript && (
                <input
                    type="number"
                    value={gameAction.information.getType().cols}
                    onChange={onCustomSizeChange}
                    min={gameRules.minSize}
                    placeholder="Board Size"
                />
            )}
        </div>
        <div className="board-description">
            <p>Board Size: {getBoardSizeDescription(gameAction)}</p>
        </div>
        <div className="board" style={gridTemplateStyle}>
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((cell, colIndex) => (
                        <div
                            key={colIndex}
                            className={getCellClassName(cell)}
                            onClick={() => onCellClick(rowIndex, colIndex)}
                        >
                        </div>
                    ))}
                </div>
            ))}
        </div>
        <div className="info">
            <p>Current Player: {gameAction.information.getCurrentPlayer()}</p>
            <p>Black: {counts.black}</p>
            <p>White: {counts.white}</p>
        </div>
        <button onClick={onReset}>Reset</button>
    </div>
  );
};

export default App;

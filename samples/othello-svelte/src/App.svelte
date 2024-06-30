<script>
  import { onMount } from 'svelte';
  import { Piece, Player } from 'othello-model/lib/othello_core';
  import { OthelloError, OthelloGame } from 'othello-model/lib/othello_framework';

  let game, gameRules, gameAction;
  let board = [];
  let counts = {};
  let selectedType = '';
  let customPlacement = false;
  let selectedPiece = Piece.BLACK;
  let customCols = 8; // 默认值

  onMount(() => {
    const onError = (error) => {
      alert(`Error: ${OthelloError[error]}`);
    };

    const onGameOver = (winner) => {
      if (winner == null) {
        alert("Game Over! Both sides draw");
        return;
      }
      let winner_str = winner === Player.BLACK_PLAYER ? "Black" : "White";
      alert(`Game Over! Winner: ${winner_str}`);
    };

    const onBoardChange = (newCounts, newBoard) => {
      board = [...newBoard];
      counts = newCounts;
    };

    const onRestarted = () => {
      customPlacement = false;
    };

    game = new OthelloGame(onRestarted, onError, onGameOver, onBoardChange);
    gameRules = game.rules;
    gameAction = game.action;
    board = gameAction.information.getBoard();
    counts = gameAction.information.getPieceCounts();
    selectedType = gameAction.information.getType().descript;
    customCols = gameAction.information.getType().cols;
  });

  const onCellClick = (row, col) => {
    gameAction.putPiece(row, col);
  };

  const onReset = () => {
    gameAction.resetGame();
  };

  const onOthelloTypeChange = (event) => {
    const selectedDescription = event.target.value;
    const newSelectedType = gameRules.values().find(
      (type) => type.descript === selectedDescription
    ) || gameRules.getDefaultCustomType();

    selectedType = newSelectedType.descript;
    gameAction.setType(newSelectedType);
    customCols = gameAction.information.getType().cols;
  };

  const onCustomSizeChange = (event) => {
    const size = parseInt(event.target.value, 10);
    customCols = size;
    gameAction.setType(gameRules.createCustomOthelloType(size));
  };

  const getBoardSizeDescription = () => {
    if (!gameAction) return '';
    const type = gameAction.information.getType();
    return `${type.rows} x ${type.cols}`;
  };

  const getCellClassName = (cell) => {
    return `cell ${cell === Piece.BLACK ? 'black' : cell === Piece.WHITE ? 'white' : ''}`;
  };

  const onCustomPlacementChange = (event) => {
    let isSelected = event.target.checked;
    customPlacement = isSelected;
    gameAction.customerBoard.setCustomBoard(isSelected);
  };

  const onPieceSelectionChange = (event) => {
    selectedPiece = event.target.value === 'black' ? Piece.BLACK : Piece.WHITE;
    let player = event.target.value === 'black' ? Player.BLACK_PLAYER : Player.WHITE_PLAYER;
    gameAction.customerBoard.setCurrentPlayer(player);
  };
  
  const gridTemplateStyle = () => {
    return {
      gridTemplateRows: `repeat(${board.length}, 1fr)`,
      gridTemplateColumns: `repeat(${board[0].length}, 1fr)`
    };
  };
</script>

<div>
  <div class="controls">
    {#if gameRules}
      <select bind:value={selectedType} on:change={onOthelloTypeChange}>
        {#each gameRules.values() as type}
          <option value={type.descript}>
            {type.descript}
          </option>
        {/each}
      </select>
      {#if selectedType === gameRules.getDefaultCustomType().descript}
        <input
          type="number"
          bind:value={customCols}
          on:input={onCustomSizeChange}
          min={gameRules.minSize}
          placeholder="Board Size"
        />
      {/if}
    {/if}
  </div>
  <div class="board-description">
    <p>Board Size: {getBoardSizeDescription()}</p>
    <label>
      Simulation Placement:
      <input type="checkbox" bind:checked={customPlacement} on:change={onCustomPlacementChange} />
    </label>
    {#if customPlacement}
      <select bind:value={selectedPiece} on:change={onPieceSelectionChange}>
        <option value="black">Black</option>
        <option value="white">White</option>
      </select>
    {/if}
  </div>
  <div class="board" style={gridTemplateStyle}>
    {#each board as row, rowIndex}
      <div class="row" key={rowIndex}>
        {#each row as cell, colIndex}
          <div
            class={getCellClassName(cell)}
            key={colIndex}
            on:click={() => onCellClick(rowIndex, colIndex)}
          ></div>
        {/each}
      </div>
    {/each}
  </div>
  <div class="info">
    <p>Current Player: {gameAction?.information?.getCurrentPlayer()}</p>
    <p>Black: {counts.black}</p>
    <p>White: {counts.white}</p>
  </div>
  <button on:click={onReset}>Reset</button>
</div>

<style>
.board {
  display: grid;
  gap: 0;
  border: 1px solid #000;
}
.row {
  display: flex;
}
.cell {
  width: 50px;
  height: 50px;
  background-color: green;
  border: 1px solid #000;
  box-sizing: border-box;
}
.cell.black {
  background-color: black;
}
.cell.white {
  background-color: white;
}
</style>

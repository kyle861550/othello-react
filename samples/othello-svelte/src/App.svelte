<script>
  import { onMount } from 'svelte';
  import { Piece, Player } from 'othello-model/lib/othello_core';
  import { OthelloError, OthelloGameTotalEvent } from 'othello-model/lib/othello_framework';

  let game, gameRules, gameAction;
  let board = [];
  let counts = {};
  let selectedType = '';
  let customPlacement = false;
  let selectedPiece = Piece.BLACK;
  let customCols = 8;

  onMount(() => {
    const onError = (error) => {
      alert(`Error: ${OthelloError[error]}`);
    };

    const onGameOver = (winner) => {
      if (winner == null) {
        alert("Game Over! Both sides draw");
        return;
      }
      const winner_str = winner === Player.BLACK_PLAYER ? "Black" : "White";
      alert(`Game Over! Winner: ${winner_str}`);
    };

    const onBoardChange = (boardData) => {
      board = [...boardData.board];
      counts = boardData.counts;
    };

    const onRestarted = () => {
      customPlacement = false;
    };

    game = new OthelloGameTotalEvent(onRestarted, onError, onGameOver, onBoardChange);
    gameRules = game.rules;
    gameAction = game.action;
    board = gameAction.information.getBoard();
    counts = gameAction.information.getPieceCounts();
    selectedType = gameAction.information.getType().descript;
    customCols = gameAction.information.getType().cols;
  });

  const onCellClick = (row, col) => {
    gameAction?.putPiece({row, col});
  };

  const onReset = () => {
    gameAction?.resetGame();
  };

  const onOthelloTypeChange = (event) => {
    const selectedDescription = event.target.value;
    const newSelectedType =
      gameRules.values().find((type) => type.descript === selectedDescription) ||
      gameRules.getDefaultCustomType();

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
    const isSelected = event.target.checked;
    customPlacement = isSelected;
    gameAction.customerBoard.setCustomBoard(isSelected);
  };

  // 選子顏色直接綁 enum 值，並用響應式語句同步目前玩家
  $: if (gameAction) {
    const player = selectedPiece === Piece.BLACK ? Player.BLACK_PLAYER : Player.WHITE_PLAYER;
    gameAction.customerBoard.setCurrentPlayer(player);
  }
</script>

<div>
  <div class="controls">
    {#if gameRules}
      <select bind:value={selectedType} on:change={onOthelloTypeChange}>
        {#each gameRules.values() as type (type.descript)}
          <option value={type.descript}>{type.descript}</option>
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
      <select bind:value={selectedPiece}>
        <option value={Piece.BLACK}>Black</option>
        <option value={Piece.WHITE}>White</option>
      </select>
    {/if}
  </div>

  <div
    class="board"
    style={`grid-template-rows: repeat(${board.length}, 1fr); grid-template-columns: repeat(${board[0]?.length || 0}, 1fr);`}
  >
    {#each board as row, rowIndex (rowIndex)}
      <div class="row">
        {#each row as cell, colIndex (colIndex)}
          <!-- svelte-ignore element_invalid_self_closing_tag -->
          <button
            type="button"
            class={getCellClassName(cell)}
            on:click={() => onCellClick(rowIndex, colIndex)}
            aria-label={`Place at row ${rowIndex + 1}, column ${colIndex + 1}`}
          />
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
    display: contents; /* 讓 grid 直接作用在子元素（每個 cell） */
  }
  .cell {
    width: 50px;
    height: 50px;
    background-color: green;
    border: 1px solid #000;
    box-sizing: border-box;
    cursor: pointer;
    appearance: none;
  }
  .cell.black { background-color: black; }
  .cell.white { background-color: white; }
</style>


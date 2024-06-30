<script>
  import { onMount } from 'svelte';
  import { Piece, Player, PieceCounts, IOthelloRule } from './othello_core';
  import { OthelloError, OthelloGame, IOthelloAction } from './othello_framework';

  let game, gameRules, gameAction;
  let board = [];
  let counts = {};
  let selectedType = '';
  let customPlacement = false;
  let selectedPiece = Piece.BLACK;

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
  });

  const onCellClick = (row, col) => {
    gameAction.putPiece(row, col);
  };

  const onReset = () => {
    gameAction.resetGame();
  };

  const onOthelloTypeChange = (event) => {
    const selectedDescription = event.target.value;
    const selectedType = gameRules.values().find(
      (type) => type.descript === selectedDescription
    ) || gameRules.getDefaultCustomType();

    selectedType = selectedType.descript;
    gameAction.setType(selectedType);
  };

  const onCustomSizeChange = (event) => {
    const size = parseInt(event.target.value, 10);
    gameAction.setType(gameRules.createCustomOthelloType(size));
  };

  const getBoardSizeDescription = (gameAction) => {
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
</script>

<div>
  <div class="controls">
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
        value={gameAction.information.getType().cols}
        on:input={onCustomSizeChange}
        min={gameRules.minSize}
        placeholder="Board Size"
      />
    {/if}
  </div>
  <div class="

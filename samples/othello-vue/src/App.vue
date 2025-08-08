<template>
  <div>
    <div class="controls">
      <select v-model="selectedType" @change="onOthelloTypeChange">
        <option v-for="type in gameRules.values()" :key="type.descript" :value="type.descript">
          {{ type.descript }}
        </option>
      </select>
      <input
        v-if="selectedType === gameRules.getDefaultCustomType().descript"
        type="number"
        :value="gameAction.information.getType().cols"
        @input="onCustomSizeChange"
        :min="gameRules.minSize"
        placeholder="Board Size"
      />
    </div>
    <div class="board-description">
      <p>Board Size: {{ getBoardSizeDescription(gameAction) }}</p>
      <label>
        Simulation Placement:
        <input type="checkbox" v-model="customPlacement" @change="onCustomPlacementChange" />
      </label>
      <select v-if="customPlacement" v-model="selectedPiece" @change="onPieceSelectionChange">
        <option value="black">Black</option>
        <option value="white">White</option>
      </select>
    </div>
    <div class="board" :style="gridTemplateStyle">
      <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
        <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          :class="getCellClassName(cell)"
          @click="onCellClick(rowIndex, colIndex)"
        ></div>
      </div>
    </div>
    <div class="info">
      <p>Current Player: {{ currentPlayerEmoji }}</p>
      <p>Black: {{ counts.black }}</p>
      <p>White: {{ counts.white }}</p>
    </div>
    <button @click="onReset">Reset</button>
  </div>
</template>
<script>
import { Piece, Player } from 'othello-model/lib/othello_core';
import { OthelloError, OthelloGameTotalEvent } from 'othello-model/lib/othello_framework';

export default {
  data() {
    const onError = (error) => { alert(`Error: ${OthelloError[error]}`); };
    const onGameOver = (winner) => {
      if (winner == null) { alert("Game Over! Both sides draw"); return; }
      const winner_str = winner === Player.BLACK_PLAYER ? "Black" : "White";
      alert(`Game Over! Winner: ${winner_str}`);
    };
    const onBoardChange = (boardData) => {
      this.board = [...boardData.board];
      this.counts = boardData.counts;
    };
    const onRestarted = () => { this.customPlacement = false; };

    const game = new OthelloGameTotalEvent(onRestarted, onError, onGameOver, onBoardChange);
    const gameRules = game.rules;
    const gameAction = game.action;

    return {
      game,
      gameRules,
      gameAction,
      board: gameAction.information.getBoard(),
      counts: gameAction.information.getPieceCounts(),
      selectedType: gameAction.information.getType().descript,
      customPlacement: false,
      selectedPiece: Piece.BLACK,
    };
  },
  computed: {
    gridTemplateStyle() {
      const cols = this.board?.[0]?.length || 0;
      return {
        gridTemplateRows: `repeat(${this.board.length}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
      };
    },
    // 👇 用這個給模板顯示 emoji
    currentPlayerEmoji() {
      const cur = this.gameAction?.information?.getCurrentPlayer?.();
      if (cur === Player.BLACK_PLAYER) return '⚫ Black';
      if (cur === Player.WHITE_PLAYER) return '⚪ White';
      return ''; // 初始/異常時不顯示
    },
  },
  methods: {
    onCellClick(row, col) { this.gameAction.putPiece({ row, col }); },
    onReset() { this.gameAction.resetGame(); },
    onOthelloTypeChange(event) {
      const selectedDescription = event.target.value;
      const selectedType =
        this.gameRules.values().find((t) => t.descript === selectedDescription)
        || this.gameRules.getDefaultCustomType();
      this.selectedType = selectedType.descript;
      this.gameAction.setType(selectedType);
    },
    onCustomSizeChange(event) {
      const size = parseInt(event.target.value, 10);
      this.gameAction.setType(this.gameRules.createCustomOthelloType(size));
    },
    getBoardSizeDescription(gameAction) {
      const type = gameAction.information.getType();
      return `${type.rows} x ${type.cols}`;
    },
    getCellClassName(cell) {
      return `cell ${cell === Piece.BLACK ? 'black' : cell === Piece.WHITE ? 'white' : ''}`;
    },
    onCustomPlacementChange(event) {
      const isSelected = event.target.checked;
      this.customPlacement = isSelected;
      this.gameAction.customerBoard.setCustomBoard(isSelected);
    },
    onPieceSelectionChange(event) {
      this.selectedPiece = event.target.value === 'black' ? Piece.BLACK : Piece.WHITE;
      const player = event.target.value === 'black' ? Player.BLACK_PLAYER : Player.WHITE_PLAYER;
      this.gameAction.customerBoard.setCurrentPlayer(player);
    },
  },
};
</script>


<style scoped>
.board {
  display: grid;
  border: 1px solid black;
  width: 400px; 
  height: 400px;
}

.row {
  display: contents;
}

.cell {
  background-color: green;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
}

.black {
  background-color: black;
}

.white {
  background-color: white;
}
</style>



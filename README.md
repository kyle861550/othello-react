# About this project

This project includes the Othello game package, which provides the Othello game core and framework to help you quickly establish and deploy the Othello game.

## Othello game features

- Configurable board size (6x6, 8x8, 12x12 or custom size)
- Gameplay functionality
- Display current counts of black and white pieces
- Determine and display game end and winner
- Reset game functionality
- Simulated chess game


## Create the sample env of Othello development

Fellowing the step to ihelp you establish the Otello game in your package.

1. Clone this project.

2. Build the `othello-model` project.

    ```shell=
    cd othello-model

    npm install

    npm run build
    ```

3. Install the `othello-model` package locally in each sample project.

    * Add the local model path in your project's `package.json` file

        ```json=
        <!-- package.json -->

        {
            "dependencies": {
                "othello-model": "file:../../othello-model"
            }
        }
        ```
    
    * Install local package of `othello-model` in sample project.

        ```shell=
        <!-- cd <sample project path> -->

        npm install

        npm run build
        ```

### Sample Project URLs

* There has the deploying, you can access the different sample projects at the following URLs:

    * [React project sample](https://kyle861550.github.io/othello-react/type/react)

    * [Vue project sample](https://kyle861550.github.io/othello-react/type/vue)

    * [Svelte project sample](https://kyle861550.github.io/othello-react/type/svelte)


## Usage of othello-model Framework

This section demonstrates how to use the othello-model framework with both Object-Oriented and Functional approaches.

### Object-Oriented Approach

* First, implement the IOthelloCallback interface and use the OthelloGame class to create a new game.

    ```typescript=
    import { Piece, Player, PieceCounts, IOthelloRule, OthelloError, OthelloGame } from 'othello-model/lib/othello_framework';

    class MyOthelloGame extends OthelloGame {
        constructor() {
            super(
                () => this.onRestarted(),
                (error) => this.onError(error),
                (winner) => this.onGameOver(winner),
                (counts, board) => this.onBoardChange(counts, board)
            );
        }

        onError(error: OthelloError): void {
            console.error(`Error: ${OthelloError[error]}`);
        }

        onRestarted(): void {
            console.log('Game restarted');
        }

        onGameOver(winner: Player | null): void {
            if (winner == null) {
                console.log("Game Over! Both sides draw");
            } else {
                const winnerStr = winner === Player.BLACK_PLAYER ? "Black" : "White";
                console.log(`Game Over! Winner: ${winnerStr}`);
            }
        }

        onBoardChange(counts: PieceCounts, board: (Piece | null)[][]): void {
            console.log('Board updated', counts, board);
        }
    }

    const game = new MyOthelloGame();
    game.action.resetGame();
    game.action.putPiece(3, 3);
    ```

### Functional Approach

* You can use a functional approach to create and manipulate the Othello game.

    ```typescript=
    import { createOthelloGame } from 'othello-model/lib/othello_functional';
    import { Piece, Player, PieceCounts, IOthelloType, OthelloError } from 'othello-model/lib/othello_core';

    const onRestarted = () => {
        console.log('Game restarted');
    };

    const onError = (error: OthelloError) => {
        console.error(`Error: ${OthelloError[error]}`);
    };

    const onGameOver = (winner: Player | null) => {
        if (winner == null) {
            console.log("Game Over! Both sides draw");
        } else {
            const winnerStr = winner === Player.BLACK_PLAYER ? "Black" : "White";
            console.log(`Game Over! Winner: ${winnerStr}`);
        }
    };

    const onBoardChange = (counts: PieceCounts, board: (Piece | null)[][]) => {
        console.log('Board updated', counts, board);
    };

    const game = createOthelloGame(onRestarted, onError, onGameOver, onBoardChange);

    game.resetGame();
    game.putPiece(3, 3);
    ```

## Future Improvements

- Enhance UI/UX
- Improve performance for larger boards

## Known Issues

- Corrected the mechanism for switching opponents when it is judged that the current chess game cannot be played.
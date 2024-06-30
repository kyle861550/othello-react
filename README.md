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


## Future Improvements

- Enhance UI/UX
- Improve performance for larger boards

## Known Issues

- Corrected the mechanism for switching opponents when it is judged that the current chess game cannot be played.
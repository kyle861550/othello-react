import { BoardResult } from './othello_env';
import { IOthelloType, Piece } from './othello_rules';
import { IPieceCounts, Player } from './othello_rules';
export declare function getOthelloFacade(): IOthelloFacade;
export interface IOthelloCustomer {
    setType(type: IOthelloType): void;
    setCustomBoard(enable: boolean): void;
    setCurrentPlayer(player: Player): void;
}
export interface IBoardData {
    counts: IPieceCounts;
    board: (Piece | null)[][];
}
export interface IGameData {
    get type(): IOthelloType;
    get currentPlayer(): Player;
}
export interface IOthelloFacade extends IOthelloCustomer {
    getStatus(): IGameData;
    getBoardData(): IBoardData;
    putPiece(params: {
        row: number;
        col: number;
    }): BoardResult;
    isGameOver(): boolean;
    resetGame(): void;
}

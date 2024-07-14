import { BoardResult } from './othello_env';
import { IOthelloType, Piece } from './othello_rules';
import { PieceCounts, Player } from './othello_rules';
export declare function getOthelloFacade(): IOthelloFacade;
export interface IOthelloCustomer {
    setType(type: IOthelloType): void;
    setCustomBoard(enable: boolean): void;
    setCurrentPlayer(player: Player): void;
}
export interface IOthelloFacade extends IOthelloCustomer {
    getCurrentPlayer(): Player;
    getType(): IOthelloType;
    getBoard(): (Piece | null)[][];
    putPiece(row: number, col: number): BoardResult;
    isGameOver(): boolean;
    resetGame(): void;
    getPieceCounts(): PieceCounts;
}

import { BoardResult } from './othello_env';
import { IOthelloType, Piece } from './othello_rules';
import { PieceCounts, Player } from './othello_rules';
export declare function getOthelloFacade(): IOthelloFacade;
export interface IOthelloCustomer {
    setCustomBoard(enable: boolean): void;
    setCurrentPlayer(player: Player): void;
}
export interface IOthelloFacade extends IOthelloCustomer {
    getCurrentPlayer(): Player;
    getType(): IOthelloType;
    setType(type: IOthelloType): void;
    getBoard(): (Piece | null)[][];
    putPiece(row: number, col: number): BoardResult;
    isGameOver(): boolean;
    resetGame(): void;
    getPieceCounts(): PieceCounts;
}

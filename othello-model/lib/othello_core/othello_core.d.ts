import { Player, Piece } from './othello_rules';
export declare function getOthelloCore(rows: number, cols: number): IOthelloCore;
export declare enum BoardResult {
    EXCHANGE_PLAYER = 0,
    CANNOT_PUT = 1,
    PUTABLE = 2
}
export interface IOthelloCore {
    playerMoveableCounts(player: Player, board: (Piece | null)[][]): number;
    putPiece(player: Player, row: number, col: number, board: (Piece | null)[][]): boolean;
}

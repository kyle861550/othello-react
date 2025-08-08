export declare enum Player {
    BLACK_PLAYER = "black_player",
    WHITE_PLAYER = "white_player"
}
export declare enum Piece {
    BLACK = 0,
    WHITE = 1
}
export interface IPieceCounts {
    black: number;
    white: number;
}
export interface IOthelloType {
    rows: number;
    cols: number;
    descript: string;
}
export interface IOthelloRule {
    readonly minSize: number;
    isIllegalSize(size: number): boolean;
    values(): IOthelloType[];
    getDefaultCustomType(): IOthelloType;
    createCustomOthelloType(size: number): IOthelloType;
}
export declare class OthelloType implements IOthelloType {
    static SmallBoard: OthelloType;
    static Classic: OthelloType;
    static LargeBoard: OthelloType;
    static Custom: OthelloType;
    rows: number;
    cols: number;
    descript: string;
    constructor(len: number, descript: string);
}
export declare class DefaultOthelloRule implements IOthelloRule {
    minSize: number;
    isIllegalSize(size: number): boolean;
    values(): IOthelloType[];
    getDefaultCustomType(): IOthelloType;
    createCustomOthelloType(size: number): IOthelloType;
}

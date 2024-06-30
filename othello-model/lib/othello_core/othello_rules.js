"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultOthelloRule = exports.OthelloType = exports.PieceCounts = exports.Piece = exports.Player = void 0;
var Player;
(function (Player) {
    Player["BLACK_PLAYER"] = "black_player";
    Player["WHITE_PLAYER"] = "white_player";
})(Player || (exports.Player = Player = {}));
var Piece;
(function (Piece) {
    Piece[Piece["BLACK"] = 0] = "BLACK";
    Piece[Piece["WHITE"] = 1] = "WHITE";
})(Piece || (exports.Piece = Piece = {}));
class PieceCounts {
    constructor(black, white) {
        this.black = black;
        this.white = white;
    }
}
exports.PieceCounts = PieceCounts;
class OthelloType {
    constructor(len, descript) {
        this.rows = len;
        this.cols = len;
        this.descript = descript;
    }
}
exports.OthelloType = OthelloType;
OthelloType.SmallBoard = new OthelloType(6, "Small Board");
OthelloType.Classic = new OthelloType(8, "Classic");
OthelloType.LargeBoard = new OthelloType(12, "Large Board");
OthelloType.Custom = new OthelloType(4, 'Custom');
class DefaultOthelloRule {
    constructor() {
        this.minSize = 2;
    }
    isIllegalSize(size) {
        return isNaN(size) || size % 2 !== 0 || size <= this.minSize;
    }
    values() {
        return [
            OthelloType.Classic,
            OthelloType.LargeBoard,
            OthelloType.SmallBoard,
            OthelloType.Custom,
        ];
    }
    getDefaultCustomType() {
        return OthelloType.Custom;
    }
    createCustomOthelloType(size) {
        return new OthelloType(size, OthelloType.Custom.descript);
    }
}
exports.DefaultOthelloRule = DefaultOthelloRule;

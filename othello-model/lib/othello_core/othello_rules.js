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
var PieceCounts = /** @class */ (function () {
    function PieceCounts(black, white) {
        this.black = black;
        this.white = white;
    }
    return PieceCounts;
}());
exports.PieceCounts = PieceCounts;
var OthelloType = /** @class */ (function () {
    function OthelloType(len, descript) {
        this.rows = len;
        this.cols = len;
        this.descript = descript;
    }
    OthelloType.SmallBoard = new OthelloType(6, "Small Board");
    OthelloType.Classic = new OthelloType(8, "Classic");
    OthelloType.LargeBoard = new OthelloType(12, "Large Board");
    OthelloType.Custom = new OthelloType(4, 'Custom');
    return OthelloType;
}());
exports.OthelloType = OthelloType;
var DefaultOthelloRule = /** @class */ (function () {
    function DefaultOthelloRule() {
        this.minSize = 2;
    }
    DefaultOthelloRule.prototype.isIllegalSize = function (size) {
        return isNaN(size) || size % 2 !== 0 || size <= this.minSize;
    };
    DefaultOthelloRule.prototype.values = function () {
        return [
            OthelloType.Classic,
            OthelloType.LargeBoard,
            OthelloType.SmallBoard,
            OthelloType.Custom,
        ];
    };
    DefaultOthelloRule.prototype.getDefaultCustomType = function () {
        return OthelloType.Custom;
    };
    DefaultOthelloRule.prototype.createCustomOthelloType = function (size) {
        return new OthelloType(size, OthelloType.Custom.descript);
    };
    return DefaultOthelloRule;
}());
exports.DefaultOthelloRule = DefaultOthelloRule;

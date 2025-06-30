//לתקן את הפיצוץ בהתחלה של התוכנית
//work on making it look smoother
//ח
//סט באונדס לא עובד כי הוא נקרא מתוך פיס אבל הוא רק מוגדר בתוך לדוגמא חייל רגיל כלומר אנחנו מנסים לרשת תכונות מהקלאס היורש
///לתקן: לא נשלח בקריאה לקונטרסקטור של פיס הערך לוק
class TempPiece {
    static all = []
    constructor(x, y, color, name, firstValue, table, include = true) {
        this.color = color;
        this.table = table;
        this.x = x;
        this.name = name;
        this.y = y;
        this.value = firstValue
        this.currentMoves = undefined
        this.currentAttacks = undefined
        if (include) {
            TempPiece.all.push(this)
        }
    }

    attacks(grid) {
        let arr = [];
        return arr;
    }

    moves() {
        return [];
    }

    checkbounds(x, y) {
        return !(x < 0 || y < 0 || y > 7 || x > 7);
    }

    move(x, y, grid) {
        if (this.moves(grid).some(pos => pos[0] === x && pos[1] === y)) {
            grid[this.x][this.y] = null;
            if (grid[x][y] === wk || grid[x][y] === bk) {
                ld();
            }
            this.trueMove(x, y, grid)
            return true;
        }
        if (x === this.x && y === this.y) {
            this.currentAttacks = undefined
            this.currentMoves = undefined
        }
        return false;
    }

    trueMove(x, y, grid) {
        grid[this.x][this.y] = null;
        grid[x][y] = this;
        this.x = x;
        this.y = y;
        this.currentAttacks = undefined
        this.currentMoves = undefined
        return
    }

    updateRest(orginalX, originalY) {
        console.log(this);
        TempPiece.all.forEach(element => {
            const distX = abs(element.x - this.x)
            const distY = abs(element.y - this.y)
            if ((distX || distY) == 0 || distX == distY || (abs(distX - distY) == 1 && distX + distY == 3)) {
                element.currentAttacks = undefined
                element.currentMoves = undefined
            }
            const distXO = abs(element.x - orginalX)
            const distYO = abs(element.y - originalY)
            if ((distXO || distYO) == 0 || distXO == distYO || (abs(distXO - distYO) == 1 && distXO + distYO == 3)) {
                element.currentAttacks = undefined
                element.currentMoves = undefined
            }
        })
    }

    static resetMoves() {
        TempPiece.all.forEach(element => {
            element.currentAttacks = undefined
            element.currentMoves = undefined
        })
    }

    static resetAll() {
        TempPiece.all = []
    }

}

class TempPawn extends TempPiece {

    constructor(x, y, color, inc) {
        super(x, y, color, "Pawn", 100, pawnTable, inc);
    }

    moves(grid) {
        if (!this.currentMoves) {
            this.resetMoves(grid)
        }
        this.attacks(grid)
        return this.currentAttacks.concat(this.currentMoves);
    }

    resetMoves(grid) {
        let moves = []
        if (this.color === 'black') {
            if (this.checkbounds(this.x, this.y - 1) && grid[this.x][this.y - 1] === null) {
                moves.push([this.x, this.y - 1]);
            }
            if (this.y === 6 && grid[this.x][this.y - 2] === null) {
                moves.push([this.x, this.y - 2]);
            }
        }
        if (this.color === 'white') {
            if (this.checkbounds(this.x, this.y + 1) && grid[this.x][this.y + 1] === null) {
                moves.push([this.x, this.y + 1]);
            }
            if (this.y === 1 && grid[this.x][this.y + 2] === null) {
                moves.push([this.x, this.y + 2]);
            }
        }
        this.currentMoves = moves
    }

    attacks(grid) {
        if (!this.currentAttacks) {
            this.resetAttack(grid)
        }
        return this.currentAttacks;
    }

    resetAttack(grid) {
        let result = [];
        let dx = [1, -1];
        let dy = this.color === 'white' ? 1 : -1;
        for (let d of dx) {
            let nx = this.x + d;
            let ny = this.y + dy;
            if (this.checkbounds(nx, ny) && grid[nx][ny] != null && grid[nx][ny].color !== this.color) {
                result.push([nx, ny]);
            }
        }
        result.sort((a, b) => (grid[b[0]][b[1]].value - grid[a[0]][a[1]].value))
        this.currentAttacks = result
    }
}

class TempBishop extends TempPiece {//no check checking yet

    constructor(x, y, color, inc) {
        super(x, y, color, "Bishop", 320, bishopTable, inc);
    }
    getTable(state) {
        return this.table
    }
    moves(grid) {
        if (!(this.currentMoves && this.currentAttacks)) {
            this.resetMoves(grid)
        }
        return this.currentAttacks.concat(this.currentMoves)
    }

    moves2(x, y, grid, arr, dir, captured) {
        if (this.checkbounds(x, y) == false || (grid[x][y] != null && grid[x][y].color == this.color)) {
            return null
        }
        if (grid[x][y] != null && grid[x][y].color != this.color) {
            captured.push([x, y])
            return null
        }
        arr.push([x, y])
        if (dir == 'ur') {
            this.moves2(x + 1, y + 1, grid, arr, dir, captured)
        }
        if (dir == 'ul') {
            this.moves2(x - 1, y + 1, grid, arr, dir, captured)
        }
        if (dir == 'ld') {
            this.moves2(x - 1, y - 1, grid, arr, dir, captured)
        }
        if (dir == 'rd') {
            this.moves2(x + 1, y - 1, grid, arr, dir, captured)
        }
    }

    resetMoves(grid) {
        let arr = []
        let captured = []
        this.moves2(this.x + 1, this.y + 1, grid, arr, 'ur', captured)
        this.moves2(this.x - 1, this.y + 1, grid, arr, 'ul', captured)
        this.moves2(this.x - 1, this.y - 1, grid, arr, 'ld', captured)
        this.moves2(this.x + 1, this.y - 1, grid, arr, 'rd', captured)
        this.currentMoves = arr
        this.currentAttacks = captured.sort((a, b) => (grid[b[0]][b[1]].value - grid[a[0]][a[1]].value))
    }


    attacks(grid) {
        if (!this.currentAttacks) {
            this.resetMoves(grid)
        }
        return this.currentAttacks
    }

}

class TempRook extends TempPiece {

    constructor(x, y, color, inc) {
        super(x, y, color, "Rook", 500, rookTable, inc)
    }
    getTable(state) {
        return this.table
    }
    moves(grid) {
        if (!(this.currentMoves && this.currentAttacks)) {
            this.resetMoves(grid)
        }
        return this.currentAttacks.concat(this.currentMoves)
    }

    horizontal(posX, posY, direction, grid, captured) {
        if (!this.checkbounds(posX, posY)) {
            return [];
        }
        if (grid[posX][posY] != null) {

            if (grid[posX][posY].color === this.color) {
                return [];
            }


            captured.push([posX, posY])
            return [];
        }
        let temp = [[posX, posY]];
        return temp.concat(this.horizontal(posX + direction, posY, direction, grid, captured))
    }

    vertical(posX, posY, direction, grid, captured) {
        if (!this.checkbounds(posX, posY)) {
            return []
        }

        if (grid[posX][posY] != null) {
            if (grid[posX][posY].color === this.color) {
                return []
            }
            captured.push([posX, posY])
            return []
        }

        let temp = [[posX, posY]]
        return temp.concat(this.vertical(posX, posY + direction, direction, grid, captured));
    }

    resetMoves(grid) {
        let total = []
        let captured = []
        total = total.concat(this.horizontal(this.x + 1, this.y, 1, grid, captured))
        total = total.concat(this.horizontal(this.x - 1, this.y, -1, grid, captured))
        total = total.concat(this.vertical(this.x, this.y + 1, 1, grid, captured))
        total = total.concat(this.vertical(this.x, this.y - 1, -1, grid, captured))
        this.currentMoves = total
        this.currentAttacks = captured.sort((a, b) => (grid[b[0]][b[1]].value - grid[a[0]][a[1]].value))
    }

    attacks(grid) {
        if (!this.currentAttacks) {
            this.resetMoves(grid)
        }
        return this.currentAttacks
    }

}

class TempKnight extends TempPiece {

    constructor(x, y, color, inc) {
        super(x, y, color, "Knight", 320, knightTable, inc)
    }

    getTable(state) {
        return this.table
    }
    
    moves(grid) {
        if (!(this.currentMoves && this.currentAttacks)) {
            this.resetMoves(grid)
        }
        return this.currentAttacks.concat(this.currentMoves)
    }

    attacks(grid) {
        if (!this.currentAttacks) {
            this.resetMoves(grid)
        }
        return this.currentAttacks
    }

    resetMoves(grid) {
        let total = []
        let captured = []
        for (let i = -1; i < 2; i += 2) {
            for (let h = -1; h < 2; h += 2) {
                if (this.checkbounds(this.x + 2 * i, this.y + h)) {
                    if (grid[this.x + 2 * i][this.y + h] == null) {
                        total.push([this.x + 2 * i, this.y + h])
                    }
                    else {
                        if (grid[this.x + 2 * i][this.y + h].color != this.color) {
                            captured.push([this.x + 2 * i, this.y + h])
                        }
                    }
                }
            }
        }
        for (let i = -1; i < 2; i += 2) {
            for (let h = -1; h < 2; h += 2) {
                if (this.checkbounds(this.x + i, this.y + 2 * h)) {
                    if (grid[this.x + i][this.y + 2 * h] == null) {
                        total.push([this.x + i, this.y + 2 * h])
                    } else {
                        if (grid[this.x + i][this.y + 2 * h].color != this.color) {
                            captured.push([this.x + i, this.y + 2 * h])
                        }
                    }
                }
            }
        }
        this.currentMoves = total
        this.currentAttacks = captured.sort((a, b) => (grid[b[0]][b[1]].value - grid[a[0]][a[1]].value))
    }

}

class TempQueen extends TempPiece {

    constructor(x, y, color, inc) {
        super(x, y, color, "Queen", 900, queenTable, inc)
    }
    getTable(state) {
        return this.table
    }
    moves(grid) {
        if (!(this.currentMoves && this.currentAttacks)) {
            this.resetMoves(grid)
        }
        return this.currentAttacks.concat(this.currentMoves)
    }

    attacks(grid) {
        if (!this.currentAttacks) {
            this.resetMoves(grid)
        }
        return this.currentAttacks
    }

    horizontal(posX, posY, direction, grid, captured) {
        if (!this.checkbounds(posX, posY)) {
            return [];
        }
        if (grid[posX][posY] != null) {

            if (grid[posX][posY].color === this.color) {
                return [];
            }


            captured.push([posX, posY])
            return [];
        }
        let temp = [[posX, posY]];
        return temp.concat(this.horizontal(posX + direction, posY, direction, grid, captured))
    }

    vertical(posX, posY, direction, grid, captured) {
        if (!this.checkbounds(posX, posY)) {
            return []
        }

        if (grid[posX][posY] != null) {
            if (grid[posX][posY].color === this.color) {
                return []
            }
            captured.push([posX, posY])
            return []
        }

        let temp = [[posX, posY]]
        return temp.concat(this.vertical(posX, posY + direction, direction, grid, captured));
    }

    moves2(x, y, grid, arr, dir, captured) {
        if (this.checkbounds(x, y) == false || (grid[x][y] != null && grid[x][y].color == this.color)) {
            return null
        }
        if (grid[x][y] != null && grid[x][y].color != this.color) {
            captured.push([x, y])
            return null
        }
        arr.push([x, y])
        if (dir == 'ur') {
            this.moves2(x + 1, y + 1, grid, arr, dir, captured)
        }
        if (dir == 'ul') {
            this.moves2(x - 1, y + 1, grid, arr, dir, captured)
        }
        if (dir == 'ld') {
            this.moves2(x - 1, y - 1, grid, arr, dir, captured)
        }
        if (dir == 'rd') {
            this.moves2(x + 1, y - 1, grid, arr, dir, captured)
        }
    }

    resetMoves(grid) {
        let total = []
        let captured = []
        total = total.concat(this.horizontal(this.x + 1, this.y, 1, grid, captured))
        total = total.concat(this.horizontal(this.x - 1, this.y, -1, grid, captured))
        total = total.concat(this.vertical(this.x, this.y + 1, 1, grid, captured))
        total = total.concat(this.vertical(this.x, this.y - 1, -1, grid, captured))
        this.moves2(this.x + 1, this.y + 1, grid, total, 'ur', captured)
        this.moves2(this.x - 1, this.y + 1, grid, total, 'ul', captured)
        this.moves2(this.x - 1, this.y - 1, grid, total, 'ld', captured)
        this.moves2(this.x + 1, this.y - 1, grid, total, 'rd', captured)
        this.currentMoves = total
        this.currentAttacks = captured.sort((a, b) => (grid[b[0]][b[1]].value - grid[a[0]][a[1]].value))
    }
}

class TempKing extends TempPiece {

    constructor(x, y, color, inc) {
        super(x, y, color, "King", 10000, inc)
    }

    getTable(state) {
        return (state == "mid" ? kingMiddleGameTable : kingEndGameTable)
    }
    isChecked(grid, x, y) {//checks if the king is checked in specific cordinates
        let arr = [];
        for (let i = 0; i < 8; i++) {
            for (let k = 0; k < 8; k++) {
                if (grid[i][k] != null && grid[i][k].color != this.color && i != this.x && k != this.y) {
                    arr = grid[i][k].attacks(grid);
                    for (let t = 0; t < arr.length; t++) {
                        if (arr[t][0] == x && arr[t][1] == y) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    isMate(grid, x, y) {
        if (this.isChecked && this.moves() == []) {
            return true;
        }
        return false;
    }

    moves(grid) {
        if (!(this.currentMoves && this.currentAttacks)) {
            this.resetMoves(grid)
        }
        return this.currentAttacks.concat(this.currentMoves)
    }

    resetMoves(grid) {
        let arr = []
        let captured = []
        for (let i = -1; i < 2; i++) {
            for (let k = -1; k < 2; k++) {
                if (i === 0 && k === 0) {
                    continue // skip
                }
                let newX = this.x + i;
                let newY = this.y + k;
                if (!this.checkbounds(newX, newY)) {
                    continue //skip
                }
                if (grid[newX][newY] === null || grid[newX][newY].color !== this.color) {
                    if (!this.isChecked(grid, newX, newY)) {
                        if (grid[newX][newY] && grid[newX][newY].color !== this.color) {
                            captured.push([newX, newY])
                        }
                        else {
                            arr.push([newX, newY])
                        }
                    }
                }
            }
        }
        this.currentMoves = arr
        this.currentAttacks = captured.sort((a, b) => (grid[b[0]][b[1]].value - grid[a[0]][a[1]].value))
    }

    attacks(grid) {
        if (!this.currentAttacks) {
            this.currentAttacks = []
            this.resetMoves(grid)
        }
        return this.currentAttacks
    }
}

////////////////////////////////////////////////

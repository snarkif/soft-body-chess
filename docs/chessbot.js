
var tables = new Map()

function checkEndGame(grid){
  let piece;
  let count = 0;
   for (let i = 2; i < grid.length; i++) {
    for (let j = 2; j < grid.length; j++) {
      if (grid[i][j] != null) {
        piece = grid[i][j]
        count +=((piece.name!="Pawn")&&(piece.name!="King")?1:0)
        
      }
    }
    return (count<=2?"end":"mid")
   }
}
// function evaluateCenterControl(grid) {
//   let sum = 0;
//   for (let i = 2; i < 6; i++) {
//     for (let j = 2; j < 6; j++) {
//       if (grid[i][j] != null) {
//         let colour = (grid[i][j].color === "black" ? -1 : 1)
//         sum += (i >= 3 && i <= 4 && j >= 3 && j <= 4 ? 20 : 10) * colour;
//       }
//     }
//   }
//   return sum;
// }

function evaluatePawnStructure(grid) {
  let sum = 0;

  for (let file = 0; file < 8; file++) {
    let countWp = 0;
    let countBp = 0;

    for (let rank = 0; rank < 8; rank++) {
      const piece = grid[rank][file];
      if (piece != null && piece.name === "Pawn") {
        if (piece.color === "white") {
          countWp++
        } else {
          if (piece.color === "black") {
            countBp++
          }
        }
      }
    }

    if (countWp >= 2) {
      sum -= 20
    }
    if (countBp >= 2) {
      sum += 20
    }
  }

  return sum;
}

function evaluateTempo(grid) {
  let sum = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let k = 0; k < grid.length; k++) {
      const piece = grid[i][k];
      if (piece != null) {
        const moves = piece.moves(grid);

        for (let j = 0; j < moves.length; j++) {
          const [x, y] = moves[j];
          const target = grid[x][y];

          if (target != null && target.color !== piece.color) {
            const colour = (target.color === "black" ? -1 : 1)
            switch (target.name) {
              case "Pawn":
                sum += 5 * colour;
                break;
              case "Knight":
              case "Bishop":
                sum += 16 * colour;
                break;
              case "Rook":
                sum += 25 * colour;
                break;
              case "Queen":
                sum += 40 * colour;
                break;
              case "King":
                sum += 100* colour; // Avoid Infinity
                break;
            }
          }
        }
      }
    }
  }

  return sum;
}

function evaluatePositionBonus(grid) {
  let sum = 0;
  let piece;
  let val;
  let state
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid.length; y++) {
      piece = grid[x][y];
      if (piece != null) {
        if(piece.name!=="King"){
        val = (piece.color === "black" ? piece.table[x][y] * -1 : piece.table[x][7 - y]);
        sum += val
        }
        else{
          state = checkEndGame(grid)
          val = (piece.color === "black" ? piece.getTable(state)[x][y] * -1 : piece.getTable(state)[x][7-y]);
        }
      }
    }
  }
  return sum;
}

function evaluateMaterial(grid) {
  
  let sum = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      const piece = grid[i][j];
      if (piece != null) {
        
        const colour = (piece.color === "black" ? -1 : 1)
        sum += piece.value * colour
      }
    }
  }

  return sum;
}

function evaluateMoves(grid) {
  let sum = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      const piece = grid[i][j];
      if (piece != null) {
        const colour = (piece.color === "black" ? -1 : 1);
        sum += piece.moves(grid).length * colour ;
      }
    }
  }

  return sum;
}

function evaluate(grid) {
  let score = 0
  score += evaluateMaterial(grid)
  score += evaluateMoves(grid)
  score += evaluateTempo(grid)*0.1
  score += evaluatePawnStructure(grid)
  
  score += evaluatePositionBonus(grid)
  TempPiece.resetMoves()
  return score;
}

function calc(board = copyBoard(grid), currentTurn = turn, depth = 5, alpha = -Infinity, beta = Infinity) {
  if (depth <= 0) {
    return [evaluate(board), [[0, 0], [0, 0]]]
  }
  const currentBoard = miniBoard(board, currentTurn)
  if (tables.has(currentBoard)) {
    return tables.get(currentBoard)
  }
  const isWhite = (currentTurn === 'white')
  let bestScore = isWhite ? -Infinity : Infinity
  let bestMove = undefined;
  const opponent = (isWhite ? 'black' : 'white')
  outer: for (let piece of TempPiece.all) {
    if (piece.color === currentTurn) {
      const moves = piece.moves(board)
      const original = { x: piece.x, y: piece.y }
      for (let move of moves) {
        const [targetRow, targetCol] = move
        let captured = null
        if (board[targetRow][targetCol] != null) {
          captured = board[targetRow][targetCol]
        }
        piece.trueMove(targetRow, targetCol, board)
        let score;
        if (captured && captured.name == "King") {
          score = evaluate(board)
        } else {
          score = calc(board, opponent, depth - 1, alpha, beta)[0]
        }
        if (!bestMove || (isWhite && score > bestScore) || (!isWhite && score < bestScore)) {
          bestScore = score
          bestMove = [[original.x, original.y], move]
          //pruning
          if (isWhite) {
            alpha = max(alpha, bestScore)
          }
          else {
            beta = min(beta, bestScore)
          }
        }
        piece.trueMove(original.x, original.y, board);
        if (captured !== null) {
          board[captured.x][captured.y] = captured;
        }
        if (beta < alpha) {
          break outer;
        }
      }
    }
  }
  tables.set(currentBoard, [bestScore, bestMove])
  return [bestScore, bestMove]
}

function miniBoard(board, currentTurn) {
  const ctrans = { 'white': 'w', 'black': 'b' }
  ret = ctrans[currentTurn]
  const trans = { 'wPawn': 'p', 'wKnight': 'n', 'wBishop': 'b', 'wRook': 'r', 'wQueen': 'q', 'wKing': 'k', 'bPawn': 'P', 'bKnight': 'N', 'bBishop': 'B', 'bRook': 'R', 'bQueen': 'Q', 'bKing': 'K' }
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] != null) {
        ret += trans[ctrans[board[i][j].color] + board[i][j].name]
      } else {
        ret += "."
      }
    }
  }
  return ret
}

function test(func, ...arg) {
  let start = performance.now()
  let ret = func(...arg)
  let totalTime = performance.now() - start
  return { time: totalTime, value: ret }
}

function multiTest(rep, func, ...arg) {
  let sum = 0
  for (let i = 0; i < rep; i++) {
    sum += test(func, ...arg).time
  }
  return sum / rep
}

function copyBoard(board) {
  return board.map(x => x.map(element => (element ? (element.copy()) : null)))
}

function runcalc(...arg) {
  let ret = calc(...arg)[1]
  TempPiece.resetAll()
  console.log(ret)
  return { value: ret, str: "" + ret[0] + " -> " + ret[1] + "" }
}

function autoRun(vis = false, debug = false) {
  let val, count = 0, timer = 0, piece
  main: while (f == false) {
    if (timer == 0 || performance.now() - timer >= 3000) {
      val = runcalc()
      console.log(val.str)
      if (!debug) {
        if (!grid[val.value[0][0]][val.value[0][1]].move(val.value[1][0], val.value[1][1], grid)) {
          count++
          grid[val.value[0][0]][val.value[0][1]].currentMoves = undefined
          grid[val.value[0][0]][val.value[0][1]].currentAttacks = undefined
        } else {
          turn = (turn == 'white' ? 'black' : 'white')
          count = 0
        }
        if (count >= 3) {
          return false
        }
      } else {
        grid[val.value[0][0]][val.value[0][1]].trueMove(val.value[1][0], val.value[1][1], grid)
        turn = (turn == 'white' ? 'black' : 'white')
      }
    }
    if (vis) {
      piece = grid[val.value[1][0]][val.value[1][1]]
      if (timer == 0 || (performance.now() - timer) >= 3000) {
        piece.updatePiece()
        timer = performance.now()
      }
    }
  }
  return true
}

function checkEndGame(grid) {
  let piece;
  let count = 0;
  for (let i = 2; i < grid.length; i++) {
    for (let j = 2; j < grid.length; j++) {
      if (grid[i][j] != null) {
        piece = grid[i][j]
        count += ((piece.name != "Pawn") && (piece.name != "King") ? 1 : 0)
      }
    }
  }
  return (count <= 2 ? "end" : "mid")
}

function performBestMove() {
  let val = runcalc()
  console.log(val.str)  
  return performMove(val.value[0][0], val.value[0][1], val.value[1])
}

function performMove(orgX, orgY, move) {
  let piece = grid[orgX][orgY];
  if (piece == null) {
    return false
  }
  if (!piece.move(move[0], move[1], grid)) {
    return false
  } else {
    turn = (turn == 'white' ? 'black' : 'white')
    piece.updatePiece()
    return true
  }
}

function findBestMove(){
  let val = runcalc();
  console.log(val.str) ;
}

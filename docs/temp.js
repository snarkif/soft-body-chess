// Optimized board copy (assumes each row is an array and shallow-copying rows is sufficient)
function copyBoard2(board) {
  return board.map(row => row.slice());
}

function calc2(board, turn, depth = 0, bestWhite = -Infinity, bestBlack = Infinity) {
  // Base case: stop recursion after 3 plies (you can replace 1 with an evaluation function)
  if (depth >= 3) {
    console.log("here", turn);
    // In a real scenario, you might call an evaluation function for the board score.
    return [1, [0, 0]];
  }

  // Initialize best score according to the current turn
  let bestScore = turn === "white" ? bestWhite : bestBlack;
  let bestMove = null;

  // Loop through each piece on the board.
  for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
    const row = board[rowIndex];
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const piece = row[colIndex];
      if (piece && piece.color === turn) {
        // Get the possible moves for the current piece.
        const moves = piece.moves(board);
        for (const move of moves) {
          // Create a fresh board copy before applying the move
          const simulatedBoard = copyBoard2(board);
          // It is important that we obtain the corresponding piece from the simulated board.
          // Assuming the positions of pieces are consistent in the copy,
          // we retrieve it from the same position:
          const simPiece = simulatedBoard[rowIndex][colIndex];
          simPiece.move(move[0], move[1], simulatedBoard);

          // Recurse for the opponent
          const [score] = calc1(simulatedBoard, turn === "white" ? "black" : "white", depth + 1, bestWhite, bestBlack);

          // Update best move based on whether we're maximizing or minimizing.
          if (turn === "black") {
            if (score < bestScore) {
              bestScore = score;
              bestMove = move;
              console.log(piece, move, bestWhite, bestScore);
            }
          } else {
            if (score > bestScore) {
              bestScore = score;
              bestMove = move;
              console.log(piece, move, bestScore, bestBlack);
            }
          }
        }
      }
    }
  }
  return [bestScore, bestMove];
}


////////////////////////////////////////////

function calc3(board, turn, depth = 2) {
  if (depth <= 0) {
    console.log(turn);
    return [evaluate(board) * (turn == 'black' ? -1 : 1), [0, 0]]
  }
  let bestMove = []
  let bestScore = Number.Infinity * (turn == 'white' ? -1 : 1)
  let moves
  let score
  let org
  let eatten = undefined
  for (let i = 0; i < board.length; i++) {
    for (let h = 0; h < board[i].length; h++) {
      if (board[i][h] != null) {
        if (board[i][h].color == turn) {
          moves = board[i][h].moves(board)
          org = board[i][h].copy()
          for (let k = 0; k < moves.length; k++) {
            if (board[moves[k][0]][moves[k][1]] != null) {
              eatten = board[moves[k][0]][moves[k][1]].copy()
            }
            board[i][h].move(moves[k][0], moves[k][1], board, true)
            score = calc3(board, (turn == 'white' ? 'black' : 'white'), depth - 1)[0]
            if (bestMove.length === 0) {
              bestMove = moves[k]
              bestScore = score
            }
            if (abs(score) > abs(bestScore)) {
              bestScore = score
              bestMove = moves[k]
            }
            board[moves[k][0]][moves[k][1]].move(org.x, org.y, board, true)
            if (eatten != undefined) {
              board[eatten.x][eatten.y] = eatten.copy()
              eatten = undefined
            }
          }
        }
      }
    }
  }
  return [bestScore, bestMove]
}

//global
var minWhite, minBlack

function _calc1(board, turn, depth = 1) {
  if (depth <= 0) {
    console.log("here", turn);
    return [(turn == 'black' ? -1 : 1) * evaluate(board), [0, 0]]
  }
  let nextBoard = copyBoard(board)
  let currentScore = (turn == 'white' ? Number.MAX_VALUE : Number.MIN_VALUE)
  let currentMove = []
  let step
  nextBoard.forEach(inner => {
    inner.forEach(element => {
      if (element != null) {
        if (element.color == turn) {
          for (let i = 0; i < element.moves(nextBoard).length; i++) {
            step = element.moves(nextBoard)[i]
            element.move(step[0], step[1], nextBoard)
            //
            let score = _calc1(nextBoard, (turn == 'white' ? 'black' : 'white'), depth - 1)[0]
            if (currentMove = []) {
              currentScore = score
              currentMove = step
              continue
            }
            if (turn == 'black') {
              if (currentScore > score) {
                currentMove = step
                bestScore = score
              }
            }
            else {
              if (currentScore < score) {
                currentScore = score
                bestMove = step
              }
            }
            //
            nextBoard = copyBoard(board)
          }
        }
      }
    })
  });
  return [currentScore, currentMove]
}

function calc0() {
  minWhite = Number.MIN_VALUE
  minBlack = Number.MAX_VALUE
  bestMove = []
  ret = _calc1(grid, turn)
  f = false
  return ret
}

function copyBoard1(arr) {
  let temp = [[], [], [], [], [], [], [], []]
  arr.forEach((subArr, index) => (subArr.forEach(element => temp[index].push(element))))
  return temp
}





function calcP(board, turn, depth = 2, alpha = -Infinity, beta = Infinity) {
  if (depth <= 0) {
    return [evaluate(board), [[0, 0], [0, 0]]];
  }
  const isWhite = (turn === 'white');
  let bestScore = isWhite ? -Infinity : Infinity
  let bestMove = undefined
  const opponent = (isWhite ? 'black' : 'white')
  outer: for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col]
      if (piece && piece.color === turn) {
        const moves = piece.moves(board)
        const original = { x: piece.x, y: piece.y }
        for (let move of moves) {
          const [targetRow, targetCol] = move
          let captured = null
          if (board[targetRow][targetCol] != null) {
            captured = board[targetRow][targetCol]
          }
          piece.move(targetRow, targetCol, board, true);
          const [score] = calcP(board, opponent, depth - 1, alpha, beta)
          if (bestMove === null || (isWhite && score > bestScore) || (!isWhite && score < bestScore)) {
            bestScore = score
            bestMove = [[original.x, original.y], move]
            //pruning
            if (isWhite) {
              alpha = max(alpha, bestScore)
            }
            else {
              beta = max(beta, bestScore)
            }
          }
          board[targetRow][targetCol].move(original.x, original.y, board, true);
          if (captured !== null) {
            board[captured.x][captured.y] = captured
          }
          if (beta < alpha) {
            break outer
          }
        }
      }
    }
  }
  return [bestScore, bestMove];
}

//
function calcOP(board, turn, depth = 2, alpha = -Infinity, beta = Infinity) {
  if (depth <= 0) {
    return [evaluate(board), [[0, 0], [0, 0]]]
  }
  const isWhite = (turn === 'white')
  let bestScore = isWhite ? -Infinity : Infinity
  let bestMove = undefined
  const opponent = (isWhite ? 'black' : 'white')
  outer: for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col]
      if (piece && piece.color === turn) {
        const moves = sortMoves(piece, board)
        const original = { x: piece.x, y: piece.y }
        for (let move of moves) {
          const [targetRow, targetCol] = move
          let captured = null
          if (board[targetRow][targetCol] != null) {
            captured = board[targetRow][targetCol]
          }
          piece.move(targetRow, targetCol, board, true)
          let score
          if (captured && captured.name == "King") {
            score = evaluate(board)
          } else {
            score = calcOP(board, opponent, depth - 1, alpha, beta)[0]
          }
          if (bestMove === null || (isWhite && score > bestScore) || (!isWhite && score < bestScore)) {
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
          board[targetRow][targetCol].move(original.x, original.y, board, true);
          if (captured !== null) {
            board[captured.x][captured.y] = captured
          }
          if (beta < alpha) {
            break outer
          }
        }
      }
    }
  }
  return [bestScore, bestMove]
}
/*
function sortMoves(target, board) {
  target.moves(board)
  try {
    target.currentAttacks.sort((a, b) => (board[b[0]][b[1]].value - board[a[0]][a[1]].value))
  } catch {
    console.error("cannot sort");
  }
  return target.currentAttacks.concat(target.currentMoves)
}
  */

function addMove(x, y, move) {
  grid[x][y].currentMoves = (!grid[x][y].currentMoves ? [] : grid[x][y].currentMoves)
  grid[x][y].currentAttacks = (!grid[x][y].currentAttacks ? [] : grid[x][y].currentAttacks)
  let len = grid[x][y].currentMoves.length
  while (grid[x][y].currentMoves.length === len) {
    grid[x][y].currentMoves.push(move)
    grid[x][y].currentAttacks.push(move)
  }
  return true
}

function rungrid(board) {
  sum = 0
  for (let i = 0; i < board.length; i++) {
    for (let h = 0; h < board[i].length; h++) {
      if (board[i][h]) {
        sum++
      }
    }
  }
  return sum
}

function runall() {
  sum = 0
  for (let element of Piece.all) {
    sum++
  }
  return sum
}

function runall1() {
  sum = 0
  Piece.all.forEach(element => {
    sum++
  })
  return sum
}

function multiRun(vis = false, debug = false) {
  let val, count = 0, timer = 0
  main: while (f == false) {
    val = runcalc()
    console.log(val.str);
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
    if (vis) {
      if (performance.now - timer >= 1000) {

        timer = performance.now
      }
    }
  }
  return true
}

function findProblem(move) {
  const piece = grid[val.value[0][0]][val.value[0][1]]
  console.log(piece.moves(grid))
  console.log(move[1])

}

function cleargrid(...arg) {
  for (let i = 0; i < grid.length; i++) {
    for (let h = 0; h < grid[i].length; h++) {
      loopn: for (let n = 0; n < arg.length; n++) {
        if (i != arg[n][0] && h != arg[n][1]) {
          grid[i][h] = null
        } else {
          break loopn
        }
      }
    }
  }
}

function testcalc(board = copyBoard(grid), currentTurn = turn, depth = 2, alpha = -Infinity, beta = Infinity) {
  if (depth <= 0) {
    return [evaluate(board), [[0, 0], [0, 0]]]
  }
  const isWhite = (currentTurn === 'white')
  let bestScore = isWhite ? -Infinity : Infinity
  let bestMove = undefined
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
        let score
        if (captured && captured.name == "King") {
          score = evaluate(board)
        } else {
          score = testcalc(board, opponent, depth - 1, alpha, beta)[0]
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
          board[captured.x][captured.y] = captured
        }
        if (beta < alpha) {
          break outer
        }
      }
    }
  }
  return [bestScore, bestMove]
}

function calct(board = copyBoard(grid), currentTurn = turn, depth = 6, alpha = -Infinity, beta = Infinity) {
  if (depth <= 0) {
    return [evaluate(board), [[0, 0], [0, 0]]]
  }
  if (tables.has(miniBoard(board))) {
    return tables.get(miniBoard(board))
  }
  const isWhite = (currentTurn === 'white')
  let bestScore = isWhite ? -Infinity : Infinity
  let bestMove = undefined
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
        let score
        if (captured && captured.name == "King") {
          score = evaluate(board)
        } else {
          score = calct(board, opponent, depth - 1, alpha, beta)[0]
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
          board[captured.x][captured.y] = captured
        }
        if (beta < alpha) {
          break outer
        }
      }
    }
  }
  tables.set(miniBoard(board), [bestScore, bestMove])
  return [bestScore, bestMove]
}

function runcalct(...arg) {
  let ret = calct(...arg)[1]
  TempPiece.resetAll()
  console.log(ret)
  return { value: ret, str: "" + ret[0] + " -> " + ret[1] + "" }
}

function evaluate1(grid) {
  let sum = 0
  const state = checkEndGame(grid)
  for (let i = 0; i < grid.length; i++) {
    for (let h = 0; h < grid[i].length; h++) {
      if (grid[i][h] == null) {
        continue
      }
      sum += 1.0 * evaluateMaterial1(grid, i, h)
      sum += 0.3 * evaluateMoves1(grid, i, h)
      sum += 0.2 * evaluateTempo1(grid, i, h)
      sum += 0.3 * evaluateCenterControl1(grid, i, h)
      sum += 1.0 * evaluatePositionBonus1(grid, i, h, state)
    }
  }
  sum += 0.2 * evaluatePawnStructure1(grid)
  TempPiece.resetMoves()
  return sum
}

function evaluateCenterControl1(grid, i, h) {
  if (2 <= i <= 6 && 2 <= h <= 6) {
    return (i >= 3 && i <= 4 && h >= 3 && h <= 4 ? 20 : 10) * (grid[i][h].color === "black" ? -1 : 1)
  }
  return 0
}

function evaluatePawnStructure1(grid) {
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

function evaluateTempo1(grid, i, h) {
  let sum = 0
  const value = { "Pawn": 5, "Knight": 16, "Bishop": 16, "Rook": 25, "Queen": 40, "King": 10000 } // Avoid Infinity
  const piece = grid[i][h]
  const moves = piece.moves(grid)
  for (let j = 0; j < moves.length; j++) {
    const [x, y] = moves[j]
    const target = grid[x][y]
    if (target != null && target.color !== piece.color) {
      const colour = (target.color === "black" ? -1 : 1)
      sum += value[target.name] * colour
    }
  }
  return sum;
}

function evaluatePositionBonus1(grid, i, h, state) {
  const piece = grid[i][h]
  if (piece.name !== "King") {
    return (piece.color === "black" ? piece.table[i][h] * -1 : piece.table[i][7 - h]);
  }
  else {
    return (piece.color === "black" ? piece.getTable(state)[i][h] * -1 : piece.getTable(state)[i][7 - h]);
  }
}

function evaluateMaterial1(grid, i, h) {
  const piece = grid[i][h]
  return piece.value * (piece.color === "black" ? -1 : 1)
}

function evaluateMoves1(grid, i, h) {
  const piece = grid[i][h]
  return piece.moves(grid).length * (piece.color === "black" ? -1 : 1) * 5;
}

function calcbe(board = copyBoard(grid), currentTurn = turn, depth = 7, alpha = -Infinity, beta = Infinity) {
  if (depth <= 0) {
    return [evaluate1(board), [[0, 0], [0, 0]]]
  }
  const currentBoard = miniBoard(board, currentTurn)
  if (tables.has(currentBoard)) {
    return tables.get(currentBoard)
  }
  const isWhite = (currentTurn === 'white')
  let bestScore = isWhite ? -Infinity : Infinity
  let bestMove = undefined
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
        let score
        if (captured && captured.name == "King") {
          score = evaluate1(board)
        } else {
          score = calcbe(board, opponent, depth - 1, alpha, beta)[0]
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
          board[captured.x][captured.y] = captured
        }
        if (beta < alpha) {
          break outer
        }
      }
    }
  }
  tables.set(currentBoard, [bestScore, bestMove])
  return [bestScore, bestMove]
}

function runcalcbe(...arg) {
  let ret = calcbe(...arg)[1]
  TempPiece.resetAll()
  console.log(ret)
  return { value: ret, str: "" + ret[0] + " -> " + ret[1] + "" }
}

//player turn
function playTurn(selectedPiece, turn, grid,wk,bk) {
    //mouse positions
    let mouse = track();
    //if you click on a piece , without a piece in your hand
    if (grid[mouse.x][mouse.y] != null && selectedPiece === null && grid[mouse.x][mouse.y].color === turn) {
        if (mouseIsPressed) {
            //save your pick
            selectedPiece = grid[mouse.x][mouse.y];
            selectedPiece.lock = false;
            
        }
    }
    //if you move
    else if (selectedPiece != null && mouseIsPressed) {
        //return , and choose a diffrent piece
        if (mouse.x === selectedPiece.x && mouse.y === selectedPiece.y) {
            return [turn, null];
        }
        //move your piece to another place
        if (selectedPiece.move(mouse.x, mouse.y, grid)) {
            //switch turn
          if(wk.isChecked(grid,wk.x,wk.y)&&turn =='white'){//the piece was moved but the turn didnt change yet ,so if the white king is checked and the turn is white(black but it havent changed yet) then the game ends
            initgrid();//i could also check for mate instead of just letting it happen and then being mated but thats more work ,and ull have to make the king move...this works so we'll just keep it like this.
            //check for mate(explaination above ^)
            ld();
          }
          
          if(bk.isChecked(grid,bk.x,bk.y)&&turn =='black'){//check for mate
            initgrid();
            ld();
          }
          
            if (turn == 'white') {
                return ['black', null];
            }
            return ['white', null];
        }
    }
    //if nothing
    return [turn, selectedPiece];
}

/////////////////////////////////

function drawPath(selectedPiece, grid) {
    if (selectedPiece != null) {
        let moves = selectedPiece.moves(grid);
        strokeWeight(5);
        noFill();
        stroke(0, 0, 255);
        rect(selectedPiece.x * 100, selectedPiece.y * 100, width / 8, width / 8, 10)
        for (let i = 0; i < moves.length; i++) {
            if (grid[moves[i][0]][moves[i][1]] === null) {
                stroke(255, 165, 93);
            } else {
                stroke(255, 0, 0);
            }
            rect(moves[i][0] * 100, moves[i][1] * 100, width / 8, width / 8, 10);
        }
        stroke(0, 0, 0);
        strokeWeight(1);
    }

}
//pieces that have nowhere to move make the game softlock while selectecd///FIX!!!!!!!


//player turn
let possibleMoves=[],flag=false,flag2=true,flag3=false,current =[];//flag indicates weather the mid turn has begun
function playTurn() {
  if(frameCount>100){
   if(startTurn()){ //if the turn should start return true,else returns false,and removes lock 
    if(midTurn()){
      endTurn();
    }
   }
  }
  
}

function startTurn(){//waiting for click and initalizes the possibleMoves array
    if(flag){
      return true;
    }
    if (postframecount>20){
  if((mouseIsPressed)&&(mouseX>0&&mouseX<width)&&(mouseY>0&&mouseY<height)){
    let t=track();
    selectedPiece=grid[t.x][t.y];
    
    if (
  selectedPiece == null || selectedPiece.color != turn || selectedPiece.moves(grid).length === 0){
      selectedPiece=null;
      return false;
    }
    selectedPiece.body.removelock();//removes bounds and changes lock to false if pressed on a valid piece
    flag=true;
   
    possibleMoves=selectedPiece.moves(grid);
    current.push([selectedPiece.x,selectedPiece.y]);
    possibleMoves.push([selectedPiece.x,selectedPiece.y]);
    
    return true;
}
    }
}

function midTurn(){//gives sign of to call the endTurn function(listens if piece in valid grid position for a move)
 
  drawPath(selectedPiece,grid);
  teleportFirst();
  let move=selectedPiece.body.translatecords();
  if(!move){
    return false;
  }
    
   if ((!mouseIsPressed)&&possibleMoves.some(position => position[0] === move[0] && move[1] === position[1])&&(!selectedPiece.body.isbounded)){//returns true and changes the bounds and lock and if the move is legal
     
     let bounds = new selectedPiece.body.Rect(move[0] * 100, move[1] * 100, 100, 100);
     selectedPiece.body.physics.setWorldBounds(bounds);
    selectedPiece.body.isbounded=true;
     
     selectedPiece.move(move[0],move[1],grid);
     
     return true;
   }
  return false;
  
}

function endTurn(){//not done 
  
  
  if (!(selectedPiece.x ==current[0][0]&&selectedPiece.y ==current[0][1])){
    
  
  if(turn=='white'){
    turn='black'
  }
  else{
    turn='white';
  }
  }
  
  flag=false;
  selectedPiece=null;
  flag2=true;
  flag3=false;//this flag is for the drawPath function
  squares=[];
  current =[];
}

/////////////////////////////////
let squares=[],color;
function drawPath(selectedPiece, grid) {//call from start turn and save the result in an array to save computation power
  if(!flag3){
    
    if (selectedPiece != null) {
        let moves = selectedPiece.moves(grid);
        strokeWeight(5);
        noFill();
        stroke(0, 0, 255);
        rect(selectedPiece.x * 100, selectedPiece.y * 100, width / 8, width / 8, 10);
      squares.push([selectedPiece.x*100,selectedPiece.y*100]);
      
      
        for (let i = 0; i < moves.length; i++) {
            if (grid[moves[i][0]][moves[i][1]] === null) {
                stroke(255, 165, 93);
              color=0;
            } else {
                stroke(255, 0, 0);
              color=1;
            }
            rect(moves[i][0] * 100, moves[i][1] * 100, width / 8, width / 8, 10);
          squares.push([moves[i][0] * 100,moves[i][1] * 100,color]);
        }
      squares.push(width/8);//the size of the square
        stroke(0, 0, 0);
        strokeWeight(1);
      flag3=true;
    }

}
  else if(squares.length!=0){
    let index=squares.length-1;
     strokeWeight(5);
        noFill();
        stroke(0, 128, 157);
        rect(squares[0][0] , squares[0][1], squares[index],squares[index],10);
    for(let i=1;i<index;i++){
      if(squares[i][2]==0){
        stroke(243, 162, 109);
      }
      else{
        stroke(205, 86, 86);
      }
      rect(squares[i][0], squares[i][1] , squares[index], squares[index], 10);
    }
   
  }
}

function moveSelectedPiece(){
  flag2 = false
  
  if (mouseIsPressed&&selectedPiece!=null){
  let a = createVector(mouseX, mouseY);
  let b = createVector(selectedPiece.body.particles[1].x, selectedPiece.body.particles[1].y);
  let c = a.sub(b);

  for (let pt of selectedPiece.body.particles) {
    pt.x += c.x;
    pt.y += c.y;

    // Now reset velocity to zero
    pt.prev.set(pt);
    
  }

  // Just to be safe, snap the lead particle to the mouse again
  selectedPiece.body.particles[1].x = mouseX;
  selectedPiece.body.particles[1].y = mouseY;
  
  }
}

function teleportFirst(){//teleports only the first point 
  if(flag2)
  moveSelectedPiece()
  
  if(mouseIsPressed){
  selectedPiece.body.particles[1].x = mouseX;
  selectedPiece.body.particles[1].y = mouseY;
  
  }
  if(!mouseIsPressed){
    flag2 = true
  }
}
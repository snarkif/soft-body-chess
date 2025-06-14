// let dek = false
let count = 0;
let secret = [];
let postframecount = 0;
let grid = [];
let wk,bk;

// function preload() {
//   img = loadImage('https://github.com/snarkif/soft-body-chess/blob/main/docs/dekel.jpg');
// }

function initgrid() {
  let rows = 8, cols = 8;
  grid = [];//bottom left is 0,0
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < cols; j++) {
      grid[i][j] = null;
    }
  }
  let p;
  //////////////////////////////
  function translator(x,y,points){//translates cords of original point array and translates it to the suiting place according to the piece location in the array 
    let newpoints = []
    let xy;
    for(let i =0;i<points.length;i++){
      xy = points[i];
      newpoints.push([xy[0]+x*100,xy[1]+y*100])
    }
      return newpoints;
  }
  for (let i = 0; i < 8; i++) {
    
    p = new Pawn(i, 1, 'white',translator(i,1,Ppawn),false);
    
    grid[i][1] = p;
    
    p = new Pawn(i, 6, 'black',translator(i,6,Ppawn),false);
    grid[i][6] = p;
  }
 
  /////////////////////////////
  p = new Rook(0, 0, 'white',translator(0,0,Prook),false);
  grid[0][0] = p;
  p = new Rook(7, 0, 'white',translator(7,0,Prook),false);
  grid[7][0] = p;
  p = new Rook(0, 7, 'black',translator(0,7,Prook),false);
  grid[0][7] = p;
  p = new Rook(7, 7, 'black',translator(7,7,Prook),false);
  grid[7][7] = p;

  /////////////////////////////
  p = new Knight(1, 0, 'white',translator(1,0,Pknight),false);
  grid[1][0] = p;
  p = new Knight(6, 0, 'white',translator(6,0,Pknight),false);
  grid[6][0] = p;
  p = new Knight(1, 7, 'black',translator(1,7,Pknight),false);
  grid[1][7] = p;
  p = new Knight(6, 7, 'black',translator(6,7,Pknight),false);
  grid[6][7] = p;
  ////////////////////////////
  p = new Bishop(2, 0, 'white',translator(2,0,Pbishop),false);
  grid[2][0] = p;
  p = new Bishop(5, 0, 'white',translator(5,0,Pbishop),false);
  grid[5][0] = p;
  p = new Bishop(2, 7, 'black',translator(2,7,Pbishop),false);
  grid[2][7] = p;
  p = new Bishop(5, 7, 'black',translator(5,7,Pbishop),false);
  grid[5][7] = p;
  ////////////////////////////
  p = new Queen(3, 0, 'white',translator(3,0,Pqueen),false);
  grid[3][0] = p;
  p = new Queen(3, 7, 'black',translator(3,7,Pqueen),false);
  grid[3][7] = p;
  ///////////////////////////
  p = new King(4, 0, 'white',translator(4,0,Pking),false);
  grid[4][0] = p;
  wk=grid[4][0];
  p = new King(4, 7, 'black',translator(4,7,Pking),false);
  grid[4][7] = p;
  bk=grid[4][7];
  ///////////////////////////
}

///////////////////////////
function drawgrid() {

  background(220);
  let bool = true;
  for (let i = 0; i < 8; i++) {
    bool = !bool;
    for (let k = 0; k < 8; k++) {
      noStroke();
      if (bool == true) {
        fill(39, 57, 28);
        bool = false;

      }
      else {
        fill(244, 224, 175);
        bool = true;

      }

      rect(i * 100, k * 100, width / 8, width / 8, 5);

    }
  }
}

///////////////////////////
function track() {//identify grid position from mouse cordinates
  return createVector(mouseX / 100 - (mouseX / 100) % 1, mouseY / 100 - (mouseY / 100) % 1);
}

////////////////////////////variables
let f = true, arr = [], n = 20, selectedPiece = null, clickTimer = 0,turn='white';//remember to change turn
////////////////////////////


///////////////////////////setup
function setup() {
    
  angleMode(DEGREES);
  
 
   let canvas = createCanvas(800, 800);
canvas.center();

  initgrid();

 
    for(let i = 0;i<150;i++){
      var b = new boid()
      b.setPosition(random(0,width),random(0,height));
      boids.push(b);
    }

}

// function mouseClicked(){
//     if(postframecount>20){
//     let x2 = mouseX
//     let y2= mouseY
//     secret.push([(Math.floor(x2/100)),(Math.floor(y2/100))])
   
    
    
//     count++
    
//   }
//    if (count==4&&secret[0][0]==0&&secret[0][1]==4
//        &&secret[1][0]==4&&secret[1][1]==4
//        &&secret[2][0]==4&&secret[2][1]==2){
     
//       dek = true;
//   }

// }


/////////////////
function ld(){
  print("dekel")
  f=true;
  initgrid();
  turn='white';
  postframecount=0;
}
///////////////////////////draw

function draw() {
  
  if (f == true) {
    f = start(arr, n);
    turn='white';
  }
  else {
postframecount++;
    //to cancel you from clicking more than a frame
    //if (clickTimer == 10) {//makes the pieces look jagged while moving them////FIX!!!
      drawgrid();
       
      //change the turn and  the piece you are holding
      playTurn();
      // if(dek){
      //    image(img, 0, 0);
      // }
      //reset the timer
      if(mouseIsPressed){
        clickTimer=0;
      }
    //}
    //timer
    // if(clickTimer< 10){
    //   clickTimer++;
    // }
    if(postframecount>20){
      
    for (let i = 0; i < 8; i++) {
  for (let j = 0; j < 8; j++) {
    let piece = grid[i][j];
    if (piece != null) {
      piece.drawbody();
    }
  }
  }
}
  }
}

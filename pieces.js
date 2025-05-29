//לתקן את הפיצוץ בהתחלה של התוכנית
//work on making it look smoother
//ח
//סט באונדס לא עובד כי הוא נקרא מתוך פיס אבל הוא רק מוגדר בתוך לדוגמא חייל רגיל כלומר אנחנו מנסים לרשת תכונות מהקלאס היורש
///לתקן: לא נשלח בקריאה לקונטרסקטור של פיס הערך לוק
class Piece {

  constructor(x, y, color,lock) {
   
    this.color = color;
    this.x=x;
    this.y=y;
    this.lock=lock;
    //להעביר את זה לכל פיס בנפרד כלומר לחייל או מלך או רץ

  }
  
  attacks(grid){
    let arr=[];
    return arr;
  }
  
  drawbody(){
    
  }
  moves(){//returns a grid containing the cord of each possible move of the piece
    
  }
 
  
  display(){
    
  }
  
  checkbounds(x,y){
    if(x<0||y<0||y>7||x>7){
      return false;
    }
    return true;
  }
  
  move(x,y,grid){//should also check if the move is valid using the moves function of the piece.ys=y start
    if(this.moves(grid).some(pos => pos[0] === x && pos[1] === y)){
      grid[this.x][this.y]=null;
      grid[x][y]=this;
      this.x=x;
      this.y=y;
        
        return true;
       }
    
      return false;
  }


}



/////////////////////////////////////////////////////////////////////////////////

  
class Pawn extends Piece{//no check checking yet
    constructor(x,y,color,points,lock){
      super(x,y,color,lock);
      this.points = points;
      this.body=new Softbody(this.points,false,false);
      this.body.setbounds(this.x,this.y);
    }
  
  drawbody(){
    //updates the soft body's position and updates it's cordinates.also updates bounds when needed
    if(this.body.checklock()){
      this.lock = true;
    }
    else{
      this.lock = false;
    }
      if(!this.lock){
      if (mouseIsPressed){
          let a = createVector(mouseX, mouseY);
  let b = createVector(this.body.particles[1].x, this.body.particles[1].y);
  let c = a.sub(b);

  for (let pt of this.body.particles) {
    pt.x += c.x;
    pt.y += c.y;

    // Now reset velocity to zero
    pt.prev.set(pt);
    this.body.render();
  }

  // Just to be safe, snap the lead particle to the mouse again
  this.body.particles[1].x = mouseX;
  this.body.particles[1].y = mouseY;
  this.body.render();
}
        else {this.body.render();}
        
        
        
      let moves=this.moves(grid);///from this point onward> if the piece is at a valid position for a move then it locks it in bounds
      let pos=this.body.translatecords();
      if(moves.some(position => position[0] === pos[0] && pos[1] === position[1])){
        this.body.updateBounds();
        this.move(pos[0],pos[y],grid);
      }
      
      }  
     else{
        this.body.show()
      }
   
    
  
  }

  

  moves(grid) {
    let moves = [];

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

    return moves.concat(this.attacks(grid));
  }
  
    
  
  
    attacks(grid){//returns which pieces are attacked by the pawn
      let arr1=[];
      let arr2=[];
      if(this.color=='white'){
        
        if(this.checkbounds(this.x+1,this.y+1)&&grid[this.x+1][this.y+1]!=null&&grid[this.x+1][this.y+1].color!=this.color){
          arr2=[this.x+1,this.y+1];
          arr1.push(arr2);
        }
        if(this.checkbounds(this.x-1,this.y+1)&&grid[this.x-1][this.y+1]!=null&&grid[this.x-1][this.y+1].color!=this.color){
          arr2=[this.x-1,this.y+1];
          arr1.push(arr2);
        }
        
      }   
      if(this.color=='black'){
        
        if(this.checkbounds(this.x+1,this.y-1)&&grid[this.x+1][this.y-1]!=null&&grid[this.x+1][this.y-1].color!=this.color){
          arr2=[this.x+1,this.y-1];
          arr1.push(arr2);
        }
        if(this.checkbounds(this.x-1,this.y-1)&&grid[this.x-1][this.y-1]!=null&&grid[this.x-1][this.y-1].color!=this.color){
          arr2=[this.x-1,this.y-1];
          arr1.push(arr2);
        }
        
      }
      return arr1;
  }
  
  display(x,y){
    let x1=this.x*100+20;
    let y1=this.y*100+20;
    if(this.color=='black'){
      fill(247, 90, 90)
    }
    else{
      fill(109, 225, 210)
  
    }
    text("pawn", x1, y1);
  }
  
  
}

/////////////////////////////////////////////////////////////////////////////////

class Bishop extends Piece{//no check checking yet
  constructor(x,y,color,points,lock){
      super(x,y,color,lock);
    this.points = points;
      this.body=new Softbody(this.points,false,false);
    this.body.setbounds(this.x,this.y);
    }
  
  drawbody(){
    //updates the soft body's position and updates it's cordinates.also updates bounds when needed
    if(this.body.checklock()){
      this.lock = true;
    }
    else{
      this.lock = false;
    }
    
      if(!this.lock){
      if (mouseIsPressed){
          let a = createVector(mouseX, mouseY);
  let b = createVector(this.body.particles[1].x, this.body.particles[1].y);
  let c = a.sub(b);

  for (let pt of this.body.particles) {
    pt.x += c.x;
    pt.y += c.y;

    // Now reset velocity to zero
    pt.prev.set(pt);
    this.body.render();
  }

  // Just to be safe, snap the lead particle to the mouse again
  this.body.particles[1].x = mouseX;
  this.body.particles[1].y = mouseY;
  this.body.render();
}
        else {this.body.render();}
        
        
        
      let moves=this.moves(grid);///from this point onward> if the piece is at a valid position for a move then it locks it in bounds
      let pos=this.body.translatecords();
      if(moves.some(position => position[0] === pos[0] && pos[1] === position[1])){
        this.body.updatebounds();
        this.move(pos[0],pos[y],grid);
      }
      
      }  
     else{
        this.body.show()
      }
   
    
  
  }
  
  moves(grid){
    var arr=[];
    this.moves2(this.x+1,this.y+1,grid,arr,'ur');
    this.moves2(this.x-1,this.y+1,grid,arr,'ul');
    this.moves2(this.x-1,this.y-1,grid,arr,'ld');
    this.moves2(this.x+1,this.y-1,grid,arr,'rd');
    return arr;
  }
  moves2(x,y,grid,arr,dir){
    if(this.checkbounds(x,y)==false||(grid[x][y]!=null&&grid[x][y].color==this.color)){
      return null;
    }
    if(grid[x][y] != null && grid[x][y].color!=this.color){
      arr.push([x,y]);
      return null;
    }
    arr.push([x,y]);
    if( dir=='ur' ){
       this.moves2(x+1,y+1,grid,arr,dir);
    }
    if(dir=='ul'){
      this.moves2(x-1,y+1,grid,arr,dir);
    }
    if(dir=='ld'){
      this.moves2(x-1,y-1,grid,arr,dir);
    }
    if(dir=='rd'){
    this.moves2(x+1,y-1,grid,arr,dir);
  }
  
}
  attacks(grid){
    return this.moves(grid);
  }
  
  display(){
    let x=this.x*100+20;
    let y=this.y*100+20;
    if(this.color=='black'){
      fill(247, 90, 90);
    }
    else{
      fill(109, 225, 210);
  
    }
    text("bishop", x, y);
  }
  
}

/////////////////////////////////////////////////////////////////////////////////


class Rook extends Piece {

    constructor(x,y,color,points,lock){
      
      super(x,y,color,lock);
      this.points = points;
      this.body=new Softbody(this.points,false,false);
      this.body.setbounds(this.x,this.y);
    }
  
  drawbody(){
    //updates the soft body's position and updates it's cordinates.also updates bounds when needed
    
    if(this.body.checklock()){
      this.lock = true;
    }
    else{
      this.lock = false;
    }
      if(!this.lock){
      if (mouseIsPressed){
          let a = createVector(mouseX, mouseY);
  let b = createVector(this.body.particles[1].x, this.body.particles[1].y);
  let c = a.sub(b);

  for (let pt of this.body.particles) {
    pt.x += c.x;
    pt.y += c.y;

    // Now reset velocity to zero
    pt.prev.set(pt);
    this.body.render();
  }

  // Just to be safe, snap the lead particle to the mouse again
  this.body.particles[1].x = mouseX;
  this.body.particles[1].y = mouseY;
  this.body.render();
}
        else {this.body.render();}
        
        
        
      let moves=this.moves(grid);///from this point onward> if the piece is at a valid position for a move then it locks it in bounds
      let pos=this.body.translatecords();
      if(moves.some(position => position[0] === pos[0] && pos[1] === position[1])){
        this.body.updatebounds();
        this.move(pos[0],pos[y],grid);
      }
      
      }  
      else{
        this.body.show()
      }
   
    
  
  }

    moves(grid) {
        let total = [];
        total=total.concat(this.horizontal(this.x + 1, this.y, 1, grid));
        total=total.concat(this.horizontal(this.x - 1, this.y, -1, grid));
        total=total.concat(this.vertical(this.x, this.y + 1, 1, grid));
        total=total.concat(this.vertical(this.x, this.y - 1, -1, grid));
        return total;
    }

  
  horizontal(posX, posY, direction, grid) {
  if (!this.checkbounds(posX, posY)) {
    return [];
  }

  if (grid[posX][posY] != null) {
        if (grid[posX][posY].color === this.color)
          {
             return [];
          }
        return [[posX, posY]];
  }

  let temp = [[posX, posY]];
  return temp.concat(this.horizontal(posX + direction, posY, direction, grid));
}

  
  vertical(posX, posY, direction, grid) {
    if (!this.checkbounds(posX, posY)) return [];

    if (grid[posX][posY] != null) {
        if (grid[posX][posY].color === this.color) return [];
        return [[posX, posY]];
    }

    let temp = [[posX, posY]];
    return temp.concat(this.vertical(posX , posY+ direction, direction, grid));
  }
  attacks(grid){
    return this.moves(grid);
  }
  
  display(){
    let x=this.x*100+20;
    let y=this.y*100+20;
    if(this.color=='black'){
      fill(247, 90, 90);
    }
    else{
      fill(109, 225, 210);
  
    }
    text("rook", x, y);
  }
  
}

/////////////////////////////////////////////////////////////////////////////////

class Knight extends Piece {
    constructor(x,y,color,points,lock){
      super(x,y,color,lock);
      this.points = points;
      this.body=new Softbody(this.points,false,false);
      this.body.setbounds(this.x,this.y);
    }
  
  drawbody(){
    //updates the soft body's position and updates it's cordinates.also updates bounds when needed
    if(this.body.checklock()){
      this.lock = true;
    }
    else{
      this.lock = false;
    }
    
      if(!this.lock){
      if (mouseIsPressed){
          let a = createVector(mouseX, mouseY);
  let b = createVector(this.body.particles[1].x, this.body.particles[1].y);
  let c = a.sub(b);

  for (let pt of this.body.particles) {
    pt.x += c.x;
    pt.y += c.y;

    // Now reset velocity to zero
    pt.prev.set(pt);
    this.body.render();
  }

  // Just to be safe, snap the lead particle to the mouse again
  this.body.particles[1].x = mouseX;
  this.body.particles[1].y = mouseY;
  this.body.render();
}
        else {this.body.render();}
        
        
        
      let moves=this.moves(grid);///from this point onward> if the piece is at a valid position for a move then it locks it in bounds
      let pos=this.body.translatecords();
      if(moves.some(position => position[0] === pos[0] && pos[1] === position[1])){
        this.body.updatebounds();
        this.move(pos[0],pos[y],grid);
      }
      
      }  
     else{
        this.body.show()
      }
   
    
  
  }

    moves(grid) {
        let total = [];
        for (let i = -1; i < 2; i += 2) {
            for (let h = -1; h < 2; h += 2) {
                if (this.checkbounds(this.x + 2 * i,this.y+h)) {
                    if (grid[this.x + 2 * i][this.y + h] == null || grid[this.x + 2 * i][this.y + h].color != this.color) {
                        total.push([this.x + 2 * i,this.y + h]);
                    }
                }
            }
        }
        for (let i = -1; i < 2; i += 2) {
            for (let h = -1; h < 2; h += 2) {
                if (this.checkbounds(this.x +  i,this.y+2*h)) {
                    if (grid[this.x + i][this.y + 2 * h] == null || grid[this.x + i][this.y + 2 * h].color != this.color) {
                        total.push([this.x + i,this.y + 2 * h]);
                    }
                }
            }
        }
        return total;
    }
  
  attacks(grid){
    return this.moves(grid);
  }
  
  
  display(){
    let x=this.x*100+20;
    let y=this.y*100+20;
    if(this.color=='black'){
      fill(247, 90, 90);
    }
    else{
      fill(109, 225, 210);
  
    }
    text("knight", x, y);
  }

}

/////////////////////////////////////////////////////////////////////////////////

class Queen extends Piece {
    constructor(x,y,color,points,lock){
      super(x,y,color,lock);
      this.points = points;
      this.body=new Softbody(this.points,false,false);
      this.body.setbounds(this.x,this.y);
    }
  
  drawbody(){
    //updates the soft body's position and updates it's cordinates.also updates bounds when needed
    if(this.body.checklock()){
      this.lock = true;
    }
    else{
      this.lock = false;
    }
    
      if(!this.lock){
      if (mouseIsPressed){
          let a = createVector(mouseX, mouseY);
  let b = createVector(this.body.particles[1].x, this.body.particles[1].y);
  let c = a.sub(b);

  for (let pt of this.body.particles) {
    pt.x += c.x;
    pt.y += c.y;

    // Now reset velocity to zero
    pt.prev.set(pt);
    this.body.render();
  }

  // Just to be safe, snap the lead particle to the mouse again
  this.body.particles[1].x = mouseX;
  this.body.particles[1].y = mouseY;
  this.body.render();
}
        else {this.body.render();}
        
        
        
      let moves=this.moves(grid);///from this point onward> if the piece is at a valid position for a move then it locks it in bounds
      let pos=this.body.translatecords();
      if(moves.some(position => position[0] === pos[0] && pos[1] === position[1])){
        this.body.updatebounds();
        this.move(pos[0],pos[y],grid);
      }
      
      }  
     else{
        this.body.show()
      }
   
    
  
  }

    moves(grid) {
        let total = [];
        let temp = new Rook(this.x, this.y, this.color,Prook,true);
        total=total.concat(temp.moves(grid));
        temp = new Bishop(this.x, this.y, this.color,Prook,true);
        total=total.concat(temp.moves(grid));
        return total;
    }
  attacks(grid){
    return this.moves(grid);
  }
  
  display(){
    let x=this.x*100+20;
    let y=this.y*100+20;
    if(this.color=='black'){
      fill(247, 90, 90);
    }
    else{
      fill(109, 225, 210);
  
    }
    text("queen", x, y);
  }
  
}

/////////////////////////////////////////////////////////////////////////////////

class King extends Piece{
  constructor(x,y,color,points,lock){
      super(x,y,color,lock);
      this.points = points;
      this.body=new Softbody(this.points,false,false);
    this.body.setbounds(this.x,this.y);
    }
  
 drawbody(){
    //updates the soft body's position and updates it's cordinates.also updates bounds when needed
    if(this.body.checklock()){
      this.lock = true;
    }
    else{
      this.lock = false;
    }
    
      if(!this.lock){
      if (mouseIsPressed&&postframecount>60){
          let a = createVector(mouseX, mouseY);
  let b = createVector(this.body.particles[1].x, this.body.particles[1].y);
  let c = a.sub(b);

  for (let pt of this.body.particles) {
    pt.x += c.x;
    pt.y += c.y;

    // Now reset velocity to zero
    pt.prev.set(pt);
    this.body.render();
  }

  // Just to be safe, snap the lead particle to the mouse again
  this.body.particles[1].x = mouseX;
  this.body.particles[1].y = mouseY;
  this.body.render();
}
        else {this.body.render();}
        
        
        
      let moves=this.moves(grid);///from this point onward> if the piece is at a valid position for a move then it locks it in bounds
      let pos=this.body.translatecords();
      if(moves.some(position => position[0] === pos[0] && pos[1] === position[1])){
        this.body.updatebounds();
        this.move(pos[0],pos[y],grid);
      }
      
      }  
     else{
        this.body.show()
      }
   
    
  
  }
  
  isChecked(grid,x,y){//checks if the king is checked in specific cordinates
    let arr=[];
    for(let i=0;i<8;i++){
      for(let k=0;k<8;k++){
        if(grid[i][k]!=null&&grid[i][k].color!=this.color){
          arr=grid[i][k].attacks(grid);
          for(let t=0;t<arr.length;t++){
            if(arr[t][0]==x&&arr[t][1]==y){
              return true;
            }
          }
        }
      }
    }
    return false;
  }
  
  isMate(grid,x,y){
    if(this.isChecked&&this.moves()==[]){
      return true;
    }
    return false;
  }
  
  moves(grid) {
  let arr = [];
  for(let i = -1; i < 2; i++) {
    for(let k = -1; k < 2; k++) {
      if(i === 0 && k === 0) continue; // skip
      
      let newX = this.x + i;
      let newY = this.y + k;
      
      if(!this.checkbounds(newX, newY)) continue;//skip
      
      
      if(grid[newX][newY] === null || grid[newX][newY].color !== this.color) {
        if(!this.isChecked(grid, newX, newY)) {
          arr.push([newX, newY]);
        }
      }
    }
  }
  return arr;
}
  
  display(){
    let x=this.x*100+20;
    let y=this.y*100+20;
    if(this.color=='black'){
      fill(247, 90, 90);
    }
    else{
      fill(109, 225, 210);
  
    }
    text("king", x, y);
  }
  
}
////////////////////////////////////////////////
  
  
  
  
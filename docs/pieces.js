//לתקן את הפיצוץ בהתחלה של התוכנית
//work on making it look smoother
//ח
//סט באונדס לא עובד כי הוא נקרא מתוך פיס אבל הוא רק מוגדר בתוך לדוגמא חייל רגיל כלומר אנחנו מנסים לרשת תכונות מהקלאס היורש
///לתקן: לא נשלח בקריאה לקונטרסקטור של פיס הערך לוק
class Piece {
  constructor(x, y, color, lock, points) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.lock = lock;
    this.points = points;
    this.body = new Softbody(this.points, false, false,this.color);
    this.body.setbounds(this.x, this.y);
  }

  attacks(grid) {
    let arr = [];
    return arr;
  }

  drawbody() {
    if (this.body.checklock()) {
      this.lock = true;
    } else {
      this.lock = false;
    }

    if (!this.lock) {
      
        this.body.render();
      

      //let moves = this.moves(grid);
      //let pos = this.body.translatecords();
      //if (moves.some(position => position[0] === pos[0] && pos[1] === position[1])) {
       // this.body.updatebounds();
        //this.move(pos[0], pos[1], grid);
     // }
    } else {
      this.body.show();
    }
  }

  moves() {
    return [];
  }

  display() {}

  checkbounds(x, y) {
    return !(x < 0 || y < 0 || y > 7 || x > 7);
  }

  move(x, y, grid) {
    if (this.moves(grid).some(pos => pos[0] === x && pos[1] === y)) {
      grid[this.x][this.y] = null;
      
      if(grid[x][y]===wk||grid[x][y]===bk){
        ld();
      }
      grid[x][y] = this;
      this.x = x;
      this.y = y;
      return true;
    }
    return false;
  }
  
  
  
}




/////////////////////////////////////////////////////////////////////////////////

  
class Pawn extends Piece {
  constructor(x, y, color, points, lock) {
    super(x, y, color, lock, points);
  }

  moves(grid) {
    let moves = [];
    if (this.color === 'black') {
      if (this.checkbounds(this.x, this.y - 1) && grid[this.x][this.y - 1] === null)
        moves.push([this.x, this.y - 1]);
      if (this.y === 6 && grid[this.x][this.y - 2] === null)
        moves.push([this.x, this.y - 2]);
    }
    if (this.color === 'white') {
      if (this.checkbounds(this.x, this.y + 1) && grid[this.x][this.y + 1] === null)
        moves.push([this.x, this.y + 1]);
      if (this.y === 1 && grid[this.x][this.y + 2] === null)
        moves.push([this.x, this.y + 2]);
    }
    return moves.concat(this.attacks(grid));
  }

  attacks(grid) {
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
    return result;
  }

  display() {
    let x = this.x * 100 + 20;
    let y = this.y * 100 + 20;
    fill(this.color === 'black' ? [247, 90, 90] : [109, 225, 210]);
    text("pawn", x, y);
  }
}

/////////////////////////////////////////////////////////////////////////////////

class Bishop extends Piece{//no check checking yet
  constructor(x, y, color, points, lock) {
    super(x, y, color, lock, points);
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

    constructor(x, y, color, points, lock) {
    super(x, y, color, lock, points);
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
    constructor(x, y, color, points, lock) {
    super(x, y, color, lock, points);
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
    constructor(x, y, color, points, lock) {
    super(x, y, color, lock, points);
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
  constructor(x, y, color, points, lock) {
    super(x, y, color, lock, points);
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
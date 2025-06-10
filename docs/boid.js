class boid{
  constructor(){
    this.maxspeed = 5
    this.maxforce = 10
    this.position = createVector()
    this.velocity = createVector()
    this.acceleration = createVector()
  }
  
  bounds(){
    if(this.position.x>width){
      this.position = createVector(0,this.position.y)
    }
    if(this.position.x<0){
      this.position = createVector(width,this.position.y)
    }
    if(this.position.y>height){
      this.position = createVector(this.position.x,0)
    }
    if(this.position.y<0){
      this.position = createVector(this.position.x,height)
    }
      
  }
  
  align(boids){
    var maxspeed = 10
    var R = 50;
    var delta = createVector(0,0)
    var count = 0
    for(var other of boids){
      if(dist(this.position.x,this.position.y,other.position.x,other.position.y)<R&&this!==other){
        delta.add(other.position)
        count++;
      }
    }
    
    if(count>0){
      delta.div(count);
      var steer = p5.Vector.sub(delta,this.velocity)
      steer.limit(this.maxforce)
   
      return steer
    
    }
    else{
      return createVector(0,0);
    }
   
    
  }
  

  seekmouse(){
  var steer = p5.Vector.sub(createVector(mouseX-this.position.x,mouseY-this.position.y),this.velocity)
  steer.limit(this.maxforce)
  return steer
  }
  
  cohesion(boids) {
    let neighborDistance = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of boids) {
      let d = p5.Vector.dist(this.position, other.position);
      if ((this !== other) && (d < neighborDistance)) {
        sum.add(other.velocity);
        count++;


      }
    }
    if (count > 0) {
      sum.div(count);
      var steer = p5.Vector.sub(sum,this.velocity)
   steer.limit(this.maxforce)
  return steer
      


    } else {
      return createVector(0, 0);
    }
  }
  
  seperate(boids){
    var R = 20 
    var count = 0
    var sum = createVector(0,0)
    for(var other of boids){
      if(dist(this.position.x,this.position.y,other.position.x,other.position.y)<R&&this!==other){
        
         let diff = p5.Vector.sub(this.position, other.position);//מחשב את העתק הפוך מההעתק הרגיל על מנת לברוח מהבויד השני
        
       diff.setMag(1 /dist(this.position.x,this.position.y,other.position.x,other.position.y)); // שהוא רחוק יותר ככה הכוח
        
      sum.add(diff);
      count++;
      }
  }
    if (count>0){
      
      sum.setMag(this.maxspeed);
    }
    else{
      return createVector(0,0)
    }
    
    
    var steer = p5.Vector.sub(sum,this.velocity)
    steer.limit(this.maxforce)
    return steer
  }
  
  applyForce(force){
    this.acceleration.add(force)
  }
  
  update(){
    this.velocity.add(this.acceleration.mult(0.01))
    this.velocity.limit(this.maxspeed)
    this.position.add(this.velocity)
    this.bounds()
    this.acceleration = createVector(0,0)
    
  }
  
  avoidAll(){
    this.applyForce(this.avoidObject(650,500).mult(10))
    this.applyForce(this.avoidObject(600,500).mult(10))
    this.applyForce(this.avoidObject(550,500).mult(10))
    this.applyForce(this.avoidObject(500,500).mult(10))
    this.applyForce(this.avoidObject(450,500).mult(10))
    this.applyForce(this.avoidObject(400,500).mult(10))
    this.applyForce(this.avoidObject(350,500).mult(10))
  }
  avoidObject(x,y){
    
    if(dist(x,y,this.position.x,this.position.y)<30){
      x = createVector(x,y)
      let diff = p5.Vector.sub(this.position,x)
      var steer = p5.Vector.sub(diff,this.velocity)
      steer.limit(this.maxforce)
      return steer
    }
    else{
      return createVector(0,0)
    }
  }
  
  
  setPosition(x,y){
    this.position = createVector(x,y)
  }
  
    show() {
    let angle = this.velocity.heading();
    
 
    fill('#7AE2CF') 
     
    
    stroke(0);
      strokeWeight(0);
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);
       
    beginShape();
    vertex(5 * 2, 0);
    vertex(-5 * 2, -5);
    vertex(-5 * 2, 5);
    endShape(CLOSE);
    pop();
    }

  
  
  
}
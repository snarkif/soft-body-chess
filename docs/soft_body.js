//להוסיף אינטרקציה עם העכבר ולעשות שזה משנה את הבאונדס להמלבן הקטן לעולם כולו ובנסוף בכל פעם שאני עושה את זה לשנות את המשתנה isbounded שלפיו הלוק נקבע וגם לשנות אותו לטרו באפדייט באונדס

class Softbody {
  constructor(points, drawcurve,lock,color) {
    this.Vec2D = toxi.geom.Vec2D;
    this.Rect = toxi.geom.Rect;
    this.VerletPhysics2D = toxi.physics2d.VerletPhysics2D;
    this.VerletParticle2D = toxi.physics2d.VerletParticle2D;
    this.VerletSpring2D = toxi.physics2d.VerletSpring2D;
    this.GravityBehavior = toxi.physics2d.behaviors.GravityBehavior;
    this.physics = new this.VerletPhysics2D();
     // a point used to measure the avg velocity of the entire piece for the sake of locking it 
    this.drawcurve = true;
    this.points = points;
    this.color = color
    this.particles = this.insertparticles();
    this.springs = this.insertsprings();
    this.fatherpoint = this.particles[0]
    let maxx = 0;
    let minx = width;
    let maxy = 0;
    let miny = height;
    this.isbounded = true;
    
    this.maxpointx = this.particles[0];
this.minpointx = this.particles[0];
this.maxpointy = this.particles[0];
this.minpointy = this.particles[0];

for (let i = 0; i < this.particles.length; i++) {
  const p = this.particles[i];//find the highest ,lowest ,right and left points in order to make boundary checking easier
  if (p.x > this.maxpointx.x) this.maxpointx = p;
  if (p.x < this.minpointx.x) this.minpointx = p;
  if (p.y > this.maxpointy.y) this.maxpointy = p;
  if (p.y < this.minpointy.y) this.minpointy = p;
}
    let bounds = new this.Rect(0, 0, 800, 800);
    this.physics.setWorldBounds(bounds);
    this.physics.addBehavior(new this.GravityBehavior(new this.Vec2D(0, 0.5)));
  }

  insertparticles() {
    
    let particles = [];
    
    for (let i = 0; i < this.points.length; i++) {
      let pt = this.points[i];
      let particle = new this.VerletParticle2D(pt[0], pt[1]);
      particles.push(particle);
      this.physics.addParticle(particle);
      
    }
    return particles;
  }

  insertsprings() {
    let springs = [];
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = 0; j < this.particles.length; j++) {
        if (random(1) < 0.3 && i != j) {
          let pt1 = this.points[i];
          let pt2 = this.points[j];
          let x1 = pt1[0];
          let y1 = pt1[1];
          let x2 = pt2[0];
          let y2 = pt2[1];
          let delta = dist(x1, y1, x2, y2);
          let spring = new this.VerletSpring2D(this.particles[i], this.particles[j], delta, 0.005);
          springs.push(spring);
          this.physics.addSpring(spring);
        }
      }
    }
    return springs;
  }

  update() {
    
    this.physics.update();
    
  }

  show() {
    if (!this.drawcurve) {
      
      beginShape();
      for (let par of this.particles) {
        
        vertex(par.x, par.y);
      }
      endShape(CLOSE);
    }
    else {
      
 if (this.color == "black"){
   fill("#537D5D");
 }
 if (this.color == "white"){
   fill("#F4FFC3");
 }    
  stroke("#18230F");
strokeWeight(2);
  beginShape();
  
 
  curveVertex(this.particles[this.particles.length - 2].x, this.particles[this.particles.length - 2].y);
  curveVertex(this.particles[this.particles.length - 1].x, this.particles[this.particles.length - 1].y);
  
 
  for (let p of this.particles) {
    curveVertex(p.x, p.y);
  }

  
  curveVertex(this.particles[0].x, this.particles[0].y);
  curveVertex(this.particles[1].x, this.particles[1].y);
  
  endShape(CLOSE);
  }
}
  
  
  
  
  render() {
    this.update();
    this.show();
  }

  translatecords() {//returns soft body grid cordinates else returns false ec; not bounded
  let y1 = Math.floor(this.maxpointy.y / 100),
      y2 = Math.floor(this.minpointy.y / 100),
      x1 = Math.floor(this.maxpointx.x / 100),
      x2 = Math.floor(this.minpointx.x / 100);

  if (x1 === x2 && y1 === y2) {
    return [x1, y1];
  }
  return false;
}


  updateBounds() {//allowed=if the move is allowed
    let p = this.translatecords();
    if (p != false &&(!mouseIsPressed)&&(!this.isbounded)){
      let bounds = new this.Rect(p[0] * 100, p[1] * 100, 100, 100);
      this.physics.setWorldBounds(bounds);
      this.isbounded=true
    }
  }
  
  setbounds(x,y){
    let r = new this.Rect(x*100,y*100,100,100);
    this.physics.setWorldBounds(r);
  }
  setboundstoworld(){
    let r = new this.Rect(0,0,800,800);
    this.physics.setWorldBounds(r);
  }
  removelock(){
  this.setboundstoworld()
  this.isbounded = false
 
  }
  checklock(){//checks is the velocity is low enough to lock
    
    
    if(postframecount >60){
      
    let currentX1 = this.minpointy.x;
  let currentY1 = this.minpointy.y;
  let prevX1 = this.minpointy.prev.x;
  let prevY1 = this.minpointy.prev.y;

  // Calculate velocity components
  let velocityX1 = currentX1 - prevX1;
  let velocityY1 = currentY1 - prevY1;

  // Calculate speed (magnitude of velocity)
  let speed3 = dist(0, 0, velocityX1, velocityY1);
      
      
      
      
      
      
    let currentX2 = this.maxpointx.x;
  let currentY2 = this.maxpointx.y;
  let prevX2 = this.maxpointx.prev.x;
  let prevY2 = this.maxpointx.prev.y;

  // Calculate velocity components
  let velocityX2 = currentX2 - prevX2;
  let velocityY2 = currentY2 - prevY2;

  // Calculate speed (magnitude of velocity)
  let speed1 = dist(0, 0, velocityX2, velocityY2);
        
        
    let currentX3 = this.minpointx.x;
  let currentY3 = this.minpointx.y;
  let prevX3 = this.minpointx.prev.x;
  let prevY3 = this.minpointx.prev.y;

  // Calculate velocity components
  let velocityX3 = currentX3 - prevX3;
  let velocityY3 = currentY3 - prevY3;

  // Calculate speed (magnitude of velocity)
  let speed2 = dist(0, 0, velocityX3, velocityY3);
          
          
          
          
          
          
          
    let currentX4 = this.maxpointy.x;
  let currentY4 = this.maxpointy.y;
  let prevX4 = this.maxpointy.prev.x;
  let prevY4 = this.maxpointy.prev.y;

  // Calculate velocity components
  let velocityX4 = currentX4 - prevX4;
  let velocityY4 = currentY4 - prevY4;

  // Calculate speed (magnitude of velocity)
  let speed4 = dist(0, 0, velocityX4, velocityY4);
  
    if(this.isbounded&&Math.abs(speed1)<0.1&&Math.abs(speed2)<0.1&&Math.abs(speed3)<0.1&&Math.abs(speed4)<0.1){
       return true;
       }
    return false;
  }
    return false;
  }

}
//להוסיף אינטרקציה עם העכבר ולעשות שזה משנה את הבאונדס להמלבן הקטן לעולם כולו ובנסוף בכל פעם שאני עושה את זה לשנות את המשתנה isbounded שלפיו הלוק נקבע וגם לשנות אותו לטרו באפדייט באונדס

class Softbody {
  constructor(points, drawcurve,lock) {
    this.Vec2D = toxi.geom.Vec2D;
    this.Rect = toxi.geom.Rect;
    this.VerletPhysics2D = toxi.physics2d.VerletPhysics2D;
    this.VerletParticle2D = toxi.physics2d.VerletParticle2D;
    this.VerletSpring2D = toxi.physics2d.VerletSpring2D;
    this.GravityBehavior = toxi.physics2d.behaviors.GravityBehavior;
    this.physics = new this.VerletPhysics2D();
     // a point used to measure the avg velocity of the entire piece for the sake of locking it 
    this.drawcurve = drawcurve;
    this.points = points;
    
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
      fill(200, 0, 0, 100);
      beginShape();
      for (let par of this.particles) {
        circle(par.x, par.y, 2);
        vertex(par.x, par.y);
      }
      endShape(CLOSE);
    } else {
      for (let i = 0; i < this.particles.length - 3; i++) {
        curve(
          this.particles[i].x, this.particles[i].y,
          this.particles[i + 1].x, this.particles[i + 1].y,
          this.particles[i + 2].x, this.particles[i + 2].y,
          this.particles[i + 3].x, this.particles[i + 3].y
        );
      }
      // Close the curve
      let p = this.particles;
      curve(p[1].x, p[1].y, p[0].x, p[0].y, p[p.length - 1].x, p[p.length - 1].y, p[p.length - 2].x, p[p.length - 2].y);
      curve(p[2].x, p[2].y, p[1].x, p[1].y, p[0].x, p[0].y, p[p.length - 1].x, p[p.length - 1].y);
      curve(p[0].x, p[0].y, p[p.length - 1].x, p[p.length - 1].y, p[p.length - 2].x, p[p.length - 2].y, p[p.length - 3].x, p[p.length - 3].y);
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
    }
  }
  
  setbounds(x,y){
    let r = new this.Rect(x*100,y*100,100,100);
    this.physics.setWorldBounds(r);
  }
  
  
  checklock(){//checks is the velocity is low enough to lock
    if(postframecount >60){
    let currentX = this.fatherpoint.x;
  let currentY = this.fatherpoint.y;
  let prevX = this.fatherpoint.prev.x;
  let prevY = this.fatherpoint.prev.y;

  // Calculate velocity components
  let velocityX = currentX - prevX;
  let velocityY = currentY - prevY;

  // Calculate speed (magnitude of velocity)
  let speed = dist(0, 0, velocityX, velocityY);
    
    if(this.isbounded&&Math.abs(speed)<0.1){
       return true;
       }
    return false;
  }
    return false;
  }
  
}
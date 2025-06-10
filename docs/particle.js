
class Particle {
  constructor(x, y, vx, vy, ax, ay, r) {
    this.r = r;
    this.location = createVector(x, y);
    this.velocity = createVector(vx, vy);
    this.acceleration = createVector(ax, ay);
  }
  
  applyforce(force){//f=ma m=1 so f=a,we will add f to the current acceleration vector
    this.acceleration.add(force);
  }

  update() {//updates location and velocity and resets acceleration
    this.checkboundaries();
    this.velocity.mult(1);//damping
    this.location.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.acceleration.mult(0);//after each frame a=0 and u have to apply all the forces again if u want to change the acceleration.for example every frame u have to do apllyforce(createvector(0,gravity)) etc... before hitting update()
  }

  display() {
    fill(16, 46, 80);
    ellipse(this.location.x, this.location.y, this.r, this.r);
  }

  checkboundaries() {
    if (
      this.location.x + this.r / 2 >= width ||
      this.location.x - this.r / 2 <= 0
    ) {
      this.velocity.x = -this.velocity.x;
      this.location.x = constrain(this.location.x, this.r / 2, width - this.r / 2);
    }

    if (
      this.location.y + this.r / 2 >= height ||
      this.location.y - this.r / 2 <= 0
    ) {
      this.velocity.y = -this.velocity.y;
      this.location.y = constrain(this.location.y, this.r / 2, height - this.r / 2);
    }
  }
}

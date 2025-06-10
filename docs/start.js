var boids=[]
///////////////////////////
let angle = 0;

////////////////////////
function start(arr,n,startTimer){

  if(mouseIsPressed&& mouseX>width-70&&mouseX<width-20&&mouseY>100&&mouseY<150&&f==true){
        return false;

      }







  background('#077A7D');


  for(let b of boids){
     b.applyForce(b.avoidAll())
     b.applyForce(b.align(boids).mult(3))
     b.applyForce(b.cohesion(boids).mult(2))
     b.applyForce(b.seperate(boids).mult(2))
    if(mouseIsPressed){
     b.applyForce(b.seekmouse().mult(10))

    }
     b.update()
  }

  for(let b of boids){
  b.show()
  }
 fill(30, 30, 3); 
  rect(width-80, 110, 50, 50, 5);

  fill(245, 196, 94);
  rect(width-70,100,50,50,5);
  textSize(40)
  textFont("Courier New")
  text("softbody chess",400,550)
  textSize(20)
  text("by koren, uri and snir ",403,580)
  return true;


}
///////////////////////////

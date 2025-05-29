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
     b.applyForce(b.align(boids).mult(A.value()))
     b.applyForce(b.cohesion(boids).mult(C.value()))
     b.applyForce(b.seperate(boids).mult(S.value()))
    if(mouseIsPressed)
     b.applyForce(b.seekmouse().mult(M.value()))
    
     b.update()
  }
  
  for(let b of boids){
  b.show()
  }
 fill(30, 30, 3); 
  rect(width-80, 110, 50, 50, 5);
  
  fill(245, 196, 94);
  rect(width-70,100,50,50,5);
  text("dekel",500,500)
  return true;

  
}
///////////////////////////
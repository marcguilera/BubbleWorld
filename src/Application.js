import scene;

import src.Grid as Grid;
import src.Canon as Canon;

var radius = 47;
var columns = 6;
var rows = 6;


var canon;
var grid;

exports = scene(function() {
    createEnum();
    createGrid();
    createCanon();
    createTouchListener();
});

function createGrid(){
    grid = new Grid({
      columns: columns,
      rows: rows,
      radius: radius
    });
    
    scene.groups.push(grid);
};

function createCanon(){
    canon = new Canon({
      radius: radius,
      speed: 200
    });
    
    scene.groups.push(canon);
    
    canon.onLaunched = function(bubble){
      console.log('Launched '+bubble.type);
      addCollisionDetection(bubble);
    };
};


function addCollisionDetection(bubble){
  console.log('Add collision detection');

  //First remove the previous
  removeCollisionDetection();
  
  scene.onCollision(bubble,grid,function(bubble,gridBubble){
    collision(bubble,gridBubble);
  });
  
  //Collision with walls
  scene.onCollision(bubble,[scene.camera.leftWall,scene.camera.rightWall],function(){
    bubble.vx = -bubble.vx;
  });
  scene.onCollision(bubble,[scene.camera.topWall,scene.camera.bottomWall],function(){
    bubble.vy = -bubble.vy;
  });
  
};

function removeCollisionDetection(){
  scene.collisions.reset();
};


function collision(bubble,groupBubble){
  console.log('Colision!');
  //There was a collision between the 2 groups
    
  //1. Compute the colision with the grid
  grid.collide(bubble,groupBubble);
  
  //2. Destroy the launched bubble
  bubble.destroy();
  
  //3. Create a new bubble for next launch
  canon.createBubble();
};

function createTouchListener(){ 
    scene.screen.onDown(function(point){
      console.log('Screen touch');
      canon.launchTo(point.x,point.y);
    });
};


//Create the (obviously fake) enum for tile types
//Enums don't exist in JS but this struct will help
//by working with meaningful names and not useless ints.
function createEnum(){
    GLOBAL.bubbleTypes = {
        RED: 0,
        BLUE: 1,
        ORANGE: 2,
        PINK: 3,
        GREEN: 4
    };
};
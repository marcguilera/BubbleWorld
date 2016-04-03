import scene;

import src.Grid as Grid;
import src.Canon as Canon;

var radius = 47;
var columns = 6;
var maxRows = 8;
var rows = 4;


var canon;
var grid;

var points;
var won = true;

//This is like scene.state.add('game')
exports = scene(function() {
    createEnum();
    startGame();
});

scene.state.add('gameOver', function(){
    console.log('GameOver!');
    
    //var gameOverBg = scene.ui.addImage({image:'resources/images/game_bg.png'});
    if(won){
      scene.addText("You won!",{y:200});
    }else{
      scene.addText("Game over :'(",{y:200});
    }
    
    scene.addText("Points: "+points,{y:400});
    scene.addText("Tap to retry: ",{y:600});
    
},{
  tapToContinue: true,
  nextState: 'game',
  clearOnTransition: true
});


function createGrid(){
    grid = new Grid({
      columns: columns,
      rows: rows,
      radius: radius,
      maxRows: maxRows
    });
    
    scene.groups.push(grid);
    
    grid.onGameLost = function(_points){
      console.log('Game lost. Points = '+_points);
      //endGame();
      won=false;
      points=_points;
      endGame();
    };
    
    grid.onGameWon = function(_points){
      console.log('Game won. Points ='+_points);
      points = _points;
      won=true;
      endGame();
    };
};

function startGame(){
  createGrid();
  createCanon();
  createTouchListener();
  
}


function endGame(){
  //removeCollisionDetection();
  removeTouchListener();
  destroyCanon();
  destroyGrid();
  scene.groups = [];
  scene.gameOver();
  
};


function destroyCanon(){
  canon.destroy();
};

function destroyGrid(){
  grid.destroy();
};

function createCanon(){
    canon = new Canon({
      radius: radius,
      speed: 600
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

var listener = function(point){
    canon.launchTo(point.x,point.y);
};

function createTouchListener(){ 
    scene.screen.onDown(listener);
};

function removeTouchListener(){
    scene.screen.removeOnDown(listener);
};


//Create the (obviously fake) enum for tile types
//Enums don't exist in JS but this struct will help
//by working with meaningful names and not useless ints.
function createEnum(){
    GLOBAL.bubbleTypes = {
        RED: 1,
        BLUE: 2,
        ORANGE: 3,
        PINK: 4,
        GREEN: 5
    };
};
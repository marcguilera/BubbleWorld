import scene;

import src.Grid as Grid;

exports = scene(function() {
    createEnum();
    createGrid();
});

function createGrid(){
    var grid = new Grid({
      columns: 6,
      rows: 6,
      radius: 47
    });
    
    scene.groups.push(grid);
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
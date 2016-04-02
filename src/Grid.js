import scene.group.Group as Group;

import src.Bubble as Bubble;

//Creates a hexagonal grid of bubbles given rows, columns
//It is a group so it can be added wherever (reusable).
//It handles the creation and addition of its own bubbles
exports = Class(Group, function (supr) {
    
    var _this;
    var radius;
    var columns, rows;
    var grid;
    
    this.init = function (opts) {
        this.name = "Grid";
        
        opts.columns = opts.columns || 5;
        opts.rows = opts.rows || 5;
        opts.radius = opts.radius || 100;
        
        supr(this, 'init', opts);  
        
        //Make sure the actors created by this group are of type
        //bubble
        this._ctor = Bubble;
        
        radius = opts.radius;
        
        columns = opts.columns;
        rows = opts.rows;
        radius = opts.radius;
        _this = this;
        
        this.build(); 
    };
    
    //Creates the grid and its bubbles
    this.build = function(){
        createGrid();
    };
    
    //Creates the bidimensional array containing bubbles
    function createGrid(){
        grid = new Array(columns);
        
        for(var col=0;col<columns;col++){
            grid[col] = new Array(rows);
            
            for(var row=0;row<rows;row++){
                addBubbleAt(col,row);
            }
            
        }
    };
    
    //Generates a bubble at a given position in the grid
    function addBubbleAt(column, row, type){
        removeBubbleAt(column,row);
        
        var bubbleSettings = getBubbleCoordinate(column,row);
        bubbleSettings.radius = radius;
        bubbleSettings.type = type;
        
        var bubble = _this.addActor(bubbleSettings);
        
        //I save handy stuff in the bubble object
        bubble.gridInfo = {
            column:column,
            row:row
        };
        
        grid[column][row] = bubble; 
    };
    
    //Returns the x,y given a cell. I offseted y but
    //I could've offseted x equally.
    function getBubbleCoordinate(column, row) {
        var size = radius*2;
        var x = column * size;
        var y = row * size;
     
        // y offset for odd columns
        if (column % 2) {
            y += radius;
        }
        
        return { x : x, y : y };
    };
    
    //Pretty much the opposite of the last function
    //given a point in space it returns the closest
    //column and row
    function getGridPosition(x,y){
        var size = radius*2;
        var column = Math.floor(x / size);
        
        //The y offset
        if(column%2){
            y-=radius;
        }
        
        var row = Math.floor(y / size);
        
        return { column : column, row : row };
    };
    
    //Removes the bubble in a given position in the grid
    function removeBubbleAt(column,row){
        if(grid[column][row]){
            grid[column][row].remove();
            grid[column][row] = null;
        }  
    };
    
    //Handles collision between an extern bubble and one
    //from within the grid
    this.collide = function(bubble, gridBubble){
        console.log('Computing collisions in the grid');
        
        snapBubble(bubble,gridBubble);
        
        //var group = findGroup(gridInfo.column,gridInfo.row,bubble.type);
        //console.log('Found a group of '+group.length);
    };

    function snapBubble(bubble,gridBubble){
        //1 Get the center of the comming bubble
        var x = bubble.x+bubble.width/2;
        var y = bubble.y+bubble.height/2;
        
        //2 Find the closest actual legal cell
        var gridPosition = getGridPosition(x,y);
        
        addBubbleAt(gridPosition.column,gridPosition.row,bubble.type);
        
    }

    //Finds groups of tiles given the tile at a certain location
    //and matching the given type. This could be done with recursion
    //but i feel without it's much more readable and reusable.
    function findGroup(column, row, type){
        //1. Reset checked state
        resetChecked();

        
        //2. If there just isn't a bubble in the cell, leave
        var validInputs = column>=0&&column<=columns&&row>=0&&row<=rows;
        if(!validInputs&&grid[column][row]==null){
            return [];
        }
        
        //3. Grab the desired bubble
        var bubble = grid[column][row];
        
        //4. Check if the bubble is the same tipe as the starting one. 
        if(bubble.type!=type){
            return [];
        }
        
        //5. Create the array of bubbles to check and include the starting one
        var pending = [bubble];
        
        //6. Create the group to add the bubbles needed
        var group = [];
        
        //7. Loop until there aren't any bubbles pending to process
        while(pending.length > 0){

            //Grab and delete the last element in the array
            var processingBubble = pending.pop();
            //If this is already checked, continue
            if(processingBubble.processed){
                continue;
            }
            
            //Check if the type matches
            if(processingBubble.type == type){
                //Add the tile to the group
                group.push(processingBubble);
                processingBubble.processed = true;
                
                //We need to check for the neighboring bubbles
                var gridInfo = processingBubble.gridInfo;
                var neighors = getNeighbors(gridInfo.column,gridInfo.row);
                
                //We add the neighbors to the pending array so they
                //can be processed
                pending = pending.concat(neighors);
            }
        }
        
        //Return the group
        return group;
        
    };
    
    //Gets all the neighbors for a given bubble
    //takes into consideration the offsets in a hex grid
    function getNeighbors(column,row){
        var validInputs = column>=0&&column<=columns&&row>=0&&row<=rows;
        if(!validInputs&&grid[column][row]==null){
            return [];
        }
        
        var neighbors = [];
        //NORTH
        if(row>0 && grid[column][row-1]!=null){
            neighbors.push(grid[column][row-1]);
        }
        //SOUTH
        if(row<rows && grid[column][row+1]!=null){
            neighbors.push(grid[column][row+1]);
        }
        //NORTH-EAST
        if(column<columns && grid[column+1][row]!=null){
            neighbors.push(grid[column+1][row]);
        }
        //SOUTH-EAST
        if(row<rows && column<columns && grid[column+1][row+1]!=null){
            neighbors.push(grid[column+1][row+1]);
        }
        
        //NORTH-WEST
        if(column>0 && grid[column-1][row]!=null){
            neighbors.push(grid[column-1][row]);
        }
        //SOUTH-WEST
        if(row<rows && column > 0 && grid[column-1][row+1]!=null){
            neighbors.push(grid[column-1][row+1]);
        }
        
        
        return neighbors;
    };
    
    //The checked flag avoids checking the same bubble twice
    //when finding groups.
    function resetChecked(){
        for(var column=0;column<columns;column++){
            for(var row=0;row<rows;row++){
                if(grid[column][row]!=null){
                    grid[column][row].checked = false;
                }
            }
        }
    };
    
});
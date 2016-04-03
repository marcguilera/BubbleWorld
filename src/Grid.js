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
        
        //Update columns and rows
        columns = Math.max(column+1,columns);
        rows = Math.max(row+1,rows);
        
        return bubble;
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
        var valid = validateCell(column,row);
        if(valid){
            grid[column][row].remove();
            grid[column][row] = null;
        }  
    };
    
    //Handles collision between an extern bubble and one
    //from within the grid
    this.collide = function(bubble, gridBubble){
        console.log('Computing collisions in the grid');

        //Snap the bubble in place
        var snappedBubble = snapBubble(bubble,gridBubble);
        var gridInfo = snappedBubble.gridInfo;
        
        var group = findGroup(gridInfo.column,gridInfo.row, snappedBubble.type);
        
        console.log('Found a group of '+group.length);
        
        if(group.length>=3){
            for(var i=0;i<group.length;i++){
                var position = group[i].gridInfo;
                dropBubbleAt(position.column,position.row);
            }
            performGravity();
        }
        

    };
    
    function dropBubbleAt(column,row){
        var validInputs = validateCell(column,row);
        if(validInputs){
            removeBubbleAt(column,row);
        }
    };
    
    //Erases the bubbles that are floating in the air
    function performGravity(){
        
    };
    
    function validateCell(column,row){
        var withinRange = column>=0&&column<columns&&row>=0&&row<rows;
        if(withinRange){
            return grid[column][row] != null;
        }else{
            return false;
        }
    }

    function snapBubble(bubble,gridBubble){
        //1 Get the center of the comming bubble
        var x = bubble.x+bubble.width/2;
        var y = bubble.y+bubble.height;
        
        //2 Find the closest actual legal cell
        var gridPosition = getGridPosition(x,y);

        var b = addBubbleAt(gridPosition.column,gridPosition.row,bubble.type);
        
        return b;
    };

    //Finds groups of tiles given the tile at a certain location
    //and matching the given type. This could be done with recursion
    //but i feel without it's much more readable and reusable.
    function findGroup(column, row, type){
        //1. Reset checked state
        resetChecked();

        
        //2. If there just isn't a bubble in the cell, leave
        var validInputs = validateCell(column,row);

        if(!validInputs){
            return [];
        }
        
        //3. Grab the desired bubble
        var bubble = grid[column][row];
        
        //4. Create the array of bubbles to check and include the starting one
        var pending = [bubble];
        
        //5. Create the group to add the bubbles needed
        var group = [];
        
        //6. Loop until there aren't any bubbles pending to process
        while(pending.length > 0){
            
            //Grab and delete the last element in the array
            var processingBubble = pending.pop();
            if(!processingBubble.processed && processingBubble.type == type){
                //Add the tile to the group
                group.push(processingBubble);
                
                //We need to check for the neighboring bubbles
                var gridInfo = processingBubble.gridInfo;
                var neighors = getNeighbors(gridInfo.column,gridInfo.row);
                
                for(var i=0;i<neighors.length;i++) neighors[i].showHitBounds();
                
                //We add the neighbors to the pending array so they
                //can be processed
                pending = pending.concat(neighors);
            }
            
            processingBubble.processed = true;
        }
        
        //Return the group
        return group;
        
    };
    
    //Gets all the neighbors for a given bubble
    //takes into consideration the offsets in a hex grid
    function getNeighbors(column,row){
        var validInputs = validateCell(column,row);
        if(!validInputs){
            return [];
        }
        
        var neighbors = [];
        
        
        //They depend on if the column is odd or even
        //For odd -> (c,r-1),(c,r+1),(c-1,r),(c-1,r+1),(c+1,r),(c+1,r+1)
        //For even -> (c,r-1),(c,r+1),(c-1,r-1),(c-1,r),(c+1,r-1),(c+1,r)
        
        //NORTH
        if(validateCell(column,row-1)){
            neighbors.push(grid[column][row-1]);
        }
        
        //SOUTH
        if(validateCell(column,row+1)){
            neighbors.push(grid[column][row+1]);
        }
        
        if(column%2){ //ODD
            //NORTH-WEST
            if(validateCell(column-1,row)){
                neighbors.push(grid[column-1][row]);
            }
            //SOUTH-WEST
            if(validateCell(column-1,row+1)){
                neighbors.push(grid[column-1][row+1]);
            }
            //NORTH-EAST
            if(validateCell(column+1,row)){
                neighbors.push(grid[column+1][row]);
            }
            //SOUTH-EAST
            if(validateCell(column+1,row+1)){
                neighbors.push(grid[column+1][row+1]);
            }
        }else{ //EVEN
            //NORTH-WEST
            if(validateCell(column-1,row-1)){
                neighbors.push(grid[column-1][row-1]);
            }
            //SOUTH-WEST
            if(validateCell(column-1,row)){
                neighbors.push(grid[column-1][row]);
            }
            //NORTH-EAST
            if(validateCell(column+1,row-1)){
                neighbors.push(grid[column+1][row-1]);
            }
            //SOUTH-EAST
            if(validateCell(column+1,row)){
                neighbors.push(grid[column+1][row]);
            }
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
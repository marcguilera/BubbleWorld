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
    function addBubbleAt(column,row){
        removeBubbleAt(column,row);
        
        var bubbleSettings = getBubbleCoordinate(column,row);
        bubbleSettings.radius = radius;
        
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
        
        return { x: x, y: y };
    }
    
    //Removes the bubble in a given position in the grid
    function removeBubbleAt(column,row){
        if(grid[column][row]){
            grid[column][row].remove();
            grid[column][row] = null;
        }  
    };
    
    this.collide = function(otherBubble, gridBubble){
        
    };
    
});
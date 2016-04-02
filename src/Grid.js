import scene.group.Group as Group;

import src.Bubble as Bubble;

//Creates a hexagonal grid of bubbles given rows, columns
//It is a group so it can be added wherever (reusable).
//It handles the creation and addition of its own bubbles
exports = Class(Group, function (supr) {
    
    var radius;
    
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
        
        this.build(); 
    };
    
    //Creates the grid and its bubbles
    this.build = function(){
        var bubble = this.addActor();
        
        //bubble.randomize();
        
    };
    
});
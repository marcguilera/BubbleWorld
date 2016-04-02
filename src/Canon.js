import scene;
import scene.group.Group as Group;
import event.Emitter as Emitter;

import src.Bubble as Bubble;

//Creates a hexagonal grid of bubbles given rows, columns
//It is a group so it can be added wherever (reusable).
//It handles the creation and addition of its own bubbles
exports = Class(Group, function (supr) {

    var bubble = null;
    var radius;
    var speed;
    var bubbleLaunched;
    
    this.init = function (opts) {
        this.name = "Canon";
        
        radius = opts.radius || 100;
        speed = opts.speed || 100;
        
        supr(this, 'init', opts);  
        
        //Make sure the actors created by this group are of type
        //bubble
        this._ctor = Bubble;

        this.build(); 
        
    };
    
    //Prepares the canon
    this.build = function(){
        this.createBubble();
    };
    
    //Creates a bubble rady to launch
    this.createBubble = function(){
        //If there is already a bubble in there forget it!
        if(bubble){
            return;
        }
        
        bubble = this.addActor({
            x: scene.screen.width/2-radius,
            y: scene.screen.height-200,
            radius: radius
        });
    };
    
    this.launchTo = function(x,y){
        //If there is nothing to launch, bye
        if(bubble==null){
            return;
        }
        
        //Bombs away!
        bubble.headToward(x-radius, y-radius, speed);
        this.onLaunched(bubble);
        
        //Remove the bubble from the canon
        bubble = null;
    };
    
    this.onLaunched = function(bubble){};
    
});
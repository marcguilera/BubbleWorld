import scene;
import scene.group.Group as Group;
import event.Emitter as Emitter;

import src.Bubble as Bubble;

//Creates a hexagonal grid of bubbles given rows, columns
//It is a group so it can be added wherever (reusable).
//It handles the creation and addition of its own bubbles
exports = Class(Group, function (supr) {

    var radius;
    var speed;
    var _this;
    var x,y;
    var queue;
    
    this.init = function (opts) {
        this.name = "Canon";
        
        radius = opts.radius || 100;
        speed = opts.speed || 100;
        
        supr(this, 'init', opts);  
        
        //Make sure the actors created by this group are of type
        //bubble
        this._ctor = Bubble;
        
        x = scene.screen.width/2-radius;
        y = scene.screen.height-170;
        
        this.build();
    };
    

    //Prepares the canon
    this.build = function(){
        queue = [];
        this.createBubble();
        this.createBubble();
        this.createBubble();
    }
    
    //Creates a bubble rady to launch
    this.createBubble = function(){
        if(queue.length<3){
            var bubble = this.addActor({
                x: scene.screen.width/2-radius,
                radius: radius
            });
            
            queue.push(bubble);
            
            for(var i=0;i<queue.length;i++){
                queue[i].y=scene.screen.height-170+i*70;
            }
        }
    };
    
    this.launchTo = function(x,y){
        if(queue.length>=3){
            var bubble = queue.shift();
            bubble.headToward(x-radius, y-radius, speed);
            this.onLaunched(bubble);
        }
    };

    
});
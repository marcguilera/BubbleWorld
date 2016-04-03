import scene;
import scene.actor.Actor as Actor;
import ui.resource.Image as Image;


exports = Class(Actor, function (supr) {
    var suprPrototype = Actor.prototype;
    var BUBBLE;
    var image;
    
    
    this.init = function (opts) {
        this.name = "Bubble";
        BUBBLE = GLOBAL.bubbleTypes;
        supr(this, 'init', opts); 
        
    }
    
    //This actually sets the bubble,
    //this is called also to reclycle the
    //bubble. It's handled by the EntityPool
    this.reset = function (opts) {
        opts = opts || {};
        opts.radius = opts.radius || 100;
        opts.width = opts.width || opts.radius*2;
        opts.height = opts.height || opts.radius*2;
        
        this.type = opts.type || Math.floor((Math.random() * 5)+1);
        
        opts.image = getImageForType(this.type);
        
        //A little bit smaller than the actual radius so the player can actually
        //aim. Not big enough to go through bubbles, of course.
        opts.hitOpts = {
            radius : opts.radius*.8,
            offsetX: opts.radius,
            offsetY: opts.radius
        };
        
        
        suprPrototype.reset.call(this,opts);
        
        //Destroy the bubble when it leaves the screen
        this.onTick(function(){
            if(this.x+this.width*2<0 || this.x-this.width*2>scene.camera.height || this.y+this.height*2<0 || this.y-this.height*2>scene.camera.height){
                this.remove();
            }
        });
        
        
         
    };

    this.remove = function(){
        //Back to the pool
        this.destroy();
    };
    
    
    
    function getImageForType(_type){
        switch(_type){
            case BUBBLE.NONE: return null; 
            case BUBBLE.RED: return 'resources/images/bubbles/red_bubble.png'; 
            case BUBBLE.BLUE: return 'resources/images/bubbles/blue_bubble.png';
            case BUBBLE.ORANGE: return 'resources/images/bubbles/orange_bubble.png'; 
            case BUBBLE.PINK: return 'resources/images/bubbles/pink_bubble.png';
            case BUBBLE.GREEN: return 'resources/images/bubbles/green_bubble.png';
            default: return null; //none of the good options, bye!
        }
    };
    
});
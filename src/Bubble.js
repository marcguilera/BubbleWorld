import scene.actor.Actor as Actor;
import ui.resource.Image as Image;


exports = Class(Actor, function (supr) {
    var suprPrototype = Actor.prototype;
    var type;
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
        
        type = opts.type || Math.floor((Math.random() * 5));
        
        opts.image = getImageForType(type);
        
        opts.hitOpts = {
            radius : opts.width/3,
            offsetX: opts.width/2,
            offsetY: opts.width/2
        };
        
        suprPrototype.reset.call(this,opts)
        
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
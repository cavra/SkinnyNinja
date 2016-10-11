Skinny_Ninja.level_0 = function(game) { 
	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;    //  the tween manager
    this.state;	    //	the state manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator
    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
};

//variables for the classes
var hero = null;
var enemy = null;
var item = null;
var gui = null;
var pause = null;

//variables for the world, which is defined here
var map = null;
var layer_ground = null;
var layer_walls = null;
var layer_overlay = null;
var layer_triggers = null;

//global variables
var game_timer = null;
var music = null;

Skinny_Ninja.level_0.prototype = {

	create: function () {

        //necessary for slow motion
    	this.game.time.advancedTiming = true;
        this.game.time.desiredFps = 60;
        this.game.time.slowMotion = 1.0;

        //start the game timer
        game_timer = this.game.time.create(false);
        game_timer.start();

        //start the music
        music = this.game.add.audio('song', 0.5, true);
        music.play();

        //create the pause instance
    	pause = new Pause(this.game);

        //build level
        this.build_world();
        this.build_player();
        this.build_enemies();
        this.build_items();
    	this.build_GUI();
    	
	},

    build_world: function () {

        //the world
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //background
        this.background = this.add.tileSprite(0, 0, 6400, 600, 'background_far');
        this.background.fixedToCamera = true;
        //this.background_near = this.add.tileSprite(0, 0, 3200, 3200, 'background_near');

        //tilemap
        map = this.game.add.tilemap('map_level_0');

        //the first parameter is the tileset name as specified in Tiled
        //the second is the key to the asset
        map.addTilesetImage('spritesheet', 'tiles_spritesheet');

        //create layers
        layer_ground = map.createLayer('tile_ground');
        layer_walls = map.createLayer('tile_walls');
        layer_overlay = map.createLayer('tile_overlay');
        layer_triggers = map.createLayer('tile_triggers');

        //collision on blockedLayer
        map.setCollisionBetween(1, 1000, true, 'tile_ground');
        map.setCollisionBetween(1, 1000, true, 'tile_walls');
        map.setCollisionBetween(1, 1000, true, 'tile_triggers');

        //resizes the game world to match the layer dimensions
        layer_ground.resizeWorld();

    },

    build_player: function () {
        
        //create an instance for the player
        hero = new Hero(this.game); 
        
        //create the player
        hero.create();
    
    }, 

    build_enemies: function () {
    
        //create an instance for the enemies
        enemy = new Enemy(this.game);
        
        //create the enemies
        //type 0 = ninja
        enemy.create(0);
        
        //type 1 = ghost
        enemy.create(1);

    },
    
    build_items: function () {
        
        //create an instance for the items
        item = new Item(this.game);
        
        //create the items
        //type 0 = katana_0
        item.create(0, 256, 1248);
        
        //type 1 = ruby (doesn't exist upon creation)
        item.create(1, this.game.world.width - 150, 100);
        
    },
    
    build_GUI: function () {
    
        //create an instance for the GUI
        gui = new GUI(this.game);
        
        //create the GUI
        gui.create();
    
    }, 

	update: function () {
	    
	    //update all necessary objects
        hero.update();
        enemy.update();
        item.update();
        gui.update(); 

	},

    render: function () {
    
    	//for (var i = 0; i < ledge_trigger.length; i++)
    	//this.game.debug.geom(ledge_trigger.getAt(i).getBounds());

        //for (var i = 0; i < ninjas.length; i++)
        //this.game.debug.geom(aggro_trigger[i].getBounds());
        //this.game.debug.geom(ninjas.getAt(i).getBounds());
        //this.game.debug.timer(idle_timer[1], 200, 50);
        //this.game.debug.timer(run_timer[1], 200, 120);
        
        //this.game.debug.geom(katana_0.getBounds());

    },	
    
	shutdown: function () {
        
        this.world.shutdown();
        
        //in case player was invisible
        this.game.time.slowMotion = 1.0;

        //let the game read input again, just in case
        this.game.input.enabled = true;

	    //destroy the sprites
	    player.destroy();
        ninjas.destroy(true, false);
        ghosts.destroy(true, false);
        items_group.destroy(true, false);
        
        //destroy the world
        map.destroy();
        layer_ground.destroy();
        layer_walls.destroy();
        layer_overlay.destroy();
        this.background.destroy();

        //just a sweeper
        this.game.world.removeAll(); 
    
        //take care of various elements
        score = 0;
        music.stop();
        this.time.reset;
	},

};
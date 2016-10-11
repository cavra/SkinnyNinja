BasicGame.level_0 = function (game) { 
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

var hero;
var enemy;
var item;
var gui;
var pause;

var grounds;
var walls;
var ledges;
var ledge_trigger;

var game_timer = null;
var music = null;

BasicGame.level_0.prototype = {

	create: function () {

        //start the game timer
        game_timer = this.game.time.create(false);
        game_timer.start();

        //start the music
        music = this.game.add.audio('song', 0.5, true);
        music.play();

        //create pause instance
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
        this.game.world.setBounds(0, 0, 3200, 600);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //background
        this.background = this.add.tileSprite(0, -200, 6400, 600, 'background_far');
        this.background.fixedToCamera = true;
        this.background_near = this.add.tileSprite(0, 0, 6400, 600, 'background_near');
        
        //the ground
        grounds = this.game.add.group();
        grounds.enableBody = true;
        
    	for (var i = 0; i < this.game.world.width/800; i++)
        {
            this.ground = grounds.create(i * 800, this.world.height - 64, 'ground');
            this.ground.scale.setTo(2, 2);
            this.ground.body.immovable = true;
        }
    	
    	//the ledges
    	ledges = this.game.add.group();
        ledges.enableBody = true;
        
    	for (var i = 1; i < this.game.world.width/800; i++)
        {
            this.ledge = ledges.create(i * 800, 400, 'ground');
            this.ledge.body.immovable = true;
        }
        
    	this.ledge = ledges.create(184, 100, 'ground');
    	this.ledge.body.immovable = true;
    	
    	//the walls
    	walls = this.game.add.group();
        walls.enableBody = true;
        
    	this.ledge = walls.create(0, 100, 'wall');
    	this.ledge.body.immovable = true;
    	this.ledge = walls.create(200, 100, 'wall');
    	this.ledge.body.immovable = true;
        this.ledge.anchor.setTo(0.5, 0);
        this.ledge.scale.x = -1;
    	
        //the ledge trigger (for enemies; transparent)
        ledge_trigger = this.game.add.group();
        ledge_trigger.enableBody = true;

    	for (var i = 0; i < ledges.length; i++)
        {
            var x = ledges.getAt(i).x;
            var y = ledges.getAt(i).y;
            var xx = ledges.getAt(i).body.x + ledges.getAt(i).body.width;
            
            //create 2 triggers, one for each end of a ledge
            this.trigger = ledge_trigger.create(x, y, 'singularity');
            this.trigger.body.immovable = true;
            this.trigger.anchor.setTo(1, 1);
            this.trigger.scale.setTo(10, 30);
            this.trigger.alpha = 0;

            this.trigger = ledge_trigger.create(xx , y, 'singularity');
            this.trigger.body.immovable = true;
            this.trigger.anchor.setTo(0, 1);
            this.trigger.scale.setTo(10, 30);
            this.trigger.alpha = 0;
        }
    	
    },

    build_player: function () {
        
        //create an instance for the player
        hero = new Hero(this.game); 
        
        //create the player
        hero.create(50, 500);
    
    }, 

    build_enemies: function () {
    
        //create an instance for the enemies
        enemy = new Enemy(this.game);
        
        //create the enemies
        //type 0 = ninja
        enemy.create(0, 400, 400);
        enemy.create(0, 1500, 400);
        enemy.create(0, 1600, 400);
        enemy.create(0, 450, 40);
        enemy.create(0, 840, 300);
        
        //type 1 = ghost
        enemy.create(1, 500, 40);

    },
    
    build_items: function () {
        
        //create an instance for the items
        item = new Item(this.game);
        
        //create the items
        //type 0 = katana_0
        item.create(0, 400, 80);
        
        //type 1 = ruby (doesn't exist upon creation)
        item.create(1, null, null);
        
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
        
        //this.game.debug.geom(aggro_trigger.getBounds());
        //this.game.debug.geom(katana_0.getBounds());
        //this.game.debug.timer(idle_timer[1], 200, 50);
        //this.game.debug.timer(run_timer[1], 200, 120);

    },	
    
	shutdown: function () {
	    
	    player.destroy();

        grounds.destroy(true, false);
        ledges.destroy(true, false);
        walls.destroy(true, false);
        ninjas.destroy(true, false);
        ghosts.destroy(true, false);
        items_group.destroy(true, false);
        
        this.background.stopScroll();
        this.background.alive = false;
        this.background.exists = false;
        this.background.visible = false;
    
        this.game.world.removeAll(); //just a sweeper
    
        score = 0;
        music.stop();
        this.time.reset;
	},

};
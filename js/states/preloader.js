Skinny_Ninja.preloader = function(game) {

	this.background = null;
	this.loading_bar = null;

	this.ready = false;
	
};

Skinny_Ninja.preloader.prototype = {

	preload: function() {
		
		//states
		this.preload_boot();
		this.preload_menu();

		//game
		this.preload_world();
		this.preload_GUI();
		this.preload_items();
		this.preload_player();
		this.preload_enemies();

	},
	
	preload_boot: function() {

		//has to be in preload, because it won't create the sprite otherwise
		this.background = this.add.sprite(0, 0, 'preload_background');
		this.loading_bar = this.add.sprite(this.game.world.centerX - 200, 500, 'loading_bar');
		
		//loads a portion of the image corresponding to amount of assets loaded below
		this.load.setPreloadSprite(this.loading_bar);
	
	},

	preload_menu: function() {
		
		//background
		this.load.image('menu_background', 'assets/textures/GUI/menu.png');
		
		//GUI
		this.load.spritesheet('play_button', 'assets/textures/GUI/beginbutton.png', 64, 23);

		//Tweens
		this.load.image('egg_face', 'assets/textures/world/egg_face.png')
		
		//audio
		this.load.audio('menu_music', ['assets/audio/BG-0.wav']);	
		
	},
	
	preload_world: function() {
		
		//tilemaps
		this.load.tilemap('map_level_0', 'assets/textures/world/level_0/level_0.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('tiles_spritesheet', 'assets/textures/world/level_0/tiles_spritesheet.png');

   	    //backgrounds
	    this.load.image('background_far', 'assets/textures/world/background_far.png');
	    this.load.image('background_near', 'assets/textures/world/background_near.png');

		//pixel for creating triggers, invisibile walls, etc
		this.load.image('singularity', 'assets/textures/world/singularity.png');
		
		//audio
	    this.load.audio('song', ['assets/audio/BG-0.wav']);
		
	},
	
	preload_GUI: function() {

		//HUD
	    this.load.image('blur', 'assets/textures/GUI/vignette.png');
	    this.load.image('hud', 'assets/textures/GUI/hud.png');
		this.load.spritesheet('health', 'assets/textures/GUI/health.png', 150, 50);
		this.load.spritesheet('mana', 'assets/textures/GUI/mana.png', 150, 50);
		this.load.spritesheet('power', 'assets/textures/GUI/power.png', 150, 50);
	  
		//pause screen
	    this.load.image('inventory', 'assets/textures/GUI/inventory.png');
	    this.load.image('pause_screen', 'assets/textures/GUI/pause_screen.png');

	},
	
	preload_items: function() {
		
		//weapons
	    this.load.image('sword', 'assets/textures/items/item_sword.png');
	    this.load.atlasXML('sword_player', 'assets/textures/player/player_sword.png', 'assets/textures/player/swords.xml');
   	    this.load.spritesheet('ninja_stars', 'assets/textures/items/ninja_stars.png', 15, 15);
   	    
   	    //collectables 
   	    this.load.image('ruby', 'assets/textures/items/ruby.png');
   	    this.load.spritesheet('power_item', 'assets/textures/items/item_power.png', 10, 10);
   	    
	},

	preload_player: function() {
		
		//the player
	    this.load.spritesheet('player', 'assets/textures/player/player1.png', 32, 32);
	    
	    //audio
	    this.load.audio('jump', ['assets/audio/jump.m4a']);
	    this.load.audio('item', ['assets/audio/item.mp3']);
	    this.load.audio('swish', ['assets/audio/swish1.mp3']);	
	    
	},
	
	preload_enemies: function() {
		
		//enemies
		this.load.spritesheet('enemy', 'assets/textures/NPC/enemy_ninja.png', 32, 32);
		this.load.spritesheet('ghost', 'assets/textures/NPC/enemy_ghost.png', 18, 32);
		
	},
	
	create: function() {

		//once everything has been preloaded, stop cropping the preload bar
		this.loading_bar.cropEnabled = false;

	},

	update: function() {

		//if the music is ready to play, start the main menu
		if (this.cache.isSoundDecoded('menu_music') && this.ready == false)
		{
			this.ready = true;
			this.state.start('main_menu');
		}

	}

};
BasicGame.preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;
	
};

BasicGame.preloader.prototype = {

	preload: function () {

//MAIN MENU
		this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.preloadBar = this.add.sprite(this.game.world.centerX - 200, 500, 'preloaderBar');

		this.load.setPreloadSprite(this.preloadBar);

		this.load.image('menuBackground', 'assets/textures/GUI/menu.png');
		this.load.spritesheet('playButton', 'assets/textures/GUI/beginbutton.png', 64, 23);
		this.load.audio('titleMusic', ['assets/audio/BG-0.wav']);

//GAME
	//world
   	    this.load.image('ground', 'assets/textures/world/ground.png');
   	    this.load.image('wall', 'assets/textures/world/ground_vertical.png');
	    this.load.image('background_far', 'assets/textures/world/background_far.png');
	    this.load.image('background_near', 'assets/textures/world/background_near.png');

	    this.load.image('singularity', 'assets/textures/world/singularity.png');
	
	//GUI
	    this.load.image('hud', 'assets/textures/GUI/hud.png');
		this.load.spritesheet('health', 'assets/textures/GUI/health.png', 150, 50);
		this.load.spritesheet('mana', 'assets/textures/GUI/mana.png', 150, 50);
		this.load.spritesheet('power', 'assets/textures/GUI/power.png', 150, 50);
	    this.load.image('inventory', 'assets/textures/GUI/inventory.png');
	    this.load.image('pause_screen', 'assets/textures/GUI/pause_screen.png');

	//items
	    this.load.image('sword', 'assets/textures/items/sword_item.png');
	    this.load.atlasXML('swordHeld', 'assets/textures/xml/player_sword.png', 'assets/textures/xml/swordHeld.xml');
   	    this.load.image('ruby', 'assets/textures/items/ruby.png');
   	    this.load.spritesheet('power_item', 'assets/textures/items/power_item.png', 10, 10);

   	//player    
	    this.load.spritesheet('player', 'assets/textures/player/player_deadpool.png', 32, 32);
	
	//enemies    
		this.load.spritesheet('enemy', 'assets/textures/NPC/enemy_ninja.png', 32, 32);
		this.load.spritesheet('ghost', 'assets/textures/NPC/enemy_ghost.png', 18, 32);
	
	//audio	
	    this.load.audio('song', ['assets/audio/BG-0.wav']);
	    this.load.audio('jump', ['assets/audio/jump.m4a']);
	    this.load.audio('item', ['assets/audio/item.mp3']);
	    
	},

	create: function () {

		this.preloadBar.cropEnabled = false;

	},

	update: function () {

		if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		{
			this.ready = true;
			this.state.start('main_menu');
		}

	}

};
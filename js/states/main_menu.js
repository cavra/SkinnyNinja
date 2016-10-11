Skinny_Ninja.main_menu = function(game) {

	this.music = null;
	this.play_button = null;
	this.play_rectangle = null;
	this.emitter = null;
	this.tween_egg = null;

};

Skinny_Ninja.main_menu.prototype = {

	create: function() {

		//background
		this.add.sprite(0, 0, 'menu_background');
		
		//audio
		this.music = this.add.audio('menu_music', 0.5, true);
		this.music.play();
		
		this.create_buttons();
		this.create_emitter();
		this.create_tweens();
		
	},
	
	create_buttons: function() {
		
		//button
		this.play_button = this.add.button(600, 470, 'play_button', this.start_game, this, 1, 0, 0);
	    this.play_button.scale.set(3);
	    this.play_button.buttonMode = true;
		//this.playButton.setOverSound(sound, marker);

		//rectangle for button
	    this.play_rectangle = new Phaser.Rectangle(this.play_button.x, this.play_button.y, this.play_button.width, this.play_button.height);

	},
	
	create_emitter: function() {

		this.emitter = this.game.add.emitter(0, 0, 100);
		
		this.emitter.makeParticles('ruby');
		this.emitter.gravity = 200;
		this.emitter.bounce.setTo(0.5, 0.5);
		this.emitter.angularDrag = 30;
		//this.emitter.minParticleSpeed.setTo(-200, -300);
		//this.emitter.maxParticleSpeed.setTo(200, -400);
		
		this.game.input.onDown.add(this.particle_burst, this);

	},

	create_tweens: function() {
	
		//egg face
		this.tween_egg = this.add.sprite(1000, 600, 'egg_face');
		
		this.tween_egg.scale.setTo(2, 2);
		this.tween_egg.anchor.setTo(1, 1);
		this.tween_egg.alpha = -1; //-2 -> 0.5
		
		this.add.tween(this.tween_egg).to( { alpha: 1 }, 4000, Phaser.Easing.Linear.None, true, 0, 1000, true);
		
	},

	update: function() {

		this.play_button.bringToTop()

	},

	particle_burst: function(pointer) {

		//if the player didn't click the button, activate emitter
        if (!this.play_rectangle.contains(this.game.input.x, this.game.input.y)) {
		    //Position the emitter where the mouse/touch event was
		    this.emitter.x = pointer.x;
		    this.emitter.y = pointer.y;
		
		    //The first parameter sets the effect to "explode" which means all particles are emitted at once
		    //The second gives each particle a 2000ms lifespan
		    //The third is ignored when using burst/explode mode
		    //The final parameter (10) is how many particles will be emitted in this single burst
		    this.emitter.start(true, 3000, null, 10);
        }
        
	},

	start_game: function(pointer) {
	
		this.music.stop();
		this.state.start('level_0');
	}

};
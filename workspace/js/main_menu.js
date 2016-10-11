
BasicGame.main_menu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.main_menu.prototype = {

	create: function () {

		this.music = this.add.audio('titleMusic', 0.5, true);
		this.music.play();

		this.add.sprite(0, 0, 'menuBackground');
		
		this.playButton = this.add.button(720, 470, 'playButton', this.startGame, this, 1, 0, 0);
		//this.playButton.setOverSound(sound, marker);

	    this.playButton.anchor.setTo(0.3, 0.3);
	    this.playButton.scale.setTo(3, 3);

	},

	update: function () {

		//some nice funky main menu effect

	},

	startGame: function (pointer) {

		this.music.stop();
		this.state.start('level_0');
	}

};
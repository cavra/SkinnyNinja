function Pause(game) {
    this.game = game;
    this.phase = null;
    
    //keypresses
    this.keypress_pause = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    this.keypress_pause.onUp.add(this.pause_game, this);

    //groups
    this.menu_group = null;
    
    //background
    this.backdrop = null;
    
    //text
    this.quit_label = null;
    this.mute_label = null;

    //input receiving rectangles
    this.quit_button = null;
    this.mute_button = null;

    //statuses
    this.music_status = false;
}

Pause.prototype.pause_game = function() {

    //add an event listener to unpause
    this.keypress_pause.onDown.add(this.unpause, this);
    
    //add an event listener to check for buttons
    this.game.input.onDown.add(this.check_input, this);
    
    //pause the game
    this.game.paused = true;

    //create the pause screen
    this.create_screen();
};

Pause.prototype.create_screen = function() {
    
    //define middle of screen
    this.midX = this.game.camera.x + this.game.width/2;
    this.midY = this.game.camera.y + this.game.height/2;

    //create group
    this.menu_group = this.game.add.group();
    
    //backdrop
    this.backdrop = this.menu_group.create(this.midX, this.midY, 'pause_screen');
    this.backdrop.scale.setTo(1.4, 1.4);
    this.backdrop.anchor.setTo(0.5, 0.5);
    this.backdrop.angle = 90;
    
    //text and rectangles to simulate buttons
    this.quit_label = this.game.add.text(this.midX, this.midY,  'Exit Game', { fontSize: '32px'});
    this.quit_button = new Phaser.Rectangle(this.game.width/2, this.game.height/2, this.quit_label.width, this.quit_label.height);
    this.menu_group.addChild(this.quit_label);

    this.mute_label = this.game.add.text(this.midX - 100, this.midY,  'Mute', { fontSize: '32px'});
    this.menu_group.addChild(this.mute_label);
    this.mute_button = new Phaser.Rectangle(this.game.width/2 - 100, this.game.height/2, this.mute_label.width, this.mute_label.height);
    
};
  
Pause.prototype.check_input = function() {
    
    //if the game is paused, check if the user clicked on the pseudo buttons
    if (this.game.paused) {
        
        //quit button
        if (this.quit_button.contains(this.game.input.x, this.game.input.y)) {
            this.exit();
        }
        
        //mute button
        else if (this.mute_button.contains(this.game.input.x, this.game.input.y)) {
            this.mute();
        }
    }

};

Pause.prototype.unpause = function(event) {
    
    if (this.game.paused)
    {
        //unpause the game
        this.game.paused = false;
        
        //kill the pause screen
        this.menu_group.destroy(true, false);
        this.backdrop.destroy();
        
        this.quit_label.destroy();
        this.mute_label.destroy();
        
        this.quit_button = null;
        this.mute_button = null;
    }
    
};

Pause.prototype.mute = function() {
    
    if(!this.music_status)
    {
        music.pause();
        this.mute_label.fill = 'red';
        this.music_status = true;
    }
    else if(this.music_status)
    {
        music.resume();
        this.mute_label.fill = 'blue';
        this.music_status = false;
    }
    
};

Pause.prototype.exit = function() {
    
    if (this.game.paused) this.game.paused = false;

    this.game.camera.reset();

    this.game.state.start('main_menu');

};

var pause_key = null;
    
function Pause(game) {
    this.game = game;
    this.phase = null;
    
    pause_key = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    pause_key.onUp.add(this.pause_game, this);

    this.menu_group = null;
    
    this.backdrop = null;
    this.quit_label = null;
    this.mute_label = null;

    this.quit_button = null;
    this.mute_button = null;

    this.music_status = false;
}

Pause.prototype.pause_game = function() {

    pause_key.onDown.add(this.unpause, this); //add an event listener to unpause
    this.game.input.onDown.add(this.check_input, this); //add an event listener to check for buttons
    
    this.game.paused = true;
    
    this.create_screen();
};

Pause.prototype.create_screen = function() {
    
    this.midX = this.game.camera.x + this.game.width/2;
    this.midY = this.game.camera.y + this.game.height/2;

    this.menu_group = this.game.add.group();
    
    //backdrop
    this.backdrop = this.menu_group.create(this.midX, this.midY, 'pause_screen');
    this.backdrop.scale.setTo(1.4, 1.4);
    this.backdrop.anchor.setTo(0.5, 0.5);
    this.backdrop.angle = 90;
    
    //buttons
    this.quit_label = this.game.add.text(this.midX, this.midY,  'Exit Game', { fontSize: '32px'});
    this.quit_button = new Phaser.Rectangle(this.game.width/2, this.game.height/2, this.quit_label.width, this.quit_label.height);
    this.menu_group.addChild(this.quit_label);

    this.mute_label = this.game.add.text(this.midX - 100, this.midY,  'Mute', { fontSize: '32px'});
    this.menu_group.addChild(this.mute_label);
    this.mute_button = new Phaser.Rectangle(this.game.width/2 - 100, this.game.height/2, this.mute_label.width, this.mute_label.height);
    
};
  
Pause.prototype.check_input = function() {
    
    if (this.game.paused){
        if (this.quit_button.contains(this.game.input.x, this.game.input.y))
        {
        this.exit();
        }
        else if (this.mute_button.contains(this.game.input.x, this.game.input.y))
        {
        this.mute();
        }
    }

};

Pause.prototype.unpause = function(event) {
    if (this.game.paused)
    {
      this.game.paused = false;
      
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
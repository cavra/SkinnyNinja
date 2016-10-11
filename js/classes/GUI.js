//global variables
var score = 0;

function GUI(game) {
    this.game = game;

    this.HUD = null;
    this.inventory = null;
    this.health_bar_empty = null;
    this.health_bar_full = null;
    this.mana_bar_empty = null;
    this.mana_bar_full = null;
    this.power_bar_empty = null;
    this.power_bar_full = null;

    this.health_width = null;
    this.crop_health = null;
    this.mana_width = null;
    this.crop_mana = null;
    this.power_width = null;
    this.crop_power = null;
    
    this.bar_width = null;

    this.text_left = null;
    this.text_right = null;
    this.text_score = null;
    this.text_timer = null;
    this.text_fps = null;

}

GUI.prototype.create = function() {
    
    this.create_HUD();
    this.create_text();
};

GUI.prototype.create_HUD = function() {
    
    this.HUD = this.game.add.group();
    this.HUD.setAll('fixedToCamera', true);

    //this.hud = this.HUD.create(0, this.game.height, 'blur');
    //this.hud.fixedToCamera = true;
    //this.hud.anchor.setTo(0, 1);
    //this.hud.alpha = 10.9;
    //this.hud.tint = 0xFF0000;
  
    this.bar_width = 150;

    this.inventory = this.HUD.create(this.bar_width*2, this.game.height, 'inventory');
    this.inventory.fixedToCamera = true;
    this.inventory.anchor.setTo(0, 1);

    //health
    this.health_bar_empty = this.HUD.create(0, this.game.height, 'health');
    this.health_bar_empty.fixedToCamera = true;
    this.health_bar_empty.anchor.setTo(0, 1);
    this.health_bar_empty.frame = 1;

    this.health_bar_full = this.HUD.create(0, this.game.height, 'health');
    this.health_bar_full.fixedToCamera = true;
    this.health_bar_full.anchor.setTo(0, 1);
    this.health_bar_full.frame = 0;

    //mana
    this.mana_bar_empty = this.HUD.create(this.bar_width, this.game.height, 'mana');
    this.mana_bar_empty.fixedToCamera = true;
    this.mana_bar_empty.anchor.setTo(0, 1);
    this.mana_bar_empty.frame = 1;
    
    this.mana_bar_full = this.HUD.create(this.bar_width, this.game.height, 'mana');
    this.mana_bar_full.fixedToCamera = true;
    this.mana_bar_full.anchor.setTo(0, 1);
    this.mana_bar_full.frame = 0;

    //power
    this.power_bar_empty = this.HUD.create(this.game.width - this.bar_width, this.game.height, 'power');
    this.power_bar_empty.fixedToCamera = true;
    this.power_bar_empty.anchor.setTo(0, 1);
    this.power_bar_empty.frame = 1;
    
    this.power_bar_full = this.HUD.create(this.game.width - this.bar_width, this.game.height, 'power');
    this.power_bar_full.fixedToCamera = true;
    this.power_bar_full.anchor.setTo(0, 1);
    this.power_bar_full.frame = 0;

    if(player_health == 5)
    {
        this.health_width = this.health_bar_full.width/5;
    }
    
    if(player_mana == 100)
    {
        this.mana_width = this.mana_bar_full.width/100;
    }
    
    if (player_power === 0)
    {
        this.power_width = this.power_bar_full.width/10;
    }
};

GUI.prototype.create_text = function() {
    
    var style = {
        font: "32px Arial", 
        fill: "#FFFFFF", 
        align: "left", 
        stroke: "black", 
        strokeThickness: 3,
        wordWrap: false,
        wordWrapWidth: 100,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: "black",
        shadowBlur: 10
    };
    
    this.text_score = " Enemies Killed: " + score + ' ';
    this.text_timer = ' Time: ' + (500 - game_timer.seconds.toFixed(0)) + ' ';
    this.text_fps = ' FPS: ' + this.game.time.fps + ' ';
    
    this.text_left = this.game.add.text(8, 8, this.text_score + "\n" + this.text_timer, style);
    this.text_left.fixedToCamera = true;
    this.text_left.fontSize = 20;
    
    this.text_right = this.game.add.text(this.game.width-8, 8, this.text_fps, style);
    this.text_right.fixedToCamera = true;  
    this.text_right.anchor.setTo(1, 0);
    this.text_right.fontSize = 20;
    
};

GUI.prototype.update = function() {

    this.update_HUD();
    this.update_text();
    
};

GUI.prototype.update_HUD = function() {

    this.crop_health = new Phaser.Rectangle(0, 0, this.health_width*player_health, this.health_bar_full.height); 
    this.health_bar_full.crop(this.crop_health)
    
    this.crop_mana = new Phaser.Rectangle(0, 0, this.mana_width*player_mana, this.mana_bar_full.height);
    this.mana_bar_full.crop(this.crop_mana)
    
    this.crop_power = new Phaser.Rectangle(0, 0, this.power_width*player_power, this.power_bar_full.height);
    this.power_bar_full.crop(this.crop_power)
    
    if (this.power_width*player_power >= this.power_bar_empty.width)
    {
        player_invincible = true;
    }
    
    if (player_power <= 0)
    {
        player_invincible = false;
    }

    if (player_invincible)
    {
        player_power -= 0.01;
    }
    
};

GUI.prototype.update_text = function() {
    
    this.text_score = ' Enemies Killed: ' + score + ' ';
    this.text_timer = ' Time: ' + (500 - game_timer.seconds.toFixed(0)) + ' ';
    this.text_fps = ' FPS: ' + this.game.time.fps + ' ';

    this.text_left.text = this.text_score + "\n" + this.text_timer;
    this.text_right.text = this.text_fps;
    
    if (500 - game_timer.seconds < 0)
    {
        hero.game_over();
    }
    
};

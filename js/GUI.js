var score = 0;

function GUI(game) {
    this.game = game;

    this.HUD = null;
    this.inventory = null;
    this.healthBarEmpty = null;
    this.healthBarFull = null;
    this.manaBarEmpty = null;
    this.manaBarFull = null;
    this.manaBarEmpty = null;
    this.manaBarFull = null;

    this.healthWidth = null;
    this.cropHealth = null;
    this.manaWidth = null;
    this.cropMana = null;
    this.powerWidth = null;
    this.cropPower = null;
    
    this.barWidth = null;

    this.scoreText = null;
    this.timerText = null;
    this.helpText = null;
    this.helpText2 = null;

}

GUI.prototype.create = function() {
    
    this.create_HUD();
    this.create_text();
};

GUI.prototype.create_HUD = function() {
    
    this.HUD = this.game.add.group();
    this.HUD.setAll('fixedToCamera', true);

    this.hud = this.HUD.create(0, this.game.height, 'hud');
    this.hud.fixedToCamera = true;
    this.hud.anchor.setTo(0, 1);

    this.barWidth = 150;

    this.inventory = this.HUD.create(this.barWidth*2, this.game.height, 'inventory');
    this.inventory.fixedToCamera = true;
    this.inventory.anchor.setTo(0, 1);

    //health
    this.healthBarEmpty = this.HUD.create(0, this.game.height, 'health');
    this.healthBarEmpty.fixedToCamera = true;
    this.healthBarEmpty.anchor.setTo(0, 1);
    this.healthBarEmpty.frame = 1;

    this.healthBarFull = this.HUD.create(0, this.game.height, 'health');
    this.healthBarFull.fixedToCamera = true;
    this.healthBarFull.anchor.setTo(0, 1);
    this.healthBarFull.frame = 0;

    //mana
    this.manaBarEmpty = this.HUD.create(this.barWidth, this.game.height, 'mana');
    this.manaBarEmpty.fixedToCamera = true;
    this.manaBarEmpty.anchor.setTo(0, 1);
    this.manaBarEmpty.frame = 1;
    
    this.manaBarFull = this.HUD.create(this.barWidth, this.game.height, 'mana');
    this.manaBarFull.fixedToCamera = true;
    this.manaBarFull.anchor.setTo(0, 1);
    this.manaBarFull.frame = 0;

    //power
    this.powerBarEmpty = this.HUD.create(this.game.width - this.barWidth, this.game.height, 'power');
    this.powerBarEmpty.fixedToCamera = true;
    this.powerBarEmpty.anchor.setTo(0, 1);
    this.powerBarEmpty.frame = 1;
    
    this.powerBarFull = this.HUD.create(this.game.width - this.barWidth, this.game.height, 'power');
    this.powerBarFull.fixedToCamera = true;
    this.powerBarFull.anchor.setTo(0, 1);
    this.powerBarFull.frame = 0;

    if(playerHealth == 5)
    {
        this.healthWidth = this.healthBarFull.width/5;
    }
    
    if(playerMana == 100)
    {
        this.manaWidth = this.manaBarFull.width/100;
    }
    
    if (playerPower === 0)
    {
        this.powerWidth = this.powerBarFull.width/10;
    }
};

GUI.prototype.create_text = function() {
    
    this.scoreText = this.game.add.text(8, 8, ' Enemies Killed: ' + score + ' ', { fontSize: '32px', fill: '#FFFFFF' });
    this.scoreText.fixedToCamera = true;
    this.scoreText.setShadow(0, 0, 'black', 10);
    this.scoreText.stroke = 'black';
    this.scoreText.strokeThickness = 3;
    this.scoreText.fontSize = 20;
    
    this.timerText = this.game.add.text(8, 32, ' Game Time: ', { fontSize: '32px', fill: '#FFFFFF' });
    this.timerText.fixedToCamera = true;  
    this.timerText.setShadow(0, 0, 'black', 10);
    this.timerText.stroke = 'black';
    this.timerText.strokeThickness = 3;
    this.timerText.fontSize = 20;

    this.helpText = this.game.add.text(this.game.width-8, 8, ' Press ESC to Pause ', { fontSize: '32px', fill: '#FFFFFF' });
    this.helpText.fixedToCamera = true;  
    this.helpText.anchor.setTo(1, 0);
    this.helpText.setShadow(0, 0, 'black', 10);
    this.helpText.stroke = 'black';
    this.helpText.strokeThickness = 3;
    this.helpText.fontSize = 20;

    /*this.helpText2 = this.game.add.text(this.game.width-8, 32, ' Press SPACE to stop music ', { fontSize: '32px', fill: '#FFFFFF' });
    this.helpText2.fixedToCamera = true;
    this.helpText2.anchor.setTo(1, 0);
    this.helpText2.setShadow(0, 0, 'black', 10);
    this.helpText2.stroke = 'black';
    this.helpText2.strokeThickness = 3;
    this.helpText2.fontSize = 20;*/

};

GUI.prototype.update = function() {

    this.update_HUD();
    this.update_text();
    
};

GUI.prototype.update_HUD = function() {

    this.cropHealth = new Phaser.Rectangle(0, 0, this.healthWidth*playerHealth, this.healthBarFull.height); 
    this.healthBarFull.crop(this.cropHealth)

    this.cropMana = new Phaser.Rectangle(0, 0, this.manaWidth*playerMana, this.manaBarFull.height);
    this.manaBarFull.crop(this.cropMana)
    
    this.cropPower = new Phaser.Rectangle(0, 0, this.powerWidth*playerPower, this.powerBarFull.height);
    this.powerBarFull.crop(this.cropPower)
    
    if (this.powerWidth*playerPower === this.powerBarEmpty.width)
    {
        player_invincible = true;
    }
    
    if (playerPower <= 0)
    {
        player_invincible = false;
    }

    if (player_invincible)
    {
        playerPower -= 0.01;
    }
    
};

GUI.prototype.update_text = function() {
    
    this.timerText.text = ' Time: ' + (100 - game_timer.seconds.toFixed(0)) + ' ';
    
    this.scoreText.text = ' Enemies Killed: ' + score + ' ';
    
    if (100 - game_timer.seconds < 0)
    {
        hero.game_over();
    }
    
};
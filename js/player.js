var player = null;

var playerHealth = 0;
var playerMana = 0;
var playerPower = 0;
var playerHitTimer = 0;

var player_invincible = false;

var katana_0 = null;

var jump = null;

var attackKey = null;

var cursors = null;

function Hero(game) {
    this.game = game;

    this.facing = null;
    this.wall_cling = false;
    this.wallClingLeft = null;
    this.wallClingRight = null;
    this.playerJumpTimer = 0;
    
    cursors = this.game.input.keyboard.createCursorKeys();
    
	jump = this.game.add.audio('jump');
	
	attackKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);

}

Hero.prototype.create = function(x, y) {

    player = this.game.add.sprite(x, y, 'player');
  
	this.game.camera.follow(player);
    this.game.physics.arcade.enable(player);

    playerHealth = 5;
    playerMana = 100;
    playerPower = 0;
    
    player.body.bounce.y = 0.1;
    player.body.collideWorldBounds = true;
    player.anchor.set(0.5);

    player.animations.add('run', [0, 1], 7, true);
    
//the weapon

    katana_0 = this.game.add.sprite(null, null, 'swordHeld');
    katana_0.anchor.setTo(0.5, 0.5);
    katana_0.animations.add('float', Phaser.Animation.generateFrameNames('sword_idle', 1, 8, '.png', 2), 10, true);
    katana_0.animations.add('swing', Phaser.Animation.generateFrameNames('sword_active', 1, 3, '.png', 2), 20, true);
    this.game.physics.arcade.enable(katana_0);
    katana_0.body.moves = false;
    
    player.addChild(katana_0);
    katana_0.x = 20;
    katana_0.y = -20;
    
    katana_0.exists = false;
  
};

Hero.prototype.update = function() {
    
    this.player_physics();
    this.player_controls();
};

Hero.prototype.player_physics = function() {
    
    this.game.physics.arcade.collide(player, grounds);
    this.game.physics.arcade.collide(player, ledges);
    this.game.physics.arcade.collide(player, walls, function() {this.wall_cling = true;}, null, this);

    this.game.physics.arcade.overlap(player, power_item, this.player_get_power, null, this);
    this.game.physics.arcade.overlap(player, katana_0_item, this.player_get_weapon, null, this);
    this.game.physics.arcade.overlap(player, ruby, this.game_win, null, this);

    if (!player_invincible)
    {
        this.game.physics.arcade.overlap(player, ghosts, this.player_damage, null, this);
        
        if (!cursors.down.isDown)
        {
            this.game.physics.arcade.overlap(player, ninjas, this.player_damage, null, this);
        }
    }
    
};

Hero.prototype.player_controls = function() {
    
    //controls for different states
    this.controls_ground();
    this.controls_air();
    //this.control_water();
    
    //check for invincibility
    if (player_invincible) this.controls_invincible();
    if (!player_invincible) this.controls_vincible();
    
    //needs to be after for certain things to work (i.e. "hiding")
    this.controls_universal(); 
    
    if (this.game.device.mobile) this.controls_mobile();
    
};

Hero.prototype.controls_universal = function() {
    
    //universal standards
    player.body.allowGravity = true;

    //check direction player is facing
    if (this.facing == 'right' && player.scale.x < 0)
    {
        player.scale.x = 1;
    }
    if (this.facing == 'left' && player.scale.x > 0)
    {
        player.scale.x = -1;
    }
    
    //weapons
    if (attackKey.isDown) {
        katana_0.animations.play('swing');
        katana_0.x = 35;
        katana_0.y = -20;
    }
    else 
    {
        katana_0.animations.play('float');
        katana_0.x = 30;
        katana_0.y = -20;
    }	
    
};
    
Hero.prototype.controls_ground = function() {
    
    //walking
    if (cursors.left.isDown)
    {
        this.facing = 'left';
        player.body.acceleration.x= -500;
        player.animations.play('run');
    }
    else if (cursors.right.isDown)
    {
        this.facing = 'right';
        player.body.acceleration.x= 500;
        player.animations.play('run');
    }
    //slow the player to a stop
	else 
    {
        player.body.acceleration.x = 0;
        player.body.drag.x = 1200;
    }
    
    //idle frames
    if (!cursors.left.isDown && !cursors.right.isDown && !this.wallClingLeft && !this.wallClingRight)
    {
        player.frame = 0;
    }
	
	if (player.body.touching.down && !cursors.down.isDown && !this.wallClingLeft && !this.wallClingRight && playerMana <100)
    {
        playerMana += 0.025;
    }
    
	//jump
	if (cursors.up.isDown && player.body.touching.down && !cursors.down.isDown)
	{
	    if (this.playerJumpTimer.seconds > 0.7)
	    {
    	    this.playerJumpTimer.destroy();
    	    
        	player.body.velocity.y = -600;	
            jump.play();
            
            this.playerJumpTimer = this.game.time.create(false);
            this.playerJumpTimer.start();
	    }
	    else if (!this.playerJumpTimer.running)
	    {
        	player.body.velocity.y = -600;	
            jump.play();
            
            this.playerJumpTimer = this.game.time.create(false);
            this.playerJumpTimer.start();
	    }
	}
    
};

Hero.prototype.controls_air = function() {
    
    //check if rising or falling
    if (!player.body.touching.down && 
    !this.wallClingLeft && 
    !this.wallClingRight)
    {
        if (player.body.velocity.y < 0)
    	{
            player.frame = 3;
    	}
    	else if (player.body.velocity.y > 0)
    	{
            player.frame = 4;
    	}
    }        
    
    if (this.wall_cling) //only wall cling if touching a wall
    {
        //wall clinging
        if (player.body.velocity.y !== 0 && 
        !player.body.touching.down && 
        player.body.touching.left && 
        cursors.left.isDown && 
        playerMana > 0)
        {
            player.body.moves = false; //stick player to wall
            this.wallClingLeft = true;
        }
        else if (player.body.velocity.y !== 0 && 
        !player.body.touching.down && 
        player.body.touching.right && 
        cursors.right.isDown && 
        playerMana > 0)
        {
            player.body.moves = false;
            this.wallClingRight = true;
        }
        
        if (this.wallClingLeft) 
        {
            player.frame = 5;
            this.facing = 'left';
            if (playerMana > 0)
            {
                playerMana -= 0.1;
            }
        }
        if (this.wallClingRight) 
        {
            player.frame = 5;
            this.facing = 'right';
            if (playerMana > 0)
            {
                playerMana -= 0.1;
            }
        }	
        //wall jumping
        if (this.wallClingLeft && 
        cursors.up.isDown || 
        this.wallClingLeft && 
        playerMana <= 0)
    	{
    	    player.body.moves = true;
        	player.body.velocity.x = 10000;	
        	player.body.velocity.y = -400;	
            jump.play();
            this.wallClingLeft = false;
            this.wall_cling = false;
    	}
        if (this.wallClingRight && 
        cursors.up.isDown || 
        this.wallClingRight && 
        playerMana <= 0)
    	{
    	    player.body.moves = true;
        	player.body.velocity.x = -800;	
        	player.body.velocity.y = -400;	
            jump.play();
            this.wallClingRight = false;
            this.wall_cling = false;
    	}
    }
};

Hero.prototype.controls_vincible = function() {
    
    //universal standards
    player.body.maxVelocity.x = 230;
	player.body.gravity.y = 1000;

	//alpha for invincibility frames
	if (playerHitTimer.seconds < 1 && playerHitTimer.running)
	{
	    player.alpha = 0.5;
	}
	else player.alpha = 1;
	
	//hide
	if (cursors.down.isDown && !this.wallClingLeft && !this.wallClingRight && playerMana > 0)
	{
	    player.body.velocity.x = 0;
	    player.body.acceleration.x = 0;
	    player.frame = 2;
        if (playerMana > 0)
        {
            playerMana -= 0.1;
        }
    }
    
};

Hero.prototype.controls_invincible = function() {
    
    //universal standards (*2), (/2)
    player.body.maxVelocity.x = 230*2;
	player.body.gravity.y = 1000/2;
	
	//alpha for invincibility frames (always alpha)
	if (playerHitTimer.seconds < 1 && playerHitTimer.running)
	{
	    player.alpha = 0.5;
	}
	else player.alpha = 0.5;
	
	//hide (removed needing mana)
	if (cursors.down.isDown && !this.wallClingLeft && !this.wallClingRight)
	{
	    player.body.velocity.x = 0;
	    player.body.acceleration.x = 0;
	    player.frame = 2;
        if (playerMana > 0)
        {
            playerMana -= 0.1;
        }
    }
    
};

Hero.prototype.controls_mobile = function() {
    
    //mobile controls
    if (this.game.device.mobile && this.input.activePointer.isDown)
    {
       this.physics.arcade.moveToPointer(player, 300, this.input.activePointer, 0);
    
        if (Phaser.Rectangle.contains(player.body, this.input.x, this.input.y))
        {
        	player.body.velocity.setTo(0, 0);
        }
	}
    
};

Hero.prototype.player_damage = function() {
    
    if (playerHitTimer.seconds > 1)
    {
        playerHitTimer.destroy();
        
        playerHealth -= 1;
        
        jump.play();

        playerHitTimer = this.game.time.create(false);
        playerHitTimer.start();
    }
    else if (!playerHitTimer.running)
    {
        playerHealth -= 1;
        
        jump.play();

        playerHitTimer = this.game.time.create(false);
        playerHitTimer.start();
    }
    
    if (playerHealth === 0)
    {
        this.game_over();
    }
};

Hero.prototype.player_get_power = function(player, power) {

    power.kill();
    
	var item = this.game.add.audio('item');
    item.play();
    
    playerPower += 2;

};

Hero.prototype.player_get_weapon = function(player, sword) {

    sword.kill();
    
    katana_0.exists = true;
    
	var item = this.game.add.audio('item');
    item.play();
};

Hero.prototype.game_win = function() {

    this.game.camera.reset();

    this.game.state.start('level_1');

};

Hero.prototype.game_over = function() {

    this.game.camera.reset();

    this.game.state.start('main_menu');

};
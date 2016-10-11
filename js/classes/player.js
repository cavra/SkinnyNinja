//global variables
//the player
var player = null;
var player_invincible = false;
var player_invisible = false;

//GUI related
var player_health = 0;
var player_mana = 0;
var player_power = 0;

//items
var katana_0 = null;

//audio
var jump = null;
var swish = null;

//keypresses
var cursors = null;
var keypress_attack = null;
var keypress_invisible = null;

function Hero(game) {
    this.game = game;

    //group to add player to
    this.player_group = this.game.add.group();
    this.player_group.enableBody = true;
    this.player_group.physicsBodyType = Phaser.Physics.ARCADE;
    
    //the invisibility filter
    this.hud = this.game.add.image(0, this.game.height, 'blur');
    this.hud.fixedToCamera = true;
    this.hud.anchor.setTo(0, 1);
    this.hud.visible = false;
    
    //statuses
    this.player_state = null
    this.facing = null;
    this.wall_cling = false;
    this.wall_cling_left = null;
    this.wall_cling_right = null;
    
    //timers
    this.player_jump_timer = 0;
    this.player_damage_timer = 0;
    this.game_win_timer =  this.game.time.create(false);
    this.game_over_timer = this.game.time.create(false);

    //defining globals
    cursors = this.game.input.keyboard.createCursorKeys();
	keypress_attack = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
	keypress_invisible = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    
	jump = this.game.add.audio('jump');
    swish = this.game.add.audio('swish');

}

Hero.prototype.create = function() {

    //the player
    map.createFromObjects('object_player', 3, 'player', 0, true, false, this.player_group);
    player = this.player_group.getAt(0);

    //camera
	this.game.camera.follow(player);

    //physics
    this.game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.anchor.set(0.5);

    //attributes
    player_health = 5;
    player_mana = 100;
    player_power = 0;
    this.player_in_water = false;
    
    //animations
    player.animations.add('run', [0, 1], 7, true);
    
    //the weapon
    katana_0 = this.game.add.sprite(null, null, 'sword_player');
    this.game.physics.arcade.enable(katana_0);
    katana_0.body.moves = false;
    katana_0.anchor.setTo(0.5, 0.5);
    
    katana_0.animations.add('float', Phaser.Animation.generateFrameNames('sword_idle', 1, 8, '.png', 2), 10, true);
    katana_0.animations.add('swing', Phaser.Animation.generateFrameNames('sword_active', 1, 3, '.png', 2), 20, true);

    player.addChild(katana_0);
    katana_0.x = 20;
    katana_0.y = -20;
    
    katana_0.exists = false;
  
};

Hero.prototype.update = function() {

    if (!this.game_win_timer.running &&
    !this.game_over_timer.running)
    {
        this.player_physics();
        this.player_controls();
    }
    
    //check if player has died or won
    if (this.game_win_timer.running ||
    this.game_over_timer.running)
    {
        player_invisible = true; //don't aggro enemies
        player.frame = 4; //dying position
    }
    if (this.game_win_timer.seconds > 3)
    {
        this.end_game(1);
    }
    if (this.game_over_timer.seconds > 3)
    {
        this.end_game(0);
    }
};

Hero.prototype.player_physics = function() {
    
    //world
    this.game.physics.arcade.collide(player, layer_ground);
    this.game.physics.arcade.collide(player, layer_walls, function() {this.wall_cling = true;}, null, this);
    //this.game.physics.arcade.overlap(player, layer_water, function() {this.player_in_water = true;}, null, this);
    //if (player.overlap(layer_water)) this.player_in_water = true;

    //items
    this.game.physics.arcade.overlap(player, power_item_group, this.player_get_power, null, this);
    this.game.physics.arcade.overlap(player, katana_0_item, this.player_get_weapon, null, this);
    this.game.physics.arcade.overlap(player, ruby, this.game_win, null, this);

    //enemies
    if (!player_invincible)
    {
        this.game.physics.arcade.overlap(player, ghosts, this.player_damage, null, this);
        
        if (!player_invisible)
        {
            this.game.physics.arcade.overlap(player, ninjas, this.player_damage, null, this);
            this.game.physics.arcade.overlap(player, ninja_stars, function(player, ninja_stars) {
                if (this.player_damage()) ninja_stars.kill()
            }, null, this);
                
        }
        
    }
    
};

Hero.prototype.player_controls = function() {

    //check for the player state
    this.player_get_state();

    this.controls_universal(); 

    if (this.player_state == 'ground') this.controls_ground();
    if (this.player_state == 'air') this.controls_air();
    if (this.player_state == 'clinging') this.controls_wall_cling();
    if (this.player_state == 'water') this.controls_water();
    if (this.player_state == 'dead') this.controls_dead();

    //check if on mobile device
    if (this.game.device.mobile) this.controls_mobile();
    
};

Hero.prototype.player_get_state = function() {
    
    if (!this.player_in_water)
    {
        //ground
        if (player.body.blocked.down &&
        player.body.velocity.y === 0) this.player_state = "ground";
        
        //air
        else if (!player.body.blocked.down &&
        !this.wall_cling &&
        !this.wall_cling_left &&
        !this.wall_cling_right) this.player_state = "air";
        
        //clinging
        if (this.wall_cling &&
        !player.body.blocked.down &&
        !player.body.blocked.up)
        {
            //left
            if (this.facing == 'left' &&
            player.body.blocked.left &&
            cursors.left.isDown && 
            !cursors.right.isDown &&
            player_mana > 0) this.player_state = "clinging";
            
             //right
            else if (this.facing == 'right' &&
            player.body.blocked.right &&
            cursors.right.isDown && 
            !cursors.left.isDown &&
            player_mana > 0) this.player_state = "clinging";
        }
    }

    //water
    if (this.player_in_water) this.player_state = "water";

    //dead
    if (player_health <= 0) this.player_state = "dead"
    
    //reset wall_cling and water statuses to false after checking 
    this.wall_cling = false;
    this.player_in_water = false;
    
};

Hero.prototype.controls_universal = function() {
    
    //universal standards
    if (player_invincible) 
    {
        player.body.allowGravity = true;
        player.body.maxVelocity.x = 460;
        player.body.maxVelocity.y = 450;
        player.body.gravity.y = 500;
        player.alpha = 0.5;
    }
    else if (!player_invincible)
    {
        player.body.allowGravity = true;
        player.body.maxVelocity.x = 230;
        player.body.maxVelocity.y = 450;
    	player.body.gravity.y = 1000;
    }
    if (player_invisible)
    {
    	player.alpha = 0.5;
    	
        if (player_mana > 0)
        {
            player_mana -= 0.5;
        }
        
        this.game.time.slowMotion = 4.0;
        this.game.time.desiredFps = 60;
        
    }
    else if (!player_invisible)
    {
    	player.alpha = 1;
    	this.hud.visible = false;
    
        this.game.time.slowMotion = 1.0;
        this.game.time.desiredFps = 60;
    }
	
    //check direction player is facing
    if (this.facing == 'right' && 
    player.scale.x < 0)
    {
        player.scale.x = 1;
    }
    if (this.facing == 'left' && 
    player.scale.x > 0)
    {
        player.scale.x = -1;
    }
    
    //check if player was recently hit
    if (this.player_damage_timer.seconds < 1)
    {
        player.alpha = 0.5;
    }

};
    
Hero.prototype.controls_ground = function() {
    
    //local standards
    player.body.moves = true;
    
    //invisible
    if (keypress_invisible.isDown && 
	player_mana > 0)
	{
	    player_invisible = true;
    	this.hud.visible = true;
    }
    else
    {
        player_invisible = false;
    }
    
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
	else 
    {
        //slow the player to a stop
        player.body.acceleration.x = 0;
        player.body.drag.x = 1200;
    }
    
    //idle frames
    if (!cursors.left.isDown && 
    !cursors.right.isDown)
    {
        player.frame = 0;
    }
	
	//gain mana
	if (!keypress_invisible.isDown &&
	player.body.blocked.down && 
	!cursors.down.isDown && 
	player_mana <100)
    {
        player_mana += 0.05;
    }
    
	//jump
	if (cursors.up.isDown && 
	player.body.blocked.down && 
	!cursors.down.isDown)
	{
	    if (this.player_jump_timer.seconds > 0.7)
	    {
    	    this.player_jump_timer.destroy();
    	    
        	player.body.velocity.y = -480;	
            jump.play();
            
            this.player_jump_timer = this.game.time.create(false);
            this.player_jump_timer.start();
	    }
	    else if (!this.player_jump_timer.running)
	    {
        	player.body.velocity.y = -480;	
            jump.play();
            
            this.player_jump_timer = this.game.time.create(false);
            this.player_jump_timer.start();
	    }
	}
	
    //crouch

    //weapons
    if (keypress_attack.isDown) {
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

Hero.prototype.controls_air = function() {

    //local standards
    player.body.moves = true;

    //invisible
    if (keypress_invisible.isDown && 
	player_mana > 0)
	{
	    player_invisible = true;
    	this.hud.visible = true;
    }
    else
    {
        player_invisible = false;
    }

    //check if rising or falling
    if (player.body.velocity.y < 0)
	{
        player.frame = 3;
	}
	else if (player.body.velocity.y > 0)
	{
        player.frame = 4;
	}     
    
    //moving
    if (cursors.left.isDown)
    {
        this.facing = 'left';
        player.body.acceleration.x= -500;
    }
    else if (cursors.right.isDown)
    {
        this.facing = 'right';
        player.body.acceleration.x= 500;
    }
    //slow the player to a stop
	else 
    {
        player.body.acceleration.x = 0;
        player.body.drag.x = 1200;
    }
    
    //weapons
    if (keypress_attack.isDown) {
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

Hero.prototype.controls_wall_cling = function() {

    //invisible
    if (keypress_invisible.isDown && 
	player_mana > 0)
	{
	    player_invisible = true;
    	this.hud.visible = true;
    }
    else
    {
        player_invisible = false;
    }
    
    //left wall clinging
    if (player.body.velocity.y !== 0 && 
    !player.body.blocked.down && 
    player.body.blocked.left && 
    cursors.left.isDown && 
    !cursors.right.isDown &&
    player_mana > 0)
    {
        player.body.moves = false;
        this.wall_cling_left = true;
    }
    //right wall clinging
    else if (player.body.velocity.y !== 0 && 
    !player.body.blocked.down && 
    player.body.blocked.right && 
    cursors.right.isDown && 
    !cursors.left.isDown &&
    player_mana > 0)
    {
        player.body.moves = false;
        this.wall_cling_right = true;
    }
    
    //if the player is stuck to a wall
    if (this.wall_cling_left) 
    {
        player.frame = 5;
        this.facing = 'left';
        if (player_mana > 0)
        {
            player_mana -= 0.1;
        }
    }
    if (this.wall_cling_right) 
    {
        player.frame = 5;
        this.facing = 'right';
        if (player_mana > 0)
        {
            player_mana -= 0.1;
        }
    }	
    
    //wall jumping
    //left
    if (this.wall_cling_left && 
    cursors.up.isDown || 
    this.wall_cling_left && 
    player_mana <= 0)
	{
        this.wall_cling = false;
	    player.body.moves = true;
    	player.body.velocity.x = 800;	
    	player.body.velocity.y = -400;	
        jump.play();
        this.wall_cling_left = false;
	}
	//right
    if (this.wall_cling_right && 
    cursors.up.isDown || 
    this.wall_cling_right && 
    player_mana <= 0)
	{
        this.wall_cling = false;
	    player.body.moves = true;
    	player.body.velocity.x = -800;	
    	player.body.velocity.y = -400;	
        jump.play();
        this.wall_cling_right = false;
	}
        
};

Hero.prototype.controls_water = function() {
    
    //local standards
    player.body.moves = true;
    player.body.maxVelocity.x = 200;
    player.body.maxVelocity.y = 200;
	player.body.gravity.y = 200;
	
	//swimming
    if (cursors.left.isDown)
    {
        this.facing = 'left';
        player.body.acceleration.x= -100;
        player.animations.play('run');
    }
    else if (cursors.right.isDown)
    {
        this.facing = 'right';
        player.body.acceleration.x= 100;
        player.animations.play('run');
    }
    else 
    {
        //slow the player to a stop
        player.body.acceleration.x = 0;
        player.body.drag.x = 1200;
    }
    
    if (cursors.up.isDown)
    {
        player.body.acceleration.y= -100;
    }
    if (cursors.down.isDown)
    {
        player.body.acceleration.y= 100;
    }

};

Hero.prototype.controls_dead = function() {
    
    player.body.moves = false;

    this.game_over();
    
};

Hero.prototype.controls_mobile = function() {
    
    //mobile controls
    if (this.game.device.mobile && 
    this.input.activePointer.isDown)
    {
       this.physics.arcade.moveToPointer(player, 300, this.input.activePointer, 0);
    
        if (Phaser.Rectangle.contains(player.body, this.input.x, this.input.y))
        {
        	player.body.velocity.setTo(0, 0);
        }
	}
    
};

Hero.prototype.player_damage = function() {
    
    //wait one second for invincibility
    if (this.player_damage_timer.seconds > 1)
    {
        //kill the current damage timer
        this.player_damage_timer.destroy();
        
        player_health -= 1;
        
        swish.play();

        //restart the damage timer
        this.player_damage_timer = this.game.time.create(false);
        this.player_damage_timer.start();
        
        return true
    }
    //if the timer isn't running for some reason
    else if (!this.player_damage_timer.running)
    {
        player_health -= 1;
        
        swish.play();

        //restart the damage timer
        this.player_damage_timer = this.game.time.create(false);
        this.player_damage_timer.start();
        
        return true;
    }
    else return false;
    
};

Hero.prototype.player_get_power = function(player, power) {

    //kill the item
    power.kill();
    
    //play the sound
	var item = this.game.add.audio('item');
    item.play();
    
    //give the player some power
    player_power += 2;

};

Hero.prototype.player_get_weapon = function(player, sword) {

    //kill the item
    sword.kill();

    //play the sound
	var item = this.game.add.audio('item');
    item.play();
    
    //give the player the sword
    katana_0.exists = true;
    
};

Hero.prototype.game_win = function(player, ruby) {

    game_timer.pause();
    music.stop();
    this.game.input.enabled = false;
    
    ruby.destroy(); 
    player.body.velocity = 0;
    
    this.game_win_timer.start();

};

Hero.prototype.game_over = function() {

    game_timer.pause();
    music.stop();

    this.game_over_timer.start();

};

Hero.prototype.end_game = function(number) {
    
        this.game.input.enabled = true;
        this.game_over_timer.destroy();
        this.game_win_timer.destroy();

        this.game.camera.reset();
        
        if (number === 0) this.game.state.start('main_menu');
        else if (number == 1) this.game.state.start('level_1');
    
};

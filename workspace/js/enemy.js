var aggro_trigger = [];

var ninjas = null;
var ghosts = null;

function Enemy(game) {
    this.game = game;
    this.enemy_facing = [];
    this.enemy_status = [];
    
    this.run_timer = [];
    this.idle_timer = [];
    this.enemy_damage_timer = [];
    this.enemy_retreat_timer = [];

    this.has_trigger = [];
    
    ninjas = this.game.add.group();
    ninjas.enableBody = true;
    ninjas.physicsBodyType = Phaser.Physics.ARCADE;
    
    ghosts = this.game.add.group();
    ghosts.enableBody = true;
    ghosts.physicsBodyType = Phaser.Physics.ARCADE;
    
}

Enemy.prototype.create = function(type, x, y) {

    if (type === 0) this.create_ninja(x, y);
    else if (type == 1) this.create_ghost(x, y);
    
    this.update_index();
};

Enemy.prototype.create_ninja = function(x, y) {

	this.ninja = ninjas.create(x, y, 'enemy');
    this.ninja.anchor.setTo(0.5, 0.5);
    this.ninja.health = 2;

    ninjas.setAll('body.bounce.y', 0.3);
    ninjas.setAll('body.gravity.y', 500);
	ninjas.setAll('body.collideWorldBounds', true);

    ninjas.callAll('animations.add', 'animations', 'run', [0, 1], 7, true);

};

Enemy.prototype.create_ghost = function(x, y) {
    
    this.ghost = ghosts.create(x, y, 'ghost');
    this.ghost.anchor.set(0.5);
    this.ghost.scale.x = -1;

	ghosts.setAll('body.collideWorldBounds', true);

    ghosts.callAll('animations.add', 'animations', 'idle', [0, 1], 5, true);
  /*
    this.emitter = this.game.add.emitter(x, y, 200);
    this.emitter.makeParticles('energy_particle');
    this.emitter.setRotation(0, 0);
    this.emitter.setScale(1, 0, 1, 0, 3000);
    this.emitter.setAlpha(0.1, 1, 3000);
    this.emitter.start(false, 500, 1);*/
};

Enemy.prototype.update_index = function() {
    
    for (var i = 0; i < ninjas.length; i++) 
    {
        //set the default status of enemies
        this.enemy_status[i] = "passive";
        
        this.enemy_facing[i] = null;
        
        //create the timers
        this.run_timer[i] = this.game.time.create(false);
        this.idle_timer[i] = this.game.time.create(false);
        this.enemy_damage_timer[i] = this.game.time.create(false);
        this.enemy_retreat_timer[i] = this.game.time.create(false);
    
        //create the aggro trigger for the player to run into
        if (!this.has_trigger[i])
        {
            aggro_trigger[i] = this.game.add.sprite(null, null, 'singularity');
            aggro_trigger[i].scale.setTo(300, 10);
            this.game.physics.arcade.enable(aggro_trigger[i]);
            aggro_trigger[i].body.moves = false;  
            
            ninjas.getAt(i).addChild(aggro_trigger[i]);
            aggro_trigger[i].x = 0;
            aggro_trigger[i].y = 0;
            
            aggro_trigger[i].alpha = 0;

            this.has_trigger[i] = true;
        }
    }
    
};

Enemy.prototype.update = function() {
    
    this.enemy_physics();

    for (var i = 0; i < ninjas.length; i++) 
    {
        this.ninja_physics_universal(ninjas.getAt(i), i);
        if (this.enemy_status[i] == "passive") this.ninja_physics_passive(ninjas.getAt(i), i);
        else if (this.enemy_status[i] == "aggro") this.ninja_physics_aggrovated(ninjas.getAt(i), i);
        
        //keep the trigger with the parent
        aggro_trigger[i].x = 0;//ninjas.getAt(i).x;
        aggro_trigger[i].y = 0;//ninjas.getAt(i).y;
    }

    this.ghost_physics();    
};

Enemy.prototype.enemy_physics = function() {
    
    this.game.physics.arcade.collide(ninjas, grounds);
    this.game.physics.arcade.collide(ninjas, ledges);
    this.game.physics.arcade.collide(ninjas, walls);
    this.game.physics.arcade.collide(ninjas, ledge_trigger);
    this.game.physics.arcade.collide(ninjas, ninjas);
	this.game.physics.arcade.collide(ghosts, ghosts);

    for (var i = 0; i < ninjas.length; i++) 
    {
        //aggrovate if not invisible
        if (!cursors.down.isDown)
        {
        this.game.physics.arcade.overlap(aggro_trigger[i], player, function() {this.enemy_status[i] = "aggro"}, null, this);
        }
        
        //damage enemy
        if (attackKey.isDown &&
        katana_0.overlap(ninjas.getAt(i)))
        {
            this.enemy_damage(ninjas.getAt(i));
        }
    }
    
};

Enemy.prototype.ninja_physics_universal = function(ninja, i) {
        
        //universal
        if (this.enemy_facing[i] == 'right')
        {
            ninja.scale.x = 1;
            aggro_trigger[i].anchor.setTo(0, 0.5);
        }
        else if (this.enemy_facing[i] == 'left')
        {
            ninja.scale.x = -1;
            aggro_trigger[i].anchor.setTo(1, 0.5);
        }
        
        if (this.enemy_damage_timer[i].seconds > 1 && 
        this.enemy_damage_timer[i].running)
        {
            ninja.alpha = 1;
        }
        
        //walking
        if(ninja.body.velocity.x > 0)
        {
            this.enemy_facing[i] = 'right';
            ninja.animations.play('run');
            ninja.scale.x = 1;
        }
        else if(ninja.body.velocity.x < 0)
        {
            this.enemy_facing[i] = 'left';
            ninja.animations.play('run');
            ninja.scale.x = -1;
        }
        else ninja.frame = 0;
        
        //check if rising or falling
        if (!ninja.body.touching.down)
        {
            if (ninja.body.velocity.y < 0)
        	{
                ninja.frame = 3;
        	}
        	else if (ninja.body.velocity.y > 0)
        	{
                ninja.frame = 4;
        	}
        }        
        
        //keep them within world bounds
        if(this.game.world.width - ninja.body.position.x == this.game.world.width)
        {
            ninja.body.velocity.x = 50;
        }
        if(this.game.world.width - ninja.body.position.x === 0)
        {
            ninja.body.velocity.x = -50;
        }
        
        //bounce off objects
        if(ninja.body.touching.left)
        {
            ninja.body.velocity.x = 50;
        }
        if(ninja.body.touching.right)
        {
            ninja.body.velocity.x = -50;
        }
    
};

Enemy.prototype.ninja_physics_passive = function(ninja, i) {
   
            //create random number for movement algorithm
            var number = this.game.rnd.integerInRange(0, 100);
            var fraction = this.game.rnd.integerInRange(5, 25)/10;
    
            //get them moving
            if (!this.run_timer[i].running)
            {
                this.idle_timer[i].start();
            }
            
            //check if they've been idle long enough, then randomly give them a direction
            if (!this.run_timer[i].running && //should only do this first time around
            this.idle_timer[i].seconds > 1*fraction && 
            number > 95 && 
            ninja.body.touching.down && 
            ninja.body.velocity.x === 0)
            {
                if (number > 97) ninja.body.velocity.x = 40;
                else ninja.body.velocity.x = -40;
                
                this.run_timer[i].start();
            }
            else if (this.run_timer[i].running &&
            this.idle_timer[i].seconds > 1*fraction && 
            number > 95 && 
            ninja.body.touching.down && 
            ninja.body.velocity.x === 0)
            {
                this.run_timer[i] = null;
                this.run_timer[i] = this.game.time.create(false);
                this.run_timer[i].start();
                
                if (number > 97) ninja.body.velocity.x = 40;
                else ninja.body.velocity.x = -40;
            }
            
            //check if they've been moving long enough, then stop them
            if (this.run_timer[i].seconds > 2*fraction && 
            ninja.body.velocity.x !== 0)
            {
                this.idle_timer[i] = 0;
                this.idle_timer[i] = this.game.time.create(false);
                this.idle_timer[i].start();
                
                ninja.body.velocity.x = 0;
            }
            
          
            
       
};

Enemy.prototype.ninja_physics_aggrovated = function(ninja, i) {
    
    //if the player turns invisible, enemies will become passive
    if (!cursors.down.isDown) this.enemy_status[i] = "passive";

    //compare locations of player and enemy
    //no need for boundaries, since they're only aggro'd if the player is overlapping the aggro trigger
    if (player.x > ninja.x) 
    {
        ninja.body.velocity.x = 70;
    }
    else if (player.x < ninja.x)
    {
        ninja.body.velocity.x = -70;
    }
    
    //if the enemy is close to the player, stop and attack
    if (this.game.physics.arcade.distanceBetween(ninja, player) < 120) 
    {
        ninja.body.velocity.x = 0;
    }
    
    //if the enemy is too close to the player, retreat
    /*if (this.game.physics.arcade.distanceBetween(ninja, player) < 90) 
    {
        this.enemy_retreat_timer[i].start();
        
        if (this.enemy_retreat_timer[i].seconds < 2)
        {
            if (player.x < ninja.x) 
            {
                ninja.body.velocity.x = 70;
            }
            else if (player.x > ninja.x)
            {
                ninja.body.velocity.x = -70;
            }
        }
        if (this.enemy_retreat_timer[i].seconds > 2)
        {
            this.enemy_retreat_timer[i].destroy();
        }
    }*/

};

Enemy.prototype.ghost_physics = function() {
    
    for (i = 0; i < ghosts.length; i++) {
        
        if(ghosts.getAt(i).body.velocity.y === 0)
        {
            ghosts.getAt(i).body.velocity.y = 0;
            ghosts.getAt(i).animations.play('idle');
        }
        
        if(this.game.world.height - ghosts.getAt(i).body.position.y == this.game.world.height)
        {    
            ghosts.getAt(i).body.velocity.y = 0;
            ghosts.getAt(i).animations.play('idle');
        }  

        if(this.game.world.height - ghosts.getAt(i).body.position.y === 0)
        {    
            ghosts.getAt(i).body.velocity.y = 0;
            ghosts.getAt(i).animations.play('idle');
        }  
    }
    
};

Enemy.prototype.enemy_damage = function(victim) {
    
    var i = ninjas.getChildIndex(victim);
    
    if (this.enemy_damage_timer[i].seconds > 1)
    {
        this.enemy_damage_timer[i].destroy();
        
        victim.health -= 1;
        victim.alpha = 0.5;

        jump.play();

        this.enemy_damage_timer[i] = this.game.time.create(false);
        this.enemy_damage_timer[i].start();
    }
    else if (!this.enemy_damage_timer[i].running)
    {
        victim.health -= 1;
        victim.alpha = 0.5;

        jump.play();

        this.enemy_damage_timer[i] = this.game.time.create(false);
        this.enemy_damage_timer[i].start();
    }
            
    if (victim.health === 0)
    {
        item.create(2, victim.x, victim.y);

        victim.kill();
        victim.health -= 1;
        score += 1;
    }
};
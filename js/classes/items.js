//global variables
//groups
var items_group = null;
var power_item_group = null;

//items
var katana_0_item = null;
var power_item = null;
var ruby = null;

function Item(game) {
    this.game = game;
    
    //groups
    items_group = this.game.add.group();
    items_group.enableBody = true;
    items_group.physicsBodyType = Phaser.Physics.ARCADE;
    
    power_item_group = this.game.add.group();
    power_item_group.enableBody = true;
    power_item_group.physicsBodyType = Phaser.Physics.ARCADE;

    items_group.add(power_item_group);
    
}

Item.prototype.create = function(type, x, y) {
    
    if (type === 0) this.create_katana_0(x, y);
    else if (type == 1) this.create_ruby(x, y);
    else if (type == 2) this.create_power(x, y);
    
    items_group.setAll('body.gravity.y', 200);
    items_group.setAll('body.bounce.y', 0.1);
	items_group.setAll('body.collideWorldBounds', false);

};

Item.prototype.create_katana_0 = function(x, y) {

    //map.createFromObjects('object_items', 3, 'sword', 0, true, false, items_group);
    katana_0_item = items_group.create(x, y, 'sword');

    this.game.physics.enable(katana_0_item, Phaser.Physics.ARCADE);

};

Item.prototype.create_ruby = function(x, y) {
    
    ruby = items_group.create(x, y, 'ruby');
    ruby.exists = false;
    
};

Item.prototype.create_power = function(x, y) {
    
    power_item = power_item_group.create(x, y, 'power_item');
    this.game.physics.arcade.enable(power_item);
    power_item.body.bounce.y = 0.5;
    power_item.body.gravity.y = 300;
    power_item.scale.setTo(2, 2);
    power_item.anchor.setTo(0.5, 1);
    power_item.body.collideWorldBounds = true;
    
    power_item.animations.add('flame', [0, 1], 7, true);
    power_item.animations.play('flame');

};

Item.prototype.update = function() {
    
    this.item_physics();
    this.check_enemies_left();
    
};

Item.prototype.item_physics = function() {
 	
    this.game.physics.arcade.collide(items_group, layer_ground);
    this.game.physics.arcade.collide(items_group, layer_walls);
    this.game.physics.arcade.collide(power_item_group, layer_ground);
    this.game.physics.arcade.collide(power_item_group, layer_walls);
      
};

Item.prototype.check_enemies_left = function() {
  
     if (ninjas.countLiving() === 0 && !ruby.exists) {
        
        music.stop();
        
        ruby.exists = true;
        
    }
    
};

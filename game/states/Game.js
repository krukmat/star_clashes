var Game = function(game) {};

var player;
var cursors;
var lastKey = 'right';

var countKiller = 0;
var stars;
var scorePlayer = 0;
var scoreDog = 0;
var scoreText;
var start = false;
var robot;
var state;
var levels = [{ buildings:{HQ:1, miner: 2, oreStore: 4, craft: 5, lab: 2, farm: 4}, hostiles:{ soldier: 2, fly_unit: 3} ,defenses:{rocket: 1, sentry_gun: 1}},
              { buildings:{HQ:1, miner: 2, oreStore: 4, craft: 5, lab: 2, farm: 4}, hostiles:{ soldier: 4} ,defenses:{rocket: 4, sentry_gun: 5}}
             ]
var defenses = [];
var buildings = [];
var hostiles = [];
var aBot;
var wasLeft = 1;
var wasRight = -1;
var angle = 180;

Game.prototype = {

  preload: function () {
    this.optionCount = 1;
  },

  addMenuOption: function(text, callback) {
    var optionStyle = { font: '20pt TheMinion', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var txt = game.add.text(100, 20, text, optionStyle);
    txt.anchor.setTo(0.5);
    txt.stroke = "rgba(0,0,0,0";
    txt.strokeThickness = 4;
    var onOver = function (target) {
      target.fill = "#FEFFD5";
      target.stroke = "rgba(200,200,200,0.5)";
      txt.useHandCursor = true;
    };
    var onOut = function (target) {
      target.fill = "white";
      target.stroke = "rgba(0,0,0,0)";
      txt.useHandCursor = false;
    };
    txt.useHandCursor = true;
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback, this);
    txt.events.onInputOver.add(onOver, this);
    txt.events.onInputOut.add(onOut, this);

    this.optionCount ++;


  },
  checkFrame: function(anim) {
    var weaponAngle = parseInt(anim.currentFrame.name.replace('Spinning__', ''));
    // TODO: El ordering tendria que estar en el arma y no en la bala
    anim._parent.bulletType.fire(anim._parent, anim._parent.bulletType.weaponOrdering[weaponAngle-1]);
  },

  createSprite: function(x,y, sprite, bulletType) {
    var s =game.add.sprite(x, y , sprite);
    s.scale.setTo(0.5, 0.5);
    var anim = s.animations.add('spinning', Phaser.Animation.generateFrameNames('Spinning__', 1, 8, '', 3), 40, false, false);
    anim.enableUpdate = true;
    anim.onUpdate.add(this.checkFrame, anim);
    s.play('spinning', 10, true);
    s.bulletType = bulletType;
    s.enableBody = true;
    s.checkWorldBounds = true;
    var barConfig = {x: x, y: y, width: 50, height: 10, flipped: false, bar: {
      color: '#0000FF'
    },};
    myHealthBar = new HealthBar(game, barConfig);
    myHealthBar.setPercent(0);
    s.healthbar = myHealthBar;
    s.health = 0;
    game.physics.arcade.enable(s);
    s.body.immovable = true;
    return s;
  },

 createBuilding: function(x,y, name) {
    var s = game.add.sprite(x, y , name);
    s.scale.setTo(0.5, 0.5);
    var barConfig = {x: x, y: y, width: 50, height: 10, flipped: false, bar: {
      color: '#00FF00'
    },};
    myHealthBar = new HealthBar(game, barConfig);
    myHealthBar.setPercent(0);
    s.healthbar = myHealthBar;
    s.health = 0;
    game.physics.arcade.enable(s);
    s.body.collideWorldBounds = true;
    s.body.allowRotation = true;
    s.body.bounce.y = 0.3;
    s.body.bounce.x = 0.5;
    s.body.collideWorldBounds = true;
    s.body.immovable = true;

    return s;
  },

createLevel: function(number) {
   var currentLevel = levels[number];
   var background = game.add.sprite(0, 0, 'background');
   background.scale.setTo(0.6, 0.6);
   for (var key in currentLevel.buildings) {
       for (var i=0; i< currentLevel.buildings[key]; i++)
           buildings.push(this.createBuilding(game.world.randomX, game.world.randomY, key));
   }
   var gun;
   for (var key in currentLevel.defenses) {
       // TODO Crear el tipo Weapon y meter el tipo de bullet ahi
       for (var i=0; i< currentLevel.defenses[key]; i++){
           if (key === 'sentry_gun')
               gun = new Weapon.SingleBullet(game);
           else
               gun = new Weapon.Rockets(game)
           defenses.push(this.createSprite(game.world.randomX, game.world.randomY, key, gun));
       }
   }
   // hostiles
   for (var key in currentLevel.hostiles) {
       if (key === 'soldier')
           for (var i=0; i< currentLevel.hostiles[key]; i++)
               hostiles.push(this.createSoldier(game.world.randomX, game.world.randomY));
       else {
            for (var i=0; i< currentLevel.hostiles[key]; i++)
               hostiles.push(this.createFlyUnit(game.world.randomX, game.world.randomY));
       }
   }
 },
 createRobot: function (x,y,weapon){
        var s =game.add.sprite(x, y, 'bot');
        s.scale.setTo(0.6, 0.6);

        s.animations.add('run');
        s.animations.play('run', 10, true);
        game.physics.arcade.enable(s);

        s.body.collideWorldBounds = true;
        // s.body.allowRotation = true;
        s.gun = weapon;
        s.health = 0;
        var barConfig = {x: x, y: y, width: 50, height: 10, flipped: false};
        myHealthBar = new HealthBar(game, barConfig);
        myHealthBar.setPercent(0);
        s.healthbar = myHealthBar;
        return s;
 },
 createSoldier: function(x,y){
    var s =game.add.sprite(x, y, 'soldier');
    s.scale.setTo(1.0, 1.0);
    animation = [];
    for (i=0;i<104;i++)
        animation.push(i);

    s.animations.add('position1', animation, 10, true);
    s.animations.play('position1', 10, true);
    game.physics.arcade.enable(s);

    s.body.collideWorldBounds = true;
    s.body.allowRotation = true;
    s.health = 0;
    var barConfig = {x: x, y: y-10, width: 50, height: 10, flipped: false, bar: {
      color: '#FFFF00'
    }};
    myHealthBar = new HealthBar(game, barConfig);
    myHealthBar.setPercent(0);
    s.healthbar = myHealthBar;
    return s;
},
createFlyUnit: function(x,y){
    var s =game.add.sprite(x, y, 'fly_unit');
    s.scale.setTo(1.0, 1.0);
    animation = [];
    for (i=0;i<14;i++)
        animation.push(i);

    s.animations.add('position1', animation, 10, true);
    s.animations.play('position1', 10, true);
    game.physics.arcade.enable(s);

    s.body.collideWorldBounds = true;
    s.body.allowRotation = true;
    s.health = 0;
    var barConfig = {x: x, y: y-10, width: 50, height: 10, flipped: false, bar: {
      color: '#FFFF00'
    }};
    myHealthBar = new HealthBar(game, barConfig);
    myHealthBar.setPercent(0);
    s.healthbar = myHealthBar;
    return s;
},

  create_game: function () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.createLevel(0);
    robot = this.createRobot(100, 100, new Weapon.SingleBullet(game));
    cursors = game.input.keyboard.createCursorKeys();
  },

  create: function () {
    this.stage.disableVisibilityChange = false;
    //  game.add.sprite(0, 0, 'stars');
    this.create_game();
    this.addMenuOption('Quit ->', function (e) {
      this.game.state.start("GameOver");
    });
  },
  controlRobot: function(){
        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            robot.body.velocity.x = -140;
            if (wasRight)
                robot.scale.x *= -1;
            wasLeft = true;
            wasRight = false;
            angle = 180;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            robot.body.velocity.x = 140;
            if (wasLeft)
                robot.scale.x *= -1;
            wasRight = true;
            wasLeft = false;
            angle = 0;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            robot.body.velocity.y = -40;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            robot.body.velocity.y = 40;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            robot.gun.fire(robot, angle);
        }
        if (robot.healthbar)
            robot.healthbar.setPosition(robot.x, robot.y - 10);
  },
 shootYou: function(player, bulletType) {
    if (player.health < 100) {
        player.health += bulletType.parent.damageRate;
        player.healthbar.setPercent(player.health);
        bulletType.kill();
    } else {
        player.healthbar.clear();
        player.kill();
        location.reload();
    }
 },
 killStructure: function(structure, player){
    if (structure.health < 100) {
        structure.health += player.parent.damageRate;
        structure.healthbar.setPercent(structure.health);
    } else {
        structure.healthbar.clear();
        structure.kill();
    }
    player.kill();
},
 checkCollide: function() {
    console.log('collide');
  },
  update: function() {
    for (defense in defenses){
        game.physics.arcade.collide(robot, defenses[defense], this.checkCollide);
        game.physics.arcade.overlap(robot, defenses[defense].bulletType, this.shootYou, null, this);
        game.physics.arcade.overlap(defenses[defense], robot.gun, this.killStructure, null, this);
    }
    for (building in buildings){
        game.physics.arcade.collide(robot, buildings[building], this.checkCollide);
        game.physics.arcade.overlap(buildings[building], robot.gun, this.killStructure, null, this);
    }
    for (hostile in hostiles){
        game.physics.arcade.overlap(hostiles[hostile], robot.gun, this.killStructure, null, this);
    }
    this.controlRobot();
}

};
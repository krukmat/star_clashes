// Global Variables
var
  height = $(document).height(),
  width = $(document).width(),
  game = new Phaser.Game(width, height, Phaser.AUTO, 'game'),
  Main = function () {},
  gameOptions = {
    playSound: true,
    playMusic: true
  },
  musicPlayer;




Main.prototype = {

  preload: function () {
    game.load.image('stars',    'assets/images/stars.jpg');
    game.load.image('loading',  'assets/images/loading.png');
    game.load.image('brand',    'assets/images/logo.png');
    game.load.script('polyfill',   'lib/polyfill.js');
    game.load.script('utils',   'lib/utils.js');
    game.load.script('splash',  'states/Splash.js');
    this.preload_engine();
  },

  preload_engine: function() {
    game.load.image('background', 'assets/engine/asteroidBack.png', 2273, 1304);
    game.load.image('space', 'assets/engine/space.jpg', 2273, 1304);

    game.load.atlasJSONHash('bot', 'assets/engine/running_bot/view.png', 'assets/engine/running_bot/logic.json');
    game.load.atlasJSONHash('machine_gun', 'assets/engine/machine_gun/view.png', 'assets/engine/machine_gun/logic.json');
    game.load.atlasJSONHash('sentry_gun', 'assets/engine/sentry_gun/view.png', 'assets/engine/sentry_gun/logic.json');
    game.load.atlasJSONHash('rocket', 'assets/engine/rocket/view.png', 'assets/engine/rocket/logic.json');
    game.load.atlasJSONHash('soldier', 'assets/engine/soldier/sprites.png', 'assets/engine/soldier/sprites.js');
    game.load.atlasJSONHash('fly_unit', 'assets/engine/fly_unit/sprites.png', 'assets/engine/fly_unit/sprites.js');


    game.load.spritesheet('lab', 'assets/engine/lab/view.png', 180, 149);
    game.load.spritesheet('farm', 'assets/engine/farm/view.png', 180, 149);
    game.load.spritesheet('craft', 'assets/engine/craft/view.png', 180, 149);
    game.load.spritesheet('oreStore', 'assets/engine/oreStore/view.png', 180, 149);
    game.load.spritesheet('miner', 'assets/engine/miner/view.png', 180, 138);
    game.load.spritesheet('HQ', 'assets/engine/HQ/view.png', 180, 138);

    game.load.spritesheet('baddie', 'assets/engine/baddie.png', 32, 32);
    game.load.spritesheet('dude', 'assets/engine/dude.png', 32, 48);


    // Bullets loading up
    for (var i = 1; i <= 11; i++)
    {
        game.load.image('bullet' + i, 'assets/engine/bullets/bullet' + i + '.png');
    }
  },

  create: function () {
    game.state.add('Splash', Splash);
    game.state.start('Splash');
  }

};

game.state.add('Main', Main);
game.state.start('Main');

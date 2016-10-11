{"filter":false,"title":"hero.js","tooltip":"/js/hero.js","undoManager":{"mark":0,"position":0,"stack":[[{"group":"doc","deltas":[{"start":{"row":0,"column":0},"end":{"row":42,"column":2},"action":"remove","lines":["var BasicGame = {};","","BasicGame.Boot = function (game) {","","};","","BasicGame.Boot.prototype = {","","    init: function () {","","        this.input.maxPointers = 1;","","        this.stage.disableVisibilityChange = true;","","        if (this.game.device.desktop)","        {","            this.scale.pageAlignHorizontally = true;","        }","        else","        {","            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;","            //this.scale.setMinMax(480, 260, 800, 600);","            this.scale.forceLandscape = true;","            this.scale.pageAlignHorizontally = true;","            this.scale.setScreenSize(true);","            this.scale.refresh();","        }","","    },","","    preload: function () {","","        this.load.image('preloaderBackground', 'assets/images/logoscreen.png');","        this.load.image('preloaderBar', 'assets/images/loadingbar.png', 100, 10);","    },","","    create: function () {","","        this.state.start('Preloader');","","    }","","};"]},{"start":{"row":0,"column":0},"end":{"row":12,"column":1},"action":"insert","lines":["function Hero(game){","  this.game = game;","  this.sprite = null;","  this.anyCustomVariables = 5;","}","","Hero.prototype.create= function() {","  this.sprite = this.game.add.sprite(0, 0, 'hero');","}","","Hero.prototype.update = function(enemieGroup) {","  this.sprite.collide(enemieGroup);","}"]}]}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":12,"column":1},"end":{"row":12,"column":1},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1421048032821,"hash":"6cab1262469f00fb45c48b5482fc5053c6931c3a"}
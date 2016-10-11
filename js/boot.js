var BasicGame = {};

BasicGame.boot = function (game) {

};

BasicGame.boot.prototype = {

    init: function () {

        this.cache.destroy();

        this.input.maxPointers = 1;

        //this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop)
        {
            //this.scale.pageAlignHorizontally = true; //causes canvas to be off-centered
        }
        else
        {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            //this.scale.setMinMax(480, 260, 800, 600);
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
            this.scale.setScreenSize(true);
            this.scale.refresh();
        }

    },

    preload: function () {

        this.load.image('preloaderBackground', 'assets/textures/GUI/logoscreen.png');
        this.load.image('preloaderBar', 'assets/textures/GUI/loadingbar.png', 100, 10);
    },

    create: function () {

        this.state.start('preloader');

    }

};
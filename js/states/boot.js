var Skinny_Ninja = {};

Skinny_Ninja.boot = function (game) {

};

Skinny_Ninja.boot.prototype = {

    init: function() {

        this.input.maxPointers = 1;

        //toggles auto-pause if user changes focus
        //this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop)
        {
            //this.scale.pageAlignHorizontally = true; //bug: causes canvas to be off-centered
        }
        else
        {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(100, 60, 1000, 600);
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
            this.scale.setScreenSize(true);
            this.scale.refresh();
        }

    },

    preload: function() {

        //preload necessary assets for preloading state
        this.load.image('preload_background', 'assets/textures/GUI/logoscreen.png');
        this.load.image('loading_bar', 'assets/textures/GUI/loadingbar.png', 100, 10);
    },

    create: function() {

        this.state.start('preloader');

    }

};
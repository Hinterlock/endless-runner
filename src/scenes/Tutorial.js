class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");
    }

    preload() {

        //load images
        this.load.image('tutorial', './assets/tutorial.png');

    }

    create() {
        //add tutorial image
        this.tutorial = this.add.image(game.config.width/2, game.config.height/2, 'tutorial');
        
        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.start("playScene");

        }
    }
}


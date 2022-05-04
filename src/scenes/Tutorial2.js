class Tutorial2 extends Phaser.Scene {
    constructor() {
        super("tutorial2Scene");
    }

    preload() {

        //load images
        this.load.image('tutorial2', './assets/tutorial2.png');

    }

    create() {
        //add tutorial image
        this.tutorial2 = this.add.image(game.config.width/2, game.config.height/2, 'tutorial2');
        
        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.start("playScene");

        }
    }
}


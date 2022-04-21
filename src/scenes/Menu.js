class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
    }

    create() {
        this.add.text(20, 20, "Menu");

        // text config
        let menuConfig = {
            fontFamily: 'Comic Sans',
            fontSize: '28px',
            backgroundColor: '#f5d41b',
            color: '#1d3a69',
            align: 'middle',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        // menu text
        this.add.text(game.config.width/2, game.config.height/2 - 2*(borderUISize + borderPadding), ' Endless Runner ', menuConfig).setOrigin(0.5);

        // define keys
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyD)) {
            this.scene.start("playScene");
        }
    }
}
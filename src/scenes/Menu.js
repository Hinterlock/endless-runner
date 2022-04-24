class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio

        //load menu images
        this.load.image('title', './assets/title.png');
    }

    create() {
        this.add.text(20, 20, "Menu");

        //add title image
        this.title = this.add.image(game.config.width/2, game.config.height/2, 'title');

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

        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            console.log('hi');
            this.scene.start("tutorialScene");
        }
    }
}
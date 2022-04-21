class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
    }

    create() {
        this.add.text(20, 20, "Menu");
        this.scene.start("playScene");

        // text config

        // define keys
    }

    update() {
        
    }
}
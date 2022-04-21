class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images
        this.load.image('guy_stand', './assets/guy_stand.png');
        // load spritesheet
        //this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        this.add.text(20, 20, "Play");
        console.log('pog');
    }

    update() {
        this.p1Guy = new Guy(this, game.config.width/2, game.config.height/2, 'guy_stand').setOrigin(0, 0);
        
    }
}
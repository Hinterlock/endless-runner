class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images
        this.load.image('guy_stand', './assets/guy_stand.png');
        this.load.image('guy_slide', './assets/guy_slide.png');
        this.load.image('bus', './assets/bus.png');
        this.load.image('notebookbg', './assets/notebookbg.png');
        this.load.image('clouds', './assets/clouds.png');
        this.load.image('ground', './assets/ground.png');
        // load spritesheet
        //this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        //this.add.text(20, 20, "Play");
        //console.log('pog');

        //background
        this.notebookbg = this.add.tileSprite(0, 0, 970, 600, 'notebookbg').setOrigin(0, 0);
        this.clouds = this.add.tileSprite(0, 0, 0, 0, 'clouds').setOrigin(0, 0);

        this.ground = this.physics.add.staticGroup();
        this.ground.create(game.config.width/2, game.config.height - borderUISize, 'ground'); 
        
        this.p1Guy = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'guy_stand').setScale(0.3);

        //this.p1Guy.setBounce(0.2);
        this.p1Guy.setCollideWorldBounds(true);

        
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keySHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        
        this.physics.add.collider(this.p1Guy, this.ground);
        this.sliding = false;
    }

    update() {

        // background moving 
        this.clouds.tilePositionX -= -1;
        this.ground.x -= -3;



        if (this.p1Guy.body.touching.down && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            console.log("SPACE");
            this.p1Guy.setVelocityY(-650);
        }
        /*if (keySPACE.isDown) {
        }*/
        if (!this.sliding /*&& on ground*/&& Phaser.Input.Keyboard.JustDown(keySHIFT)) {
            this.p1Guy.setTexture('guy_slide');
            this.sliding = true;
            this.time.delayedCall(500, () => {
                this.sliding = false;
                this.p1Guy.setTexture('guy_stand');
            });
        }
    }
}
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
        this.load.image('forest', './assets/forest.png');
        this.load.image('groundEmpty', './assets/groundEmpty.png');
        this.load.image('slug', './assets/slug.png');
        // load spritesheet
        this.load.spritesheet('guy', './assets/spritesheet.png', {frameWidth: 393, frameHeight: 494, startFrame: 0, endFrame: 5});
    }

    create() {
        // background
        this.notebookbg = this.add.tileSprite(0, 0, 970, 600, 'notebookbg').setOrigin(0, 0);
        this.forest = this.add.tileSprite(0, 0, 970, 600, 'forest').setOrigin(0, 0);
        this.clouds = this.add.tileSprite(0, 0, 0, 0, 'clouds').setOrigin(0, 0);
        // 2 separate sprites for ground tiling and collision
        this.groundImg = this.add.tileSprite(game.config.width/2, game.config.height - borderUISize, 0, 0, 'ground');
        this.ground = this.physics.add.staticGroup();
        this.ground.create(game.config.width/2, game.config.height, 'groundEmpty').setOrigin(); 
        // create guy
        this.p1Guy = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'guy_stand').setScale(0.3);

        this.p1Guy.setCollideWorldBounds(true);

        //Attempt at spawning slugs
        //this.slug1 = new Slug(this, game.config.width, game.config.height - borderUISize, 'slug');

        

        // animation config
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('guy', {start: 0, end: 2}),
            frameRate: 6
        });
        this.anims.create({
            key: 'fall',
            frames: this.anims.generateFrameNumbers('guy', {start: 3, end: 5}),
            frameRate: 6
        });
        /*
        this.anims.create({
            key: 'fall',
            frames: this.anims.generateFrameNumbers('guy', {start: 6, end: 11}),
            frameRate: 6,
            repeat: -1
        });
        */

        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keySHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        
        this.physics.add.collider(this.p1Guy, this.ground);

        this.sliding = false;
        this.falling = false;
    }

    update() {
        //this.slug1.update();

        // background moving 
        this.clouds.tilePositionX -= -1;
        this.forest.tilePositionX -= -1.5;
        this.groundImg.tilePositionX -= -3;
        // falling animation
        if (this.p1Guy.body.velocity.y > 0 && !this.falling) {
            this.falling = true;
            console.log('ah');
            this.p1Guy.anims.play('fall');
        }

        // landing
        if (this.falling && this.p1Guy.body.touching.down) {
            this.falling = false;
            this.p1Guy.setTexture('guy_stand');
            //this.p1Guy.anims.play('run');
        }

        // jumping animation
        if (!this.sliding && this.p1Guy.body.touching.down && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.startJump(this.p1Guy);
        }
        // sliding
        if (!this.sliding && this.p1Guy.body.touching.down && Phaser.Input.Keyboard.JustDown(keySHIFT)) {
            this.startSlide(this.p1Guy);
        }

        
        // // check collisions
        // if(this.checkCollision(this.p1Guy, this.slug1)) {
        //     this.scene.restart();
        // }
    }

    // checkCollision(player, enemy) {
    //     // simple AABB checking
    //     if (player.x < enemy.x + enemy.width && 
    //         player.x + player.width > enemy.x && 
    //         player.y < enemy.y + enemy.height &&
    //         player.height + player.y > enemy. y) {
    //             console.log("BOOF");
    //             return true;
    //     } else {
    //         return false;
    //     }
    // }


    startJump(guy) {
        guy.setVelocityY(-650);
        guy.setTexture('guy');//remove
        guy.anims.play('jump');
    }
    
    startSlide(guy) {
        guy.setTexture('guy_slide');
        this.sliding = true;
        this.time.delayedCall(500, () => {
            this.sliding = false;
            guy.setTexture('guy_stand');//remove
            //this.p1Guy.anims.play('run');
        });
    }
}
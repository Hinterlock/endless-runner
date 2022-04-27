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
        this.load.image('turkey', './assets/turkey.png');
        // load spritesheet
        this.load.spritesheet('guy', './assets/spritesheet.png', {frameWidth: 393, frameHeight: 494, startFrame: 0, endFrame: 9});
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
        this.p1Guy = this.physics.add.sprite(game.config.width/2 - 150, game.config.height/2, 'guy_stand').setScale(0.3);
        this.p1Guy.setCollideWorldBounds(true);
        this.physics.add.collider(this.p1Guy, this.ground);
        this.p1Guy.body.setSize(300, 400, true);
        this.p1Guy.body.setOffset(this.p1Guy.body.offset.x, this.p1Guy.body.offset.y - 15);

        //Attempt at spawning slugs
        this.enemies = this.physics.add.group();
        this.physics.add.collider(this.enemies, this.ground);

        this.p1Score = 0;
        this.timer = 0;
        let scoreConfig = {
            fontFamily: 'Comic Sans MS',
            fontSize: '28px',
            backgroundColor: '#b0b3b4',
            color: ' #636869',
            align: 'right',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 100
          }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        this.gameover = false;

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
        
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('guy', {start: 6, end: 9}),
            frameRate: 6,
            repeat: -1
        });
        

        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keySHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        this.sliding = false;
        this.falling = false;
        this.spawn = true;


    }

    update() {
        if (this.spawn) {
            this.newEnemy();
        }
        for (let i = 0; i < this.enemies.children.size; i++) {
            this.enemies.children.entries[i].update();
            if(this.checkCollision(this.p1Guy, this.enemies.children.entries[i])) {
                this.scene.restart();
            }
        }

        if(this.gameover ==  false){
            this.timer += 1;
            if(this.timer % 6 == 0){
                this.p1Score += 1;
                this.scoreLeft.text = this.p1Score;
            }
            
        }
        // background moving 
        this.clouds.tilePositionX -= -1;
        this.forest.tilePositionX -= -1.5;
        this.groundImg.tilePositionX -= -3;
        // falling animation
        if (this.p1Guy.body.velocity.y > 0 && !this.falling && !this.sliding) {
            this.falling = true;
            this.p1Guy.anims.play('fall');
        }

        // landing
        if (this.falling && this.p1Guy.body.touching.down) {
            this.falling = false;
            this.p1Guy.anims.play('run');
        }

        // jumping animation
        if (!this.sliding && this.p1Guy.body.touching.down && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.startJump(this.p1Guy);
        }
        // sliding
        if (!this.sliding && this.p1Guy.body.touching.down && Phaser.Input.Keyboard.JustDown(keySHIFT)) {
            this.startSlide(this.p1Guy);
        }
    }

    newEnemy() {
        this.spawn = false;
        let n = Math.random();
        this.time.delayedCall(Math.random()*1500 + 1500, () => {
            if (n < 0.5) {
                this.enemies.add(new Slug(this, game.config.width + 150, game.config.height - borderUISize*4, 'slug').setScale(0.3));
            } else {
                let turk = new Turkey(this, game.config.width + 150, game.config.height - borderUISize*8, 'turkey').setScale(0.3);
                this.enemies.add(turk);
                turk.setAccelerationY(-1000);
            }
            this.spawn = true;
        });
    }

    checkCollision(player, enemy) {
        // simple AABB checking
        if (player.body.x < enemy.body.x + enemy.body.width && 
            player.body.x + player.body.width > enemy.body.x &&
            player.body.y < enemy.body.y + enemy.body.height &&
            player.body.y + player.body.height > enemy.body.y) {
                return true;
        } else {
            return false;
        }
    }


    startJump(guy) {
        guy.setVelocityY(-650);
        guy.anims.play('jump');
    }
    
    startSlide(guy) {
        guy.anims.stop();
        guy.setTexture('guy_slide');
        this.sliding = true;
        this.p1Guy.body.setSize(400, 200, true);
        this.p1Guy.body.setOffset(this.p1Guy.body.offset.x, this.p1Guy.body.offset.y + 85);
        this.time.delayedCall(500, () => {
            this.sliding = false;
            guy.setTexture('guy');
            this.p1Guy.anims.play('run');
            this.p1Guy.body.setSize(300, 400, true);
            this.p1Guy.body.setOffset(this.p1Guy.body.offset.x, this.p1Guy.body.offset.y - 15);
        });
    }
}
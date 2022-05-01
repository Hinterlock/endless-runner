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
        this.load.image('gameover', './assets/game_over.png')
        // load spritesheet
        this.load.spritesheet('guy', './assets/spritesheet.png', {frameWidth: 393, frameHeight: 494, startFrame: 0, endFrame: 9});
    }

    create() {
        // background
        this.notebookbg = this.add.tileSprite(0, 0, 970, 600, 'notebookbg').setOrigin(0, 0);
        this.forest = this.add.tileSprite(0, 0, 970, 600, 'forest').setOrigin(0, 0);
        this.clouds = this.add.tileSprite(0, 0, 0, 0, 'clouds').setOrigin(0, 0);

        // ground
        this.groundObj = this.add.tileSprite(game.config.width/2, game.config.height - borderUISize, 0, 0, 'ground');
        this.ground = this.physics.add.staticGroup();
        this.ground.add(this.groundObj);
        this.groundObj.body.setOffset(this.groundObj.body.offset.x, this.groundObj.body.offset.y + borderUISize);

        // create guy
        this.p1Guy = this.physics.add.sprite(game.config.width/8, game.config.height/2, 'guy_stand').setScale(0.42);
        this.p1Guy.setCollideWorldBounds(true);
        this.physics.add.collider(this.p1Guy, this.ground);
        this.p1Guy.body.setSize(300, 400, true);
        this.p1Guy.body.setOffset(this.p1Guy.body.offset.x, this.p1Guy.body.offset.y - 15);

        // bus
        this.bus = this.add.sprite(game.config.width*1.1, game.config.height*.60, 'bus').setScale(0.7);

        // enemy group
        this.enemies = this.physics.add.group();
        this.physics.add.collider(this.enemies, this.ground);

        // initialize score
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
            frameRate: 9,
            repeat: -1
        });
        

        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keySHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        //keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        this.sliding = false;
        this.falling = false;
        this.spawn = true;
        this.initSpd = 8;
        this.spd = this.initSpd;
        this.gameover = false;
        this.stumble = false;
    }

    update() {
        // enemy spawning
        if (this.spawn) {
            this.newEnemy();
        }

        // enemy updating (movement, deleting, and collison detection)
        for (let i = 0; i < this.enemies.children.size; i++) {
            let enemy = this.enemies.children.entries[i];
            enemy.update();
            if (this.stumble) {
                enemy.setX(enemy.x + 6);
            }
            if (enemy.x <= 0 - enemy.width) {
                this.enemies.remove(enemy, true, true);
            } else if(this.checkCollision(this.p1Guy, enemy) && enemy.isActive()) {
                enemy.deactivate();
                //console.log('a');
                this.spd = this.initSpd/4;
                this.stumble = true;
                this.time.delayedCall(300, () => {
                    //console.log('b');
                    this.spd = this.initSpd;
                    this.stumble = false;
                });
                // play tripping animation
            }
        }

        if(this.bus.x > game.config.width + 500){
            console.log("bus left");
            this.gameover = true;
        }
        this.bus.y += Math.sin(this.time.now/300);

        // score iterating
        if(this.gameover ==  false){
            this.timer += 1;
            if(this.timer % 6 == 0){
                this.p1Score += 1;
                this.scoreLeft.text = this.p1Score;
            }
        }
        else if(this.gameover == true){
            this.scene.start('endgameScene'); 
        }

        // background moving 
        this.clouds.tilePositionX += this.spd / 8;
        this.forest.tilePositionX += this.spd / 2.5;
        this.groundObj.tilePositionX += this.spd;

        // bus moving
        if (this.stumble) {
            this.bus.setX(this.bus.x + 3);
        }

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
        let n = Math.random(); // 50/50 chance of either slug or turkey
        this.time.delayedCall(Math.random()*1500 + 1500, () => {
            if (n < 0.5) { // slug
                this.enemies.add(new Slug(this, game.config.width + 50, game.config.height - borderUISize*4, 'slug', undefined, this.initSpd).setScale(0.3));
                // hitbox editing
                let slug = this.enemies.children.entries[this.enemies.children.size - 1];
                slug.body.setSize(500, 100, true);
                slug.body.setOffset(slug.body.offset.x, slug.body.offset.y + 20);
            } else { // turkey
                this.enemies.add(new Turkey(this, game.config.width + 150, game.config.height - borderUISize*8, 'turkey', undefined, this.initSpd).setScale(0.3));
                let turk = this.enemies.children.entries[this.enemies.children.size - 1];
                turk.body.setSize(400, 200, true);
                turk.body.setOffset(turk.body.offset.x, turk.body.offset.y + 20);
                turk.body.setAccelerationY(0 - game.config.physics.arcade.gravity.y);
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
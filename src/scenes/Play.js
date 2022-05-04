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
        this.load.image('trees', './assets/trees.png');
        this.load.image('animals', './assets/animals.png');
        this.load.image('bush_bg', './assets/bush_bg.png');
        this.load.image('bushes', './assets/bushes.png');
        this.load.image('groundEmpty', './assets/groundEmpty.png');
        this.load.image('slug', './assets/slug.png');
        this.load.image('turkey', './assets/turkey.png');
        this.load.image('student', './assets/student.png');
        this.load.image('gameover', './assets/game_over.png');
        this.load.image('bg', './assets/bg.png');
        this.load.image('forest', './assets/forest.png');
        // load spritesheet
        this.load.spritesheet('guy', './assets/spritesheet.png', {frameWidth: 393, frameHeight: 494, startFrame: 0, endFrame: 12});
        this.load.spritesheet('run', './assets/run_spritesheet.png', {frameWidth: 457, frameHeight: 577, startFrame: 0, endFrame: 16});
        this.load.spritesheet('jump', './assets/jump_spritesheet.png', {frameWidth: 457, frameHeight: 577, startFrame: 0, endFrame: 12});
        this.load.spritesheet('slide', './assets/slide_spritesheet.png', {frameWidth: 457, frameHeight: 577, startFrame: 0, endFrame: 17});
        this.load.spritesheet('trip', './assets/trip_spritesheet.png', {frameWidth: 457, frameHeight: 577, startFrame: 0, endFrame: 5});
        // load sound effects
        this.load.audio('jump', './assets/jump.mp3');
        this.load.audio('crash', './assets/crash.wav');
        //this.load.audio('pullaway', './assets/pullaway.wav');
    }

    create() {
        // background
        this.notebookbg = this.add.tileSprite(0, 0, 970, 600, 'notebookbg').setOrigin(0, 0);
        this.forest = this.add.tileSprite(0, 0, 2913, 600, 'forest').setOrigin(0, 0);
        this.trees = this.add.tileSprite(0, 0, 2913, 600, 'trees').setOrigin(0, 0);
        this.animals = this.add.tileSprite(0, 0, 970, 600, 'animals').setOrigin(0, 0);
        this.bush_bg = this.add.tileSprite(0, 0, 970, 600, 'bush_bg').setOrigin(0, 0);
        this.bushes = this.add.tileSprite(0, 0, 970, 600, 'bushes').setOrigin(0, 0);
        //this.clouds = this.add.tileSprite(0, 0, 0, 0, 'clouds').setOrigin(0, 0);

        // ground
        this.groundObj = this.add.tileSprite(game.config.width/2, game.config.height - borderUISize, 0, 0, 'ground');
        this.ground = this.physics.add.staticGroup();
        this.ground.add(this.groundObj);
        this.groundObj.body.setOffset(this.groundObj.body.offset.x, this.groundObj.body.offset.y + borderUISize);

        // create guy
        this.p1Guy = this.physics.add.sprite(game.config.width/8, game.config.height/2, 'run').setScale(0.42);
        this.p1Guy.setCollideWorldBounds(true);
        this.physics.add.collider(this.p1Guy, this.ground);
        this.p1Guy.body.setSize(200, 400, true);
        this.p1Guy.body.setOffset(this.p1Guy.body.offset.x + 50, this.p1Guy.body.offset.y - 15);


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
            color: ' #634c58',
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
            frames: this.anims.generateFrameNumbers('jump', {start: 0, end: 6}),
            frameRate: 6
        });
        this.anims.create({
            key: 'fall',
            frames: this.anims.generateFrameNumbers('jump', {start: 6, end: 12}),
            frameRate: 6
        });
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('run', {start: 0, end: 14}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'trip', 
            frames: this.anims.generateFrameNumbers('trip', {start: 0, end: 5}),
            frameRate: 6
        })
        this.anims.create({
            key: 'slide', 
            frames: this.anims.generateFrameNumbers('slide', {start: 3, end: 16}),
            frameRate: 10
        })

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
        this.slideDelay = false;
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
                if(enemy.isSlug == true){
                    console.log("lol");
                    this.gameover = true;
                }
                enemy.deactivate();
                this.spd = this.initSpd/4;
                this.stumble = true;
                this.time.delayedCall(300, () => {
                    this.spd = this.initSpd;
                    this.stumble = false;
                });
                this.sound.play('crash');
                // play tripping animation
                this.p1Guy.anims.play('trip');
                this.p1Guy.on('animationcomplete', () => {
                    this.p1Guy.anims.play('run');
                    this.p1Guy.body.setSize(200, 400, true);
                    this.p1Guy.body.setOffset(this.p1Guy.body.offset.x + 50, this.p1Guy.body.offset.y - 15);
                });
                
            }
        }

        if(this.bus.x > game.config.width + 500){
            this.gameover = true;
        }

        // score iterating
        if(this.gameover ==  false){
            this.timer += 1;
            if(this.timer % 6 == 0){
                this.p1Score += 1;
                this.scoreLeft.text = this.p1Score;
            }
        } else if(this.gameover == true){
            this.scene.start('endgameScene'); 
        }

        // background moving 
        //this.clouds.tilePositionX += this.spd / 8;
        this.trees.tilePositionX += this.spd / 4;
        this.animals.tilePositionX += this.spd / 4;
        this.bush_bg.tilePositionX += this.spd / 2;
        this.bushes.tilePositionX += this.spd;
        this.forest.tilePositionX += this.spd / 5;

        this.groundObj.tilePositionX += this.spd;

        // bus moving
        if (this.stumble) {
            this.bus.setX(this.bus.x + 3);
            //this.sound.play('pullaway'); holy fuck this is so loud i need to change it
        }
        this.bus.y += Math.sin(this.time.now/300)/2;

        // falling animation
        if (this.p1Guy.body.velocity.y > 0 && !this.falling && !this.sliding) {
            this.falling = true;
            this.p1Guy.anims.play('fall');
            this.p1Guy.body.setSize(200, 400, true);
            this.p1Guy.body.setOffset(this.p1Guy.body.offset.x + 50, this.p1Guy.body.offset.y - 15);
        }

        // landing
        if (this.falling && this.p1Guy.body.touching.down) {
            this.falling = false;
            this.p1Guy.anims.play('run');
            this.p1Guy.body.setSize(200, 400, true);
            this.p1Guy.body.setOffset(this.p1Guy.body.offset.x + 50, this.p1Guy.body.offset.y - 15);
        }

        // jumping animation
        if (!this.sliding && this.p1Guy.body.touching.down && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.startJump(this.p1Guy)
            this.sound.play('jump');
        }
        if (!this.falling && !this.p1Guy.body.touching.down && keySPACE.isDown) {
            this.p1Guy.setAccelerationY(-400);
        } else {
            this.p1Guy.setAccelerationY(0);
        }

        // sliding
        if (!this.sliding && this.p1Guy.body.touching.down && Phaser.Input.Keyboard.JustDown(keySHIFT) && !this.slideDelay) {
            this.startSlide(this.p1Guy);
        }
        if (this.sliding && this.p1Guy.body.touching.down && Phaser.Input.Keyboard.JustUp(keySHIFT) && !this.slideDelay) {
            this.endSlide(this.p1Guy);
        }
    }

    newEnemy() {
        this.spawn = false;
        let n = Math.random(); // 50/50 chance of either slug or turkey
        this.time.delayedCall(Math.random()*1500 + 1500, () => {
            if (n < 0.33) { // slug
                this.enemies.add(new Slug(this, game.config.width + 50, game.config.height - borderUISize*4, 'slug', undefined, this.initSpd).setScale(0.3));
                // hitbox editing
                let slug = this.enemies.children.entries[this.enemies.children.size - 1];
                slug.body.setSize(500, 100, true);
                slug.body.setOffset(slug.body.offset.x, slug.body.offset.y + 20);
            } else if (n < 0.66) { // turkey
                this.enemies.add(new Turkey(this, game.config.width + 150, game.config.height - borderUISize*8, 'turkey', undefined, this.initSpd).setScale(0.3));
                let turk = this.enemies.children.entries[this.enemies.children.size - 1];
                turk.body.setSize(400, 200, true);
                turk.body.setOffset(turk.body.offset.x, turk.body.offset.y + 20);
                turk.body.setAccelerationY(0 - game.config.physics.arcade.gravity.y);
            } else { //student
                this.enemies.add(new Student(this, game.config.width + 150, game.config.height - borderUISize*8, 'student', undefined, this.initSpd).setScale(0.375));
                let student = this.enemies.children.entries[this.enemies.children.size - 1];
                student.body.setSize(200, 450, true);
                student.body.setOffset(student.body.offset.x - 100, student.body.offset.y);
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
        guy.setVelocityY(-600);
        guy.anims.play('jump');
        this.p1Guy.body.setSize(200, 400, true);
        this.p1Guy.body.setOffset(this.p1Guy.body.offset.x + 50, this.p1Guy.body.offset.y - 15);
    }
    
    startSlide(guy) {
        guy.anims.stop();
        guy.setTexture('guy');
        this.p1Guy.anims.play('slide');
        this.sliding = true;
        this.p1Guy.body.setSize(400, 200, true);
        this.p1Guy.body.setOffset(this.p1Guy.body.offset.x, this.p1Guy.body.offset.y + 85);
    }

    endSlide(guy) {
        this.slideDelay = true;
        this.sliding = false;
        guy.setTexture('guy');
        this.p1Guy.anims.play('run');
        this.p1Guy.body.setSize(200, 400, true);
        this.p1Guy.body.setOffset(this.p1Guy.body.offset.x + 50, this.p1Guy.body.offset.y - 15);
        this.time.delayedCall(700, () => {
            this.slideDelay = false;
        });
    }
}
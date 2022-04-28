class Endgame extends Phaser.Scene {
    constructor() {
        super("endgameScene");
    }


    preload() {

        //load images
        this.load.image('gameover', './assets/game_over.png')

    }

    create(){
        //define end image
        this.endgame = this.add.image(game.config.width/2, game.config.height/2, 'gameover');
        // define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    }

    update(){

        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.start("playScene");
        }
    }
}
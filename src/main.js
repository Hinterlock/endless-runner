//Endless Runner Project
//Authors: Aidan Adams, Lee Coronilia, Kirsten Lindblad, Angela Yim
let config = {
    type: Phaser.AUTO,
    width: 970,
    height: 600,
    backgroundColor: '#1d3a69',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: true
        }
    },
    scene: [ Menu, Tutorial, Tutorial2, Play, Endgame ]
}
let game = new Phaser.Game(config);
// set UI sizes
let borderUISize = game.config.height / 20;
let borderPadding = borderUISize / 3;
// reserve keyboard vars
let keySPACE, keySHIFT, keyR;
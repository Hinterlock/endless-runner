class Guy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        
        // add obj to existing scene
        scene.add.existing(this);
    }
}
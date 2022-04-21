class Slug extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.moveSpeed = game.settings.spaceshipSpeed;
    }

    update() {
        //move slug left
        this.x -= this.moveSpeed;
        //wrap around
        if (this.x <= 0 - this.width) {
            this.reset();
        }
    }
    
    reset() {
        this.x = game.config.width;
    }
}
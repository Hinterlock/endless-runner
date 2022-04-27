class Turkey extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, spd) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.moveSpeed = spd + 5;
    }


    update() {
        //move left
        this.x -= this.moveSpeed;
        //wrap around
        if (this.x <= 0 - this.width) {
            this.destroy();
        }
    }
}
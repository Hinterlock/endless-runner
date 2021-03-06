class Slug extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, spd) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.moveSpeed = spd;
        this.active = true;
        this.isSlug = true;
    }
    isActive() {
        return this.active;
    }
    deactivate() {
        this.active = false;
    }

    update() {
        //move slug left
        this.x -= this.moveSpeed;
    }
}
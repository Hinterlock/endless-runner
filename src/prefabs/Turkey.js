class Turkey extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, spd) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.moveSpeed = spd + 5;
        this.active = true;
        this.isSlug = false;
    }

    deactivate() {
        this.active = false;
    }
    isActive() {
        return this.active;
    }
    
    update() {
        //move left
        this.x -= this.moveSpeed;
    }
}
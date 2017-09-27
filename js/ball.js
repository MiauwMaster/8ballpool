/**
 * Tobias en Nick proudly present:
 * 8-ball pool. Balls.
 */

class Ball extends THREE.Mesh{
    constructor(id, x, z, type){
        var textureLoader = new THREE.TextureLoader();
        var ballGeometry = new THREE.SphereGeometry(0.5, 20, 50);
        var ballMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load('textures/Ball'+id+'.jpg')});
        super(ballGeometry, ballMaterial);
        this.position.set(x, 0.5, z);
        this.rotation.set(0, Math.PI, Math.PI / 2);
        this.direction = new THREE.Vector3(0,0,0);
        this.direction.normalize();
        this.speedmultiplier = 0;
        this.speed = new THREE.Vector3(0,0,0);
        this.ballNr = id;
        this.ballType = type;
        scene.add(this);
    }
}
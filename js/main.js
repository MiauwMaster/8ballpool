/**
 * Tobias en Nick proudly present:
 * 8-ball pool.
 */

var scene, camera, renderer, controls, holes = [], balls = [], cuePivot, player = 0, pottedBalls = [[],[]], ballPotted, wrongPotted, type = ["", ""], shotStarted, accelerate = true, shotSpeed = 0, soundEnabled = true
var maxShotSpeed = 1.5;
var deceleration = 0.989;
var winner = new Audio('sounds/winnerwinnerchickendinner.mp3');

function initScene() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.up = new THREE.Vector3(0,1,0);
    scene.add(camera);

    var light = new THREE.AmbientLight(0x0d0d0d, 5); // soft white ambient light
    scene.add(light);

    var tableLight1 = new TableLight(-10, 8, 0);
    var tableLight2 = new TableLight(12, 8, 0);

    var holelight1 = new TableLight(-19.5, 5, -11.5);
    var holelight2 = new TableLight(0, 5, -12);
    var holelight3 = new TableLight(19.5, 5, -11.5);
    var holelight4 = new TableLight(-19.5, 5, 11.5);
    var holelight5 = new TableLight(0, 5, 12);
    var holelight6 = new TableLight(19.5, 5, 11.5);






    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0, 1);
    document.body.appendChild(renderer.domElement);
    document.getElementById("turn").innerHTML = ("Player " + (player + 1));

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    controls.enableZoom = true;
    controls.enablePan = true;

    controls.minDistance = 10;
    controls.maxDistance = 30;

    controls.maxPolarAngle = 0.49 * Math.PI;


    camera.position.set(-170, 150, 0);

}

function initTable(){
    var textureLoader = new THREE.TextureLoader();
    var tableGeometry = new THREE.BoxGeometry(42, 1, 26);
    var tableMaterial = new THREE.MeshPhongMaterial({map: textureLoader.load('textures/laken.jpg')});
    var table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.set(0,-0.5,0);

    var xWallGeometry = new THREE.BoxGeometry(17.5, 1, 1);
    var zWallGeometry = new THREE.BoxGeometry(1, 1, 21);
    var xBorderGeometry = new THREE.BoxGeometry(44,5,1);
    var zBorderGeometry = new THREE.BoxGeometry(1 ,5, 26);


    var wallMaterial = new THREE.MeshPhongMaterial({map: textureLoader.load('textures/Keu.jpg')});
    var wallData = [
        {posX: -9.75, posY: 1, posZ: -12.5, geometry: xWallGeometry},
        {posX: 9.75, posY: 1, posZ: -12.5, geometry: xWallGeometry},
        {posX: -9.75, posY: 1, posZ: 12.5, geometry: xWallGeometry},
        {posX: 9.75, posY: 1, posZ: 12.5, geometry: xWallGeometry},
        {posX: -20.5, posY: 1, posZ: 0, geometry: zWallGeometry},
        {posX: 20.5, posY: 1, posZ: 0, geometry: zWallGeometry},
        {posX: 0, posY: -1, posZ: -13.5, geometry: xBorderGeometry},
        {posX: 0, posY: -1, posZ: 13.5, geometry: xBorderGeometry},
        {posX: -21.5, posY: -1, posZ: 0, geometry: zBorderGeometry},
        {posX: 21.5, posY: -1, posZ: 0, geometry: zBorderGeometry}
    ];

    var leg1Geometry = new THREE.BoxGeometry(3, 10, 3);
    var leg2Geometry = new THREE.BoxGeometry(3, 10, 3);
    var leg3Geometry = new THREE.BoxGeometry(3, 10, 3);
    var leg4Geometry = new THREE.BoxGeometry(3, 10, 3);

    var legMaterial = new THREE.MeshPhongMaterial({map: textureLoader.load('textures/tableleg.jpg')});
    var legData = [
        {posX:-19.5 , posY:-5, posZ:-11.5, geometry:leg1Geometry},
        {posX:19.5, posY:-5, posZ:11.5, geometry:leg2Geometry},
        {posX:-19.5, posY:-5, posZ:11.5, geometry:leg3Geometry},
        {posX:19.5, posY:-5, posZ:-11.5, geometry:leg4Geometry}
    ];

    for(var i = 0; i < legData.length; i++){
        var leg = new THREE.Mesh(legData[i].geometry, legMaterial);
        leg.position.set(legData[i].posX, legData[i].posY, legData[i].posZ);
        table.add(leg);
    }

    for(var i = 0; i < wallData.length; i++){
        var wall = new THREE.Mesh(wallData[i].geometry, wallMaterial);
        wall.position.set(wallData[i].posX, wallData[i].posY, wallData[i].posZ);
        table.add(wall);
    }

    var holeGeometry = new THREE.CircleGeometry(1, 32);
    var holeMaterial = new THREE.MeshLambertMaterial({color: 0x1d283b});
    var holePositions = [
        {x: -19.5, y: 0.51, z: -11.5},
        {x: 0, y: 0.51, z: -12},
        {x: 19.5, y: 0.51, z: -11.5},
        {x: -19.5, y: 0.51, z: 11.5},
        {x: 0, y: 0.51, z: 12},
        {x: 19.5, y: 0.51, z: 11.5}
    ];

    for(var j = 0; j < holePositions.length; j++){
        var hole = new THREE.Mesh(holeGeometry, holeMaterial);
        hole.position.set(holePositions[j].x, holePositions[j].y, holePositions[j].z);
        hole.rotation.x = Math.PI * -0.5;
        holes.push(hole);
        table.add(hole);
    }

    scene.add(table);
}

function initBalls(){
    var ballData = [
        {id: 0, x: -10, z: 0, type: ""},
        {id: 1, x: 10, z: 0, type: "full"},
        {id: 2, x: 11, z: -0.5, type: "full"},
        {id: 3, x: 12, z: 1, type: "full"},
        {id: 4, x: 13, z: -1.5, type: "full"},
        {id: 5, x: 14, z: 2, type: "full"},
        {id: 6, x: 14, z: -1, type: "full"},
        {id: 7, x: 13, z: 0.5, type: "full"},
        {id: 8, x: 12, z: 0, type: "full"},
        {id: 9, x: 11, z: 0.5, type: "half"},
        {id: 10, x: 12, z: -1, type: "half"},
        {id: 11, x: 13, z: 1.5, type: "half"},
        {id: 12, x: 14, z: -2, type: "half"},
        {id: 13, x: 14, z: 1, type: "half"},
        {id: 14, x: 13, z: -0.5, type: "half"},
        {id: 15, x: 14, z: 0, type: "half"}
    ];

    for (var i = 0; i < ballData.length; i++) {
        var data = ballData[i];
        balls.push(new Ball(data.id, data.x, data.z, data.type));
    }
    balls[0].rotation.set(0, 0, 0);
    balls[0].direction.set(0.5, 0, 0);
}

function initCue(){
    var textureLoader = new THREE.TextureLoader();
    var cueMaterial = new THREE.MeshPhongMaterial({map: textureLoader.load('textures/hout.jpg')});
    var cueGeometry = new THREE.CylinderGeometry(0.05, 0.2, 15, 32, 32);
    var cueMesh = new THREE.Mesh(cueGeometry, cueMaterial);
    cueGeometry.translate(0, -9, 0);
    cueMesh.rotation.z = Math.PI / 2;
    cueMesh.rotation.z = -0.55 * Math.PI;
    cueMesh.position.y = 0;

    cuePivot = new THREE.Object3D();
    //cuePivot.rotation.z = 0.95 * Math.PI;
    cuePivot.add(cueMesh);
    balls[0].add(cuePivot);
}

//Draaien van de cue om de witte bal heen.
function rotateCue(angle) {
    if (checkReady() && balls[0].children.length > 0) {
        balls[0].rotation.y += angle;
        balls[0].direction.x = Math.cos(balls[0].rotation.y) / 2;
        balls[0].direction.z = Math.sin(balls[0].rotation.y) / -2;
    }
}

//Check of alle ballen stil liggen.
function checkReady() {
    for (var i = 0; i < balls.length; i++) {
        if (balls[i].speedmultiplier != 0) {
            return false
        }
    }
    return true;
}

//Balbewegingberekingen
function MoveBall(ball) {
    ball.position.add(ball.speed.copy(ball.direction).multiplyScalar(ball.speedmultiplier));
    ball.rotation.x += ball.speed.z / 0.5;
    ball.rotation.z += ball.speed.x / 0.5;
    if (ball.speedmultiplier > 0.04) {
        ball.speedmultiplier *= deceleration;
    }
    else {
        ball.speedmultiplier = 0;
    }
}

function CheckCollision(ball) {
    var distance;
    //if collision met wall, wordt direction omgedraaid.
    if (ball.position.x >= 19.5 || ball.position.x <= -19.5) {
        ball.direction.x *= -1;
    }
    if (ball.position.z >= 11.5 || ball.position.z <= -11.5) {
        ball.direction.z *= -1;
    }
    //hole collisions
    for(var i = 0; i < holes.length; i++){
        var cHole = holes[i];
        //If bijna collision
        if(ball.position.x + 1.5 > cHole.position.x
            && ball.position.x < cHole.position.x + 1.5
            && ball.position.z + 1.5 > cHole.position.z
            && ball.position.z < cHole.position.z + 1.5){
            distance = Math.sqrt(
                ((ball.position.x - cHole.position.x) * (ball.position.x - cHole.position.x))
                + ((ball.position.z - cHole.position.z) * (ball.position.z - cHole.position.z))
            );
            //If collision
            if(distance < 1){
                potBall(ball);
            }
        }
    }
    //ball collisions
    for (var j = 0; j < balls.length; j++) {
        var cBall = balls[j];
        if (cBall != ball) {
            //If bijna collision
            if (ball.position.x + 1 > cBall.position.x
                && ball.position.x < cBall.position.x +1
                && ball.position.z + 1 > cBall.position.z
                && ball.position.z < cBall.position.z +1){
                distance = Math.sqrt(
                    ((ball.position.x - cBall.position.x) * (ball.position.x - cBall.position.x))
                    + ((ball.position.z - cBall.position.z) * (ball.position.z - cBall.position.z))
                );
                //If collision
                if (distance < 1) {
                    if(soundEnabled) new Audio('sounds/biem.mp3').play();
                    var collisionPointX = (ball.position.x * 0.5) + (cBall.position.x * 0.5);
                    var collisionPointZ = (ball.position.z * 0.5) + (cBall.position.z * 0.5);
                    ball.direction.set(ball.position.x - collisionPointX, 0, ball.position.z - collisionPointZ);
                    cBall.direction.set(cBall.position.x - collisionPointX, 0, cBall.position.z - collisionPointZ);
                    cBall.speedmultiplier = ball.speedmultiplier;
                    ball.speedmultiplier *= 0.5;
                }
            }
        }
    }
}

function potBall(ball){
    //ballNr 0 = witte bal.
    if(ball.ballNr == 0){
        wrongPotted = true;
        ball.position.set(-10,0.5,0);
        ball.speedmultiplier = 0;
    }
    //ballNr 8 = zwarte bal
    else if(ball.ballNr == 8){
        scene.remove(ball);
        if(soundEnabled) winner.play();
        //Als speler zwarte bal pot nadat alle ballen zijn kleur zijn gepot, heeft hij gewonnen.
        if(pottedBalls[player].length == 7){
            pottedBalls[player].push(balls.splice(balls.indexOf(ball), 1));
            appendImg(ball.ballNr, player);
            document.getElementById("winner").innerHTML = "PLAYER "+(player + 1)+" WON!!";
        }
        //Als speler zwarte bal pot, zonder alle ballen van zijn kleur te hebben gepot, heeft hij verloren.
        else{
            pottedBalls[player ? 0 : 1].push(balls.splice(balls.indexOf(ball), 1));
            appendImg(ball.ballNr, player);
            document.getElementById("winner").innerHTML = "PLAYER "+(player ? 1 : 2)+" WON!";
        }
    }
    //Alle andere ballen
    else {
        //check of ball reeds eerder gepot is.
        if(pottedBalls[0].indexOf(ball) == -1 || pottedBalls[1].indexOf(ball) == -1){
            scene.remove(ball);
            //Als de spelers wel een baltype toegewezen hebben gekregen.
            if(type[player] != ""){
                //Als de speler een bal gepot van zijn baltype
                if (type[player] == ball.ballType){
                    ballPotted = true;
                    pottedBalls[player].push(balls.splice(balls.indexOf(ball), 1));
                    appendImg(ball.ballNr, player);
                }
                //Als de speler een bal gepot van de tegenstander zijn baltype
                else{
                    wrongPotted = true;
                    pottedBalls[player ? 0 : 1].push(balls.splice(balls.indexOf(ball), 1));
                    appendImg(ball.ballNr, player ? 0 : 1);
                }
            }
            //Als de spelers nog geen baltype toegewezen hebben gekregen.
            else{
                ballPotted = true;
                type[player] = ball.ballType;
                type[player ? 0 : 1] = type[player] == "half" ? "full" : "half";
                pottedBalls[player].push(balls.splice(balls.indexOf(ball), 1));
                appendImg(ball.ballNr, player);
            }
        }
    }
}

//Voeg ballen toe aan scorebord.
function appendImg(ballNr, player){
    var img = document.createElement("img");
    img.src = "textures/Ball"+ballNr+".jpg";
    document.getElementById("player"+player).appendChild(img);
}

function render() {
    requestAnimationFrame(render);

    controls.target.copy(balls[0].position);
    controls.update();

    for (var i = 0; i < balls.length; i++) {
        var ball = balls[i];
        if (ball.speedmultiplier > 0) {
            MoveBall(ball);
            CheckCollision(ball);
        }
    }
    //Add cue als alle ballen stil liggen en er nog geen cue is.
    if (checkReady() && balls[0].children.length == 0) {
        balls[0].rotation.set(0, 0, 0);
        balls[0].direction.set(0.5, 0, 0);
        balls[0].add(cuePivot);
        //Als bal niet gepot of verkeerde gepot is, andere speler aan de beurt.
        if(!ballPotted || wrongPotted){
            player = player ? 0 : 1;
        }
        document.getElementById("turn").innerHTML = ("Player " + (player + 1));
    }
    if(shotStarted){
        if(shotSpeed <= 0){
            accelerate = true;
        }
        if(shotSpeed >= maxShotSpeed){
            accelerate = false
        }
        shotSpeed = accelerate ? shotSpeed + maxShotSpeed / 150 : shotSpeed - maxShotSpeed / 150;
        document.getElementById("shotProgress").style.height = (shotSpeed * 100 / maxShotSpeed) + "%";
    }
    renderer.render(scene, camera);
}

document.addEventListener("keydown", function (keycode) {
    var key = keycode.key;
    switch (key) {
        //Spacebar om bal te schieten.
        case " ":
            //Schieten van ball alleen mogelijk als cue aan witte bal vastzit.
            if (balls[0].children.length > 0) {
                if(shotStarted){
                    ballPotted = false;
                    wrongPotted = false;
                    shotStarted = false;
                    balls[0].speedmultiplier = shotSpeed;
                    balls[0].remove(cuePivot);
                    shotSpeed = 0;
                    document.getElementById("shotProgress").style.height = 0;
                }
                else{
                    shotStarted = true;
                }
            }
            break;
        //Keys om de Cue te rotaten om de witte bal. Hoofdletters voor grotere stapppen.
        case "a":
            rotateCue(-0.01);
            break;
        case "d":
            rotateCue(0.01);
            break;
        case "A":
            rotateCue(-0.1);
            break;
        case "D":
            rotateCue(0.1);
            break;
        case "p":
            console.log("blackx= " + balls[8].position.x);
            console.log("blacky= " + balls[8].position.y);
            console.log("blackz= " + balls[8].position.z);
            break;
    }
});

initScene();
initTable();
initBalls();
initCue();
render();


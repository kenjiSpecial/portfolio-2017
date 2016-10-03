"use strict";

const TweenMax = require('gsap');
const glslify = require('glslify');
const THREE = require('three');
const Stats = require('stats.js');
const GUI = require('dat-gui').GUI;

var camera, scene, renderer, mouse, stats, geometry, shaderMaterial, mesh, clock;
var isLoop;

(() => {
    init();
    isLoop = true;
    TweenMax.ticker.addEventListener("tick", loop);
})()

function init() {
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    scene = new THREE.Scene();

    mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2));;
    scene.add(mesh);
    
    gui = new GUI();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);

    stats = new Stats();
    clock = new THREE.Clock();
    document.body.appendChild( stats.dom );

    document.body.appendChild(renderer.domElement);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
}

function loop() {
    var delta = clock.getDelta();


    renderer.render(scene, camera);
    stats.update()
}


function onDocumentMouseMove(event){
    event.preventDefault();
    if(!mouse) mouse = new THREE.Vector2();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
}

window.addEventListener("resize", function(ev){
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('keydown', function(ev){
    switch(ev.which){
        case 27:
            isLoop = !isLoop;
            if(isLoop) {
                clock.stop();
                TweenMax.ticker.addEventListener("tick", loop);
            }else{
                clock.start();
                TweenMax.ticker.removeEventListener("tick", loop);
            }
            break;
    }
});

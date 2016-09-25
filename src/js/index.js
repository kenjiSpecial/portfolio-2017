"use strict";

const TweenMax = require('gsap');
const glslify = require('glslify');
const THREE = require('three');
const Stats = require('stats.js');

var camera, scene, renderer, mouse, stats, geometry, shaderMaterial, mesh, clock;
var isLoop;

function init() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    scene = new THREE.Scene();
    geometry = new THREE.BoxGeometry(200, 200, 200);
    shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: glslify('./shaders/shader.vert'),
        fragmentShader: glslify('./shaders/shader.frag')
    });

    mesh = new THREE.Mesh(geometry, shaderMaterial);
    scene.add(mesh);

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

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;


    renderer.render(scene, camera);
    stats.update()
}

require('domready')(() => {
    init();
    isLoop = true;
    TweenMax.ticker.addEventListener("tick", loop);
});

function onDocumentMouseMove(event){
    event.preventDefault();
    if(!mouse) mouse = new THREE.Vector2();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
}

window.addEventListener("resize", function(ev){
    camera.aspect = window.innerWidth / window.innerHeight;
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
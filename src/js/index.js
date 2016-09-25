"use strict";

const TweenMax = require('gsap');
const glslify = require('glslify');
const THREE = require('three');

var camera, scene, renderer, mouse;
var geometry, shaderMaterial, mesh;

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

    document.body.appendChild(renderer.domElement);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
}

function loop() {
    requestAnimationFrame(loop);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render(scene, camera);
}

require('domready')(() => {
    init();

    TweenMax.ticker.addEventListener("tick", loop);
});

function onDocumentMouseMove(event){
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
}

window.addEventListener("resize", function(ev){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
});

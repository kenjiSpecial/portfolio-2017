const glslify = require('glslify');

const THREE = require('three');

var camera, scene, renderer;
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
}

function loop() {
    requestAnimationFrame(loop);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render(scene, camera);
}

require('domready')(() => {
    init();
    loop();
});

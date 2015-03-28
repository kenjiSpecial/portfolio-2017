var fragmentText = require('./shaders/shader.frag')();
var vertexText = require('./shaders/shader.vert')();

const THREE = require('three');

var camera, scene, renderer;
var geometry, shaderMaterial, mesh;

function init () {
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 1000;

  scene = new THREE.Scene();
  console.log(vertexText);
  geometry = new THREE.BoxGeometry( 200, 200, 200 );
  shaderMaterial = new THREE.ShaderMaterial( {
    vertexShader   : vertexText,
    fragmentShader : fragmentText
  } );

  mesh = new THREE.Mesh( geometry, shaderMaterial );
  scene.add( mesh );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0x000000 );

  document.body.appendChild( renderer.domElement );
}

function loop () {
  requestAnimationFrame( loop );

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;

  renderer.render( scene, camera );
}

require('domready')(() => {
  init();
  loop();
});

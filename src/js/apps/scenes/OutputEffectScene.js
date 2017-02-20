"use strict";
const THREE = require('three');
const glslify = require('glslify');
window.THREE = require('three');
const fxaa = require('three-shader-fxaa')


export default class PostEffectScene extends THREE.Scene {
    constructor() {
        super()
        this.camera = new THREE.OrthographicCamera( 1 / - 2, 1 / 2, 1 / 2, 1 / - 2, .00001, 1000 );
        let mat = new THREE.ShaderMaterial(fxaa());

        this.camera.position.z = 3;
        let plane = new THREE.PlaneGeometry(1, 1);
        this.planeMesh = new THREE.Mesh(plane, mat);
        this.add(this.planeMesh);

        this.resize();
    }
    render(renderer, texture){
        this.planeMesh.material.uniforms.tDiffuse.value = texture;
        renderer.render(this, this.camera);
    }
    resize(){
        this.planeMesh.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    }
}
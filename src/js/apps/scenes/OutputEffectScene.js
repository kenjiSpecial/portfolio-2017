"use strict";
const THREE = require('three');
const glslify = require('glslify');
// window.THREE = require('three');
const fxaa = require('three-shader-fxaa')


export default class PostEffectScene extends THREE.Scene {
    constructor() {
        super()
        this.camera = new THREE.OrthographicCamera( 1 / - 2, 1 / 2, 1 / 2, 1 / - 2, .00001, 1000 );
        // let mat = new THREE.ShaderMaterial(fxaa());
        let mat = new THREE.ShaderMaterial(
            {
                uniforms: {
                    tDiffuse: { type: 't', value: null },
                    resolution: { type: 'v2', value:  new THREE.Vector2(window.innerWidth, window.innerHeight) },
                    uSpaceRate : {value : 0},
                    uTime : {value : 0},
                    uMouse : {value : new THREE.Vector2(0.5, 0.5)}
                },
                vertexShader: glslify('../../shaders/copy.vert'),
                fragmentShader: glslify('../../shaders/copy.frag')
            }
        )

        this.camera.position.z = 3;
        let plane = new THREE.PlaneGeometry(1, 1);
        this.planeMesh = new THREE.Mesh(plane, mat);
        this.add(this.planeMesh);

        this.resize();
    }
    update(delta = 1/60, appModel, mouse){
        this.planeMesh.material.uniforms.uTime.value += delta;
        this.planeMesh.material.uniforms.uSpaceRate.value = appModel.spaceRate;

        if(mouse){
            this.planeMesh.material.uniforms.uMouse.value.x = (mouse.x + 1) / 2;
            this.planeMesh.material.uniforms.uMouse.value.y = (mouse.y + 1) / 2;
        }
    }
    render(renderer, texture){
        this.planeMesh.material.uniforms.tDiffuse.value = texture;
        renderer.render(this, this.camera);
    }
    resize(){
        this.planeMesh.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    }
}
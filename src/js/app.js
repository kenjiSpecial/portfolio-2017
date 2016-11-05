'use strict';

const TweenMax = require('gsap');
const glslify = require('glslify');
const THREE = require('three');
const Stats = require('stats.js');
const dat = require('dat-gui');

export default class App {
    constructor(params) {
        this.params = params || {};
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.z = 1000;

        this.scene = new THREE.Scene();

        this.mesh = this.createMesh()
        this.scene.add(this.mesh);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.dom = this.renderer.domElement;

        if(this.params.isDebug){
            this.stats = new Stats();
            document.body.appendChild(this.stats.dom);
            this.dat = new dat.GUI();

        }

        this.clock = new THREE.Clock();

        this.resize();
    }
    createMesh() {
        var geometry = new THREE.BoxGeometry(200, 200, 200);
        var shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: glslify('./shaders/shader.vert'),
            fragmentShader: glslify('./shaders/shader.frag')
        });
        var mesh = new THREE.Mesh(geometry, shaderMaterial);
        return mesh;
    }
    animateIn() {
        TweenMax.ticker.addEventListener('tick', this.loop, this);
    }
    loop() {
        var delta = this.clock.getDelta();

        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.02;


        this.renderer.render( this.scene, this.camera);
        if(this.stats) this.stats.update();

    }
    animateOut() {
        TweenMax.ticker.removeEventListener('tick', this.loop, this);
    }
    onMouseMove(mouse) {

    }
    onKeyDown(ev) {
        switch (ev.which) {
            case 27:
                this.isLoop = !this.isLoop;
                if (this.isLoop) {
                    this.clock.stop();
                    TweenMax.ticker.addEventListener('tick', this.loop, this);
                } else {
                    this.clock.start();
                    TweenMax.ticker.removeEventListener('tick', this.loop, this);
                }
                break;
        }
    }
    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    destroy() {

    }

}

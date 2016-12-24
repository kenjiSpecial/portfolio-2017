'use strict';

import  {PerspectiveCamera, Scene, WebGLRenderer, BoxGeometry, Clock, ShaderMaterial, Mesh} from 'three';
var dat = require('dat-gui');

const TweenMax = require('gsap');
const glslify = require('glslify');
const Stats = require('stats.js');

export default class App {
    constructor(params){
        this.params = params || {};
        this.camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.z = 1000;

        this.scene = new Scene();

        this.mesh = this.createMesh();
        this.scene.add(this.mesh);

        this.renderer = new WebGLRenderer({
            antialias: true
        });
        this.dom = this.renderer.domElement;

        if(this.params.isDebug){
            this.stats = new Stats();
            document.body.appendChild(this.stats.dom);
            this._addGui();
        }

        this.clock = new Clock();

        this.resize();
    }
    
    _addGui(){
        this.gui = new dat.GUI();
    }
    
    createMesh(){
        let geometry = new BoxGeometry(200, 200, 200);
        let shaderMaterial = new ShaderMaterial({
            vertexShader: glslify('./shaders/shader.vert'),
            fragmentShader: glslify('./shaders/shader.frag')
        });
        let mesh = new Mesh(geometry, shaderMaterial);
        return mesh;
    }

    animateIn(){
        TweenMax.ticker.addEventListener('tick', this.loop, this);
    }

    loop(){
        // let delta = this.clock.getDelta();

        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.02;


        this.renderer.render(this.scene, this.camera);
        if(this.stats) this.stats.update();

    }

    animateOut(){
        TweenMax.ticker.removeEventListener('tick', this.loop, this);
    }

    onMouseMove(mouse){

    }

    onKeyDown(ev){
        switch(ev.which){
            case 27:
                this.isLoop = !this.isLoop;
                if(this.isLoop){
                    this.clock.stop();
                    TweenMax.ticker.addEventListener('tick', this.loop, this);
                }else{
                    this.clock.start();
                    TweenMax.ticker.removeEventListener('tick', this.loop, this);
                }
                break;
        }
    }

    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    destroy(){

    }

}

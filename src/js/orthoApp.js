'use strict';

import  { RawShaderMaterial, OrthographicCamera, Scene, WebGLRenderer, PlaneGeometry, Clock, ShaderMaterial, Mesh, MeshBasicMaterial} from 'three';
var dat = require('./lib/dat.gui');

const TweenMax = require('gsap');
const glslify = require('glslify');
const Stats = require('stats.js');

export default class App {
    constructor(params){
        this.params = params || {};
        this.camera = new OrthographicCamera( -window.innerWidth/2, window.innerWidth/2, window.innerHeight/2, -window.innerHeight/2, 0, 10000);

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
        let geo = new PlaneGeometry(1, 1);
        let mat = new RawShaderMaterial({
            vertexShader : glslify('./shaders/rawShader/shader.vert'),
            fragmentShader : glslify('./shaders/rawShader/shader.frag'),
        });

        let mesh = new Mesh(geo, mat);
        return mesh;
    }

    animateIn(){
        TweenMax.ticker.addEventListener('tick', this.loop, this);
    }

    loop(){

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
        this.camera.left   = -window.innerWidth/2;
        this.camera.right  = window.innerWidth/2;
        this.camera.top    =  window.innerHeight/2;
        this.camera.bottom = -window.innerHeight/2;
        this.camera.updateProjectionMatrix();

        this.mesh.scale.set(window.innerWidth, window.innerHeight, 1);

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    destroy(){

    }

}

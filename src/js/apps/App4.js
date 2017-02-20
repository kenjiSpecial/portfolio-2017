'use strict';

const THREE = require('three');
import  {PerspectiveCamera, Scene, WebGLRenderer, BoxGeometry, Clock, ShaderMaterial, MeshBasicMaterial, Mesh} from 'three';
const OrbitControls = require('three-orbit-controls')(THREE);

const dat = require('dat.gui/build/dat.gui.js');
const TweenMax = require('gsap');
const glslify = require('glslify');
const Stats = require('stats.js');
const jsonfiles = [
    './models/a.json',
    './models/b.json',
    './models/c.json',
];

export default class App {
    constructor(params){
        this.params = params || {};
        this.camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.y = 20;
        this.camera.position.z = 15;
        this.camera.lookAt(new THREE.Vector3());

        this.scene = new Scene();

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
        this.control = new OrbitControls(this.camera);

        this.jsonLoader = new THREE.JSONLoader();

        this._setLight();
        this._setHelper();

        this.resize();
    }
    _setHelper(){
        let size = 100;
        let divisions = 100;

        let gridHelper = new THREE.GridHelper( size, divisions );
        // this.scene.add( gridHelper );
    }
    _setLight(){
        let light0 = new THREE.DirectionalLight( 0xefefff, 1.5 );
        light0.position.set( 1, 1, 1 ).normalize();
        this.scene.add( light0 );

        let light2 = new THREE.DirectionalLight( 0xffefef, 1.5 );
        light2.position.set( -1, -1, -1 ).normalize();
        this.scene.add( light2 );
    }
    _addGui(){
        this.gui = new dat.GUI();
    }

    animateIn(){
        // this.loader = new THREE.JSONLoader();
        // this.loader.load('./models/letterA.json', (geo)=>{console.log(geo);});
        //
        // return;
        // var loader = new THREE.JSONLoader();
        //
        // // load a resource
        // loader.load(
        //     // resource URL
        //     jsonfiles[0],
        //     // Function when resource is loaded
        //     function ( geometry, materials ) {
        //         var material = new THREE.MultiMaterial( materials );
        //         var object = new THREE.Mesh( geometry, material );
        //         scene.add( object );
        //     }
        // );
        // return;:
        this.cnt = 0;
        this.meshes = {};
        let mat = new THREE.MeshStandardMaterial({
            color : 0x444444,
            roughness : 0,
            metalness : 0,
            // wireframe : true
        })

        jsonfiles.forEach((json)=>{
            let name = json.split('/')[2].split('.')[0];

            this.jsonLoader.load(json, (geo)=>{
                this.meshes[name] = new THREE.Mesh(geo, mat);
                this.meshes[name].position.x = (this.cnt - 1) * 2.05;
                this.scene.add(this.meshes[name]);
                this.cnt++;
                if(this.cnt == jsonfiles.length){
                    console.log('loaded');
                    TweenMax.ticker.addEventListener('tick', this.loop, this);
                }
            })
        })


    }

    loop(){
        // let delta = this.clock.getDelta();

        // this.mesh.rotation.x += 0.01;
        // this.mesh.rotation.y += 0.02;


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

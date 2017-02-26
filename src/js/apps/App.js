'use strict';

const THREE = require('three');
import {PerspectiveCamera, Scene, WebGLRenderer, Clock} from "three";
import {initAssets, mainAssets} from "./utils/config";
import LoaderMesh from './objects/LoaderMesh';
import Loader from "./loader/Loader";
import KeyBoardObject from './objects/KeyBoard';
import AppController from './controller/AppController';
import AppModel from './models/AppModel';
import PostEffectScene from './scenes/PostEffectScene';
import OutputEffectScene from './scenes/OutputEffectScene';
import Camera from './camera/camera';
import Hand from './objects/Hand';

const OrbitControls = require('three-orbit-controls')(THREE);

const dat = require('dat.gui/build/dat.gui.js');
const TweenMax = require('gsap');
const glslify = require('glslify');
const Stats = require('stats.js');

export default class App {
    constructor(params){
        this._initAssetLoaded = this._initAssetLoaded.bind(this);
        this.params = params || {};
        this.camera = new Camera();

        this.scene = new Scene();

        let renderTargetParameters = { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat, stencilBufer: false };
        this.renderTarget = new THREE.WebGLRenderTarget(this.params.width, this.params.height, renderTargetParameters);
        // this.renderTarget.setPixelRatio (  window.devicePixelRatio || 1 )
        this.renderer = new WebGLRenderer({
            antialias: true
        });
        this.renderer.setClearColor( 0x000000  );
        // this.renderer.setPixelRatio (  window.devicePixelRatio || 1 )
        this.dom = this.renderer.domElement;
        this.renderer.sortObjects = true;

        this._postEffectScene = new PostEffectScene(this.renderer);
        this._outputEffectScene = new OutputEffectScene()

        if(this.params.isDebug){
            this.stats = new Stats();
            document.body.appendChild(this.stats.dom);
            this._addGui();
        }

        this.clock = new Clock();
        // this.control = new OrbitControls(this.camera);

        this.appModel = new AppModel();
        this.appController = new AppController(this.appModel);
        this.appController.addPostEffectScene(this._postEffectScene);
        this.appModel.addEventListener('transformToHome', this._transformToHome.bind(this));

        this.loader = new Loader();
        this.loadedCnt = 0;

        this.isAppStart = false;


        this._setLight();
        this._setHelper();

        this.resize();

        this.appModel.addEventListener('stateChange', this._onUpdateStateChange.bind(this));
    }
    _onUpdateStateChange(){
        // console.log(this.appModel.prevState);
        // console.log(this.appModel.state);
        if(this.appModel.prevState == 'home' && (this.appModel.state == 'about' ||this.appModel.state == 'works') ){
            this._postEffectScene.startApp(this.appModel.state);
            this.camera.animateStartAbout();

        }
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
        let mat = new THREE.MeshStandardMaterial({
            color : 0x3F3F3F,
            roughness : 0,
            metalness : 0,
        })
        this.numMat = mat;

        this.loaderMesh = new LoaderMesh();
        this.scene.add(this.loaderMesh);

        this.loader.addAssets(initAssets);
        this.loader.addEventListener ( 'loaded', this._initAssetLoaded );

    }
    _addInitButtons(){
        this.initButtons = new THREE.Object3D();
        this.initButtons.rotation.x = Math.PI/2;
        this.scene.add(this.initButtons);
        let mesh = new THREE.Mesh(this.loader.geometries['button'], this.numMat);
        mesh.position.x = -1.1;
        this.initButtons.add(mesh)
        mesh = new THREE.Mesh(this.loader.geometries['button'], this.numMat);
        mesh.position.x = 1.1;
        this.initButtons.add(mesh);
    }
    _initAssetLoaded(){

        this.loader.removeEventListener ( 'loaded', this._initAssetLoaded );
        let index = 0;

        this.scene.add(this.loaderMesh);

        this.loader.addAssets(mainAssets);
        this.createLoadMesh()

        TweenMax.ticker.addEventListener('tick', this.loop, this);
    }
    loadDone(){
        this.scene.remove(this.initButtons);

        this._addKeyboard();
        this._addHand();
        this._addPostEffectScene();

        TweenMax.to(this.dom, 1.2, {opacity: 1, ease: Quint.easeOut});
        this.camera.loadDone(this._startApp.bind(this), null, this.loaderMesh);
    }
    _addKeyboard(){
        this.keyboardObject = new KeyBoardObject();
        this.scene.add(this.keyboardObject);
        this.appController.setKeyboardObject(this.keyboardObject)
    }
    _addHand(){
        this.hand = new Hand({
            geometry : this.loader.geometries['hand'],
            camera : this.camera,
            model : this.appModel,
            controller : this.appController
        });
        this.scene.add(this.hand);
        this.hand.addKeyboard(this.keyboardObject)
    }
    _addPostEffectScene(){
        this._postEffectScene.addAboutTextures(this.loader.textures);
        this._postEffectScene.addWorkTextures(this.loader.textures);
        this._postEffectScene.resize();
    }
    _startApp(){
        this.hand.animateIn();// .bind(this.hand)
        this.camera = this.hand.camera;
        this.appModel.isAppStart = true;
    }
    createLoadMesh(){
        this.loadedCnt++;
        let percent = this.loader.rate
        this.loaderMesh.updateMesh(percent, this.loadedCnt);
        if(this.loader.rate >= 100){
            this.camera.camerZoomIn(this.loadDone.bind(this), this.loadedCnt);
        }else{
            this.camera.camerZoomIn(this.createLoadMesh.bind(this), this.loadedCnt);
        }

    }
    loop(){

        let delta = this.clock.getDelta();// * 0.1;

        if(this.hand) this.hand.update(delta);

        this.camera.update();
        this.renderer.render(this.scene, this.camera, this.renderTarget);
        let texture;
        if(this.appModel.state == 'about' || this.appModel.state == 'works'){
            this._postEffectScene.render(this.renderer, this.renderTarget.texture);
            texture = this._postEffectScene.texture;
        }else{
            texture = this.renderTarget.texture;
        }
        this._outputEffectScene.update(delta, this.appModel, this.mouse);
        this._outputEffectScene.render(this.renderer, texture);
        if(this.stats) this.stats.update();
    }
    animateOut(){
        TweenMax.ticker.removeEventListener('tick', this.loop, this);
    }
    onMouseMove(mouse){
        this.mouse = mouse;
        this.camera.updateMouse(mouse);
        if(this.hand) this.hand.mouseMove(mouse, this.camera);
    }
    onMouseDown(){
        if(this.hand) this.hand.mouseDown();
    }
    onMouseUp(){
        if(this.hand) this.hand.mouseUp();
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
        this.appController.doKeyDown(ev);
    }
    onKeyUp(ev){
        this.appController.doKeyUp(ev);
    }
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderTarget.setSize(window.innerWidth, window.innerHeight);

        this._outputEffectScene.resize();
        this._postEffectScene.resize();
    }
    _transformToHome(){
        if(this.appModel.state == 'home') return;

        if(this.appModel.state == 'about' || this.appModel.state == 'works'){
            this._postEffectScene.backToHome();
        }
    }
    destroy(){

    }
}

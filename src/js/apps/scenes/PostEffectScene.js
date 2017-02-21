"use strict";
const THREE = require('three');
const glslify = require('glslify');
import {works, aboutData} from '../utils/config';
import AppModel from '../models/AppModel'

export default class PostEffectScene extends THREE.Scene {
    constructor(renderer) {
        super()
        this._onWorkChange = this._onWorkChange.bind(this);
        this._onAboutChange = this._onAboutChange.bind(this);

        this.renderer = renderer;
        this.appModel = new AppModel();
        this.appModel.addEventListener('stateChange', this._onStateChagne.bind(this));

        let rendertargetparameters = { minfilter: THREE.nearestfilter, magfilter: THREE.nearestfilter, format: THREE.rgbaformat, stencilbufer: false };
        this.rendertarget = new THREE.WebGLRenderTarget(1, 1, rendertargetparameters);
        this.texture = this.rendertarget.texture;

        this.camera = new THREE.OrthographicCamera( 1 / - 2, 1 / 2, 1 / 2, 1 / - 2, 0.1, 1000 );
        this.camera.position.z = 1;
        this.resize();

        let mat = new THREE.RawShaderMaterial({
            vertexShader : glslify('../../shaders/postEffect.vert'),
            fragmentShader : glslify('../../shaders/postEffect.frag'),
            uniforms  : {
                tDiffuse : {value : null},
                tBase : {value : null},
                uRate : {value : 0}
            }
        });

        let plane = new THREE.PlaneGeometry(1, 1);
        this.planeMesh = new THREE.Mesh(plane, mat);
        this.add(this.planeMesh);

    }
    addAboutTextures(textures){
        this.renderTargetAbouts = [];

        this.aboutCamera = new THREE.OrthographicCamera( 1 / - 2, 1 / 2, 1 / 2, 1 / - 2, 0.1, 1000 );
        this.aboutCamera.position.z = 10;

        aboutData.forEach((about)=>{
            let scene = new THREE.Scene();
            let mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(textures[about].image.width, textures[about].image.height ),
                new THREE.MeshBasicMaterial({map : textures[about]})
            );
            scene.add(mesh);

            let rendertargetparameters = { minfilter: THREE.nearestfilter, magfilter: THREE.nearestfilter, format: THREE.rgbaformat, stencilbufer: false };
            let rendertarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, rendertargetparameters);
            this.renderer.render(scene, this.aboutCamera, rendertarget);

            this.renderTargetAbouts.push({scene : scene,  rendertarget: rendertarget});
        })



        this.aboutScene = new THREE.Scene();

        let rendertargetparameters = { minfilter: THREE.nearestfilter, magfilter: THREE.nearestfilter, format: THREE.rgbaformat, stencilbufer: false };
        this.aboutRenderTarget =  new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, rendertargetparameters);

        let noise1 = textures['pnoise'];
        let noise2 = textures['pnoise2'];
        let noise3 = textures['pnoise3'];

        let mat = new THREE.ShaderMaterial({
            uniforms : {
                noise1 : {value : noise1},
                noise2 : {value : noise2},
                noise3 : {value : noise3},
                bgTexture : {value : null },
                bgTexture1 : {value : null },
                uTime : {value: 1},
                uTime2 : {value: 0},
                uColorDiffuse : {value: 10},
                curTime : {value : 0},
                uBalance : {value: 0}
            },
            vertexShader : glslify('../../shaders/works.vert'),
            fragmentShader : glslify('../../shaders/works.frag'),
            transparent : true

        })

        let plane = new THREE.PlaneGeometry(1, 1);
        this.aboutMesh = new THREE.Mesh(plane, mat);
        this.aboutScene.add(this.aboutMesh);

        // this.resize();
    }
    addWorkTextures(textures){
        this.renderTargets = [];

        works.forEach((work)=>{
            let scene = new THREE.Scene();
            let mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(textures[work.name].image.width, textures[work.name].image.height ),
                new THREE.MeshBasicMaterial({map : textures[work.name]})
            );
            scene.add(mesh);

            let rendertargetparameters = { minfilter: THREE.nearestfilter, magfilter: THREE.nearestfilter, format: THREE.rgbaformat, stencilbufer: false };
            let rendertarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, rendertargetparameters);
            this.renderer.render(scene, this.aboutCamera, rendertarget);

            this.renderTargets.push({scene : scene,  rendertarget: rendertarget});
        })

        this.worksScene = new THREE.Scene();
        let rendertargetparameters = { minfilter: THREE.nearestfilter, magfilter: THREE.nearestfilter, format: THREE.rgbaformat, stencilbufer: false };
        this.worksRenderTarget =  new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, rendertargetparameters);

        let noise1 = textures['pnoise'];
        let noise2 = textures['pnoise2'];
        let noise3 = textures['pnoise3'];

        let mat = new THREE.ShaderMaterial({
            uniforms : {
                noise1 : {value : noise1},
                noise2 : {value : noise2},
                noise3 : {value : noise3},
                bgTexture : {value : null },
                bgTexture1 : {value : null },
                uTime : {value: 1},
                uTime2 : {value: 0},
                uColorDiffuse : {value: 10},
                curTime : {value : 0},
                uBalance : {value: 0}
            },
            vertexShader : glslify('../../shaders/works.vert'),
            fragmentShader : glslify('../../shaders/works.frag'),
            transparent : true

        })

        let plane = new THREE.PlaneGeometry(1, 1);
        this.worksMesh = new THREE.Mesh(plane, mat);
        this.worksScene.add(this.worksMesh);
    }
    startApp(state){
        let value = 1;
        if(state == "about"){
            TweenMax.killTweensOf([this.aboutMesh.material.uniforms.uTime, this.aboutMesh.material.uniforms.uColorDiffuse]);

            this.curAboutTexture = this.renderTargetAbouts[ this.appModel.aboutNum || 0].rendertarget.texture;
            this.aboutMesh.material.uniforms.bgTexture.value = this.curAboutTexture;
            TweenMax.fromTo(this.aboutMesh.material.uniforms.uTime, 1.2, {value: 1}, {value: 0, ease: Quint.easeOut})
            TweenMax.fromTo(this.aboutMesh.material.uniforms.uColorDiffuse, 2, {value: 30}, {value: 0.5})

            this.aboutCount = 0;
            this.aboutMesh.material.uniforms.uBalance.value = 0;

            this.appModel.addEventListener('aboutChange', this._onAboutChange);
            // this.appModel.aboutAutoUpdate();
        }else{

            TweenMax.killTweensOf([this.worksMesh.material.uniforms.uTime, this.worksMesh.material.uniforms.uColorDiffuse]);

            this.curWorkTexture = this.renderTargets[ this.appModel.workNum].rendertarget.texture;
            this.worksMesh.material.uniforms.bgTexture.value = this.curWorkTexture;
            TweenMax.fromTo(this.worksMesh.material.uniforms.uTime, 1.8, {value: 1}, {value: 0, ease: Quint.easeInOut})
            TweenMax.fromTo(this.worksMesh.material.uniforms.uColorDiffuse, 2, {value: 30}, {value: 0.5})
            this.count = 0;
            this.worksMesh.material.uniforms.uBalance.value = 0;

            this.appModel.addEventListener('workChange', this._onWorkChange);
        }

        TweenMax.to(this.planeMesh.material.uniforms.uRate, 1.2, {value: value, ease: Quint.easeInOut});
    }
    _onStateChagne(){
        if(this.appModel.prevState == 'works') {
            this.appModel.removeEventListener('workChange', this._onWorkChange);
        }else if(this.appModel.prevState == 'about'){
            this.appModel.removeEventListener('aboutChange', this._onAboutChange);
            // this.appModel.aboutAutoUpdateDisable();
        }
    }
    backToHome(){
        if(this.appModel.state == 'works'){
            TweenMax.killTweensOf([this.worksMesh.material.uniforms.uTime, this.worksMesh.material.uniforms.uColorDiffuse]);
            TweenMax.to(this.worksMesh.material.uniforms.uTime, 1.2, {value: 1, ease: Quint.easeInOut})
            TweenMax.to(this.worksMesh.material.uniforms.uColorDiffuse, 1.2, {value: 10, ease: Quint.easeInOut})
        }

        TweenMax.to(this.planeMesh.material.uniforms.uRate, 1.2, {value: 0, ease: Quint.easeInOut, onComplete: function(){
            this.dispatchEvent({type : 'backToHome'});
        }, onCompleteScope : this});
    }
    _onAboutChange(){
        this.aboutCount++;
        TweenMax.killTweensOf([this.aboutMesh.material.uniforms.uBalance]);
        if(this.aboutCount % 2 == 0 ){
            this.aboutMesh.material.uniforms.bgTexture.value = this.renderTargetAbouts[ this.appModel.aboutNum].rendertarget.texture;
            TweenMax.to(this.aboutMesh.material.uniforms.uBalance, 1.0, {value : 0, ease: Quint.easeOut});
        }else{
            this.aboutMesh.material.uniforms.bgTexture1.value = this.renderTargetAbouts[ this.appModel.aboutNum].rendertarget.texture;
            TweenMax.to(this.aboutMesh.material.uniforms.uBalance, 1.0, {value : 1, ease: Quint.easeOut});
        }
    }
    _onWorkChange(){
        this.count++;
        TweenMax.killTweensOf([this.worksMesh.material.uniforms.uBalance]);
        if(this.count % 2 == 0 ){
            this.worksMesh.material.uniforms.bgTexture.value = this.renderTargets[ this.appModel.workNum].rendertarget.texture;
            TweenMax.to(this.worksMesh.material.uniforms.uBalance, 1.0, {value : 0, ease: Quint.easeOut});
        }else{
            this.worksMesh.material.uniforms.bgTexture1.value = this.renderTargets[ this.appModel.workNum].rendertarget.texture;
            TweenMax.to(this.worksMesh.material.uniforms.uBalance, 1.0, {value : 1, ease: Quint.easeOut});
        }
    }
    render(renderer, texture){

        this.planeMesh.material.uniforms.tDiffuse.value = texture;
        if(this.appModel.state == 'about'){
            this.aboutMesh.material.uniforms.uTime2.value += 1/60;
            this.renderer.render(this.aboutScene, this.camera, this.aboutRenderTarget);
            this.planeMesh.material.uniforms.tBase.value = this.aboutRenderTarget.texture;
        }else{
            this.worksMesh.material.uniforms.uTime2.value += 1/60;

            this.renderer.render(this.worksScene, this.camera, this.worksRenderTarget);
            this.planeMesh.material.uniforms.tBase.value = this.worksRenderTarget.texture;
        }

        this.renderer.render(this, this.camera, this.rendertarget);
        this.texture = this.rendertarget.texture;
    }
    resize(){
        if(this.aboutCamera){
            let camFactor = 2;
            this.aboutCamera.left = -window.innerWidth / camFactor;
            this.aboutCamera.right = window.innerWidth / camFactor;
            this.aboutCamera.top = window.innerHeight / camFactor;
            this.aboutCamera.bottom = -window.innerHeight / camFactor;
            this.aboutCamera.updateProjectionMatrix();
        }

        if(this.aboutRenderTarget) {
            this.aboutRenderTarget.setSize(window.innerWidth, window.innerHeight);
        }

        if(this.worksRenderTarget) {
            this.worksRenderTarget.setSize(window.innerWidth, window.innerHeight);
        }

        this.rendertarget.setSize(window.innerWidth, window.innerHeight);
        if(this.renderTargets){
            this.renderTargets.forEach((renderTarget)=>{
                renderTarget.rendertarget.setSize(window.innerWidth, window.innerHeight);
                this.renderer.render( renderTarget.scene, this.aboutCamera, renderTarget.rendertarget );
            })
        }

        if(this.aboutRenderTarget){
            this.renderTargetAbouts.forEach((renderTarget)=>{
                renderTarget.rendertarget.setSize(window.innerWidth, window.innerHeight);
                this.renderer.render( renderTarget.scene, this.aboutCamera, renderTarget.rendertarget );
            })
        }

    }
}
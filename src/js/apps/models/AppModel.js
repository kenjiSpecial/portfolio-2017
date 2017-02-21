"use strict";
let instance = null;
const THREE = require('three');
import {works, aboutData} from '../utils/config';

export default class AppModel extends THREE.EventDispatcher {
    constructor() {
        super();

        if(!instance){
            instance = this;
            this._initialize();
        }

        return instance;
    }
    _initialize(){
        this._state = 'home';
        this._isAppStart = false;
        this._workNum = 0;

        this.AUTO_DELAY = 5;
        this.spaceRate = 0;
        this.autoAboutUpdate = this.autoAboutUpdate.bind(this);
    }
    updateIncrease(){
        if(this.state == 'works'){
            let workNum = this.workNum;
            this.workNum = workNum + 1 > works.length - 1 ? 0 : workNum + 1
        }else if(this.state == 'about'){
            let aboutNum = this.aboutNum;
            this.aboutNum = aboutNum + 1 > aboutData.length - 1 ? 0 : aboutNum + 1
        }

    }
    updateDecrease(){
        if(this.state == 'works'){
            let workNum = this.workNum;
            this.workNum = workNum - 1 < 0 ? works.length - 1 : workNum - 1
        }else if(this.state == 'about'){
            let aboutNum = this.aboutNum;
            this.aboutNum = aboutNum - 1 < 0 ? aboutData.length - 1 : aboutNum - 1
        }
    }
    transformToHome(){
        this.dispatchEvent({type : "transformToHome"});
    }
    aboutAutoUpdate(){
        this.isAboutAutoUpdate = true;
        TweenMax.delayedCall(this.AUTO_DELAY, this.autoAboutUpdate);
    }
    aboutAutoUpdateDisable(){
        this.isAboutAutoUpdate = true;
        TweenMax.killTweensOf([this.autoAboutUpdate]);
    }
    autoAboutUpdate(){
        let aboutNum = this.aboutNum;
        this.aboutNum = aboutNum + 1 > aboutData.length - 1 ? 0 : aboutNum + 1
    }

    get state(){
        return this._state;
    }
    set state(_state){
        if(this._state == _state) return;

        this.prevState = this._state;
        this._state = _state;

        if(this._state == 'works'){
            this._workNum = -1;
            this.workNum = 0;
        }else if(this._state == 'about'){
            this._aboutNum = -1;
            this.aboutNum = 0;
        }

        this.dispatchEvent({type : "stateChange"});
    }
    get isAppStart(){
        return this._isAppStart;
    }
    set isAppStart(value){
        this._isAppStart = value;
        this.dispatchEvent({type : "appStartChange"});
    }
    get workNum(){
        return this._workNum;
    }
    set workNum(val){
        if(this._workNum == val) return;

        this.prevWorkNum = this._workNum;
        this._workNum = val;
        this.dispatchEvent({type : 'workChange'});
    }
    get aboutNum(){
        return this._aboutNum;
    }
    set aboutNum(val){
        if(this._aboutNum == val) return;

        this.prevAboutNum = this._aboutNum;
        this._aboutNum = val;

        if(this.isAboutAutoUpdate){
            TweenMax.killTweensOf([this.autoAboutUpdate]);
            TweenMax.delayedCall(this.AUTO_DELAY, this.autoAboutUpdate);
        }
        this.dispatchEvent({type : 'aboutChange'});
    }
}
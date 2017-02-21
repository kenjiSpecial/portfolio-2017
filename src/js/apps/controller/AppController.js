"use strict";

import {keyboardMouseDown, keyboardDirectories} from '../utils/config'

export default class AppController {
    constructor(model) {
        this.model = model;
    }
    setKeyboardObject(keyboardVeiw){
        this.keyboarView = keyboardVeiw;

        this.keyboarView.buttonBackView.addEventListener('backToHome', this._onBackToHome.bind(this));
        this.keyboarView.nextButtonView.addEventListener('update', this._updateIncrease.bind(this));
        this.keyboarView.prevButtonView.addEventListener('update', this._updateDecrease.bind(this));
    }
    _onBackToHome(){
        this.model.transformToHome();
    }
    _updateIncrease(){
        this.model.updateIncrease();
    }
    _updateDecrease(){
        this.model.updateDecrease();
    }
    doKeyDown(ev){
        if(this.keyboarView) this.keyboarView.doKeyDown(ev);

        if(this.model.isAppStart){
           this._updateDirecotry(ev);
        }
    }
    addPostEffectScene( postEfectScene ){
        this.postEfectScene = postEfectScene;
        console.log();
        this.postEfectScene.addEventListener('backToHome', this.updateStateToHome.bind(this))
    }
    updateStateToHome(){
        this.model.state = 'home';
    }
    doKeyUp(ev){
        if(this.keyboarView) this.keyboarView.doKeyUp(ev);
    }
    doMouseDown(ev){
        if(this.keyboarView) this.keyboarView.doMouseDown(ev);

        if(this.model.isAppStart){
            this._updateDirecotry(ev);
        }
    }
    doMouseUp(ev){
        if(this.keyboarView) this.keyboarView.doMouseUp(ev);
    }
    doRollover(ev){
        if(this.keyboarView) this.keyboarView.doRollover(ev);
    }
    doRollout(ev){
        if(this.keyboarView) this.keyboarView.doRollout(ev);
    }
    _updateDirecotry(ev){
        if(this.model.state == "home" && keyboardDirectories[ev.key]){
            this.model.state = keyboardDirectories[ev.key];
        }
    }
}
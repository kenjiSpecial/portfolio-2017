'use strict';

import App from './apps/App';
// import App from './apps/OrthoApp';

let app;

(() =>{
    init();
    start();
})();

function init(){
    app = new App({
        isDebug: true
    });

    document.body.appendChild(app.dom);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('mouseup', onMouseUp, false);
}

function start(){
    app.animateIn();
}

function onDocumentMouseMove(event){
    // event.preventDefault();

    let mouseX = ( event.clientX / window.innerWidth ) * 2 - 1;
    let mouseY = -( event.clientY / window.innerHeight ) * 2 + 1;

    app.onMouseMove({x: mouseX, y: mouseY});
}

function onMouseDown(ev){
    app.onMouseDown();
}

function onMouseUp(ev){
    app.onMouseUp();
}

window.addEventListener('resize', function(){
    app.resize();
});

window.addEventListener('keydown', function(ev){
    app.onKeyDown(ev);
});

window.addEventListener('keyup', function(ev){
    app.onKeyUp(ev);
});

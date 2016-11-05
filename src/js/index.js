'use strict';

import App from './app'
var app;


(() => {
    init();
    start();
})();

function init() {
    app = new App({
        isDebug : true
    });

    document.body.appendChild(app.dom);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
}

function start(){
    app.animateIn();
}


function onDocumentMouseMove(event){
    event.preventDefault();

    var mouseX = ( event.clientX / window.innerWidth ) * 2 - 1;
    var mouseY = -( event.clientY / window.innerHeight ) * 2 + 1;

    app.onMouseMove({x: mouseX, y: mouseY});
}

window.addEventListener('resize', function(){
    app.resize();
});

window.addEventListener('keydown', function(ev){
    app.onKeyDown(ev);
});

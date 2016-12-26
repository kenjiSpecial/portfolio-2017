#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;

void main(){
    gl_FragColor = vec4(vUv, 0.0, 1.0);
}
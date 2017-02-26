#ifdef GL_ES
precision highp float;
#endif

void main(){
    float alp = 1.0 - distance(vec2(gl_PointCoord.x ,  gl_PointCoord.y ), vec2(0.5)) * 4.0;
    gl_FragColor = vec4(0.6, 8.0, 1.0,  0.3 * alp);
}
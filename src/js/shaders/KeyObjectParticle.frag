uniform vec3 uColor;
uniform vec3 uRollColor;
uniform float uRollover;

void main(){
    float alp = 1.0 - distance(vec2(gl_PointCoord.x ,  gl_PointCoord.y ), vec2(0.5)) * 4.0;
    gl_FragColor = vec4( mix(uColor, uRollColor, uRollover), 0.3 * alp);
//    gl_FragColor
}
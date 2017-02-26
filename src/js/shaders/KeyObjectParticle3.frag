uniform vec3 uColor;
uniform vec3 uRollColor;
uniform vec3 uActiveColor;
uniform vec3 uActiveRollColor;

uniform float uRollover;
uniform float uTranslate;

void main(){
    float alp = 1.0 - distance(vec2(gl_PointCoord.x ,  gl_PointCoord.y ), vec2(0.5)) * 4.0;
    gl_FragColor = vec4( mix(mix(uColor, uRollColor, uRollover), mix(uActiveColor, uActiveRollColor, uRollover), uTranslate), (0.3 + uTranslate * 0.7) * alp);
//    gl_FragColor
}
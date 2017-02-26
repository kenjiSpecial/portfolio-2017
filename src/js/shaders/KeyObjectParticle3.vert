attribute vec3 position2;
attribute vec3 position3;
attribute vec3 position4;
attribute vec4 speed;

uniform float uTime;
uniform float uRollover;
uniform float uTranslate;

void main() {
    gl_PointSize = 12.0;
    float uRate =  mix(speed.z, speed.w, (cos(uTime * speed.x + speed.y) + 1.) /2.);
    vec3 ptPoint = mix( mix(position, position2, uRate), mix(position3, position4, uRate), uTranslate);
	vec4 mvPosition = modelViewMatrix * vec4( ptPoint, 1.0);
    gl_Position = projectionMatrix * mvPosition;
}
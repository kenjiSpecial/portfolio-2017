attribute vec3 position2;
attribute vec4 speed;

uniform float uTime;

void main() {
    gl_PointSize = 12.0;
    float uRate =  mix(speed.z, speed.w, (cos(uTime * speed.x + speed.y) + 1.) /2.);
	vec4 mvPosition = modelViewMatrix * vec4(mix(position, position2, uRate), 1.0);
    gl_Position = projectionMatrix * mvPosition;
}
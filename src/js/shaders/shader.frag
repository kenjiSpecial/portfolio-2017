varying vec3 vNormal;

void main(){
  vec3 light = vec3( 0.5, 0.2, 1.0);


  light = normalize(light);

 // calculate the dot product of
 // the light to the vertex normal
 float dProd = max(0.0,
                   dot(vNormal, light));
 // feed into our frag colour
 gl_FragColor = vec4(dProd, // R
                     dProd, // G
                     dProd, // B
                     1.0);  // A
}

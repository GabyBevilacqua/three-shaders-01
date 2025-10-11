uniform float time;
varying vec3 vNormal;

void main() {
  float intensity = pow(0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
  float pulse = 0.5 + 0.5 * sin(time * 2.0);
  vec3 glow = vec3(0.2, 0.5, 1.0) * intensity * pulse;
  gl_FragColor = vec4(glow, 1.0);
}

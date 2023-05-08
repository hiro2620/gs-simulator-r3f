precision mediump float;
varying vec2 vUv;
uniform sampler2D u_image;
uniform vec2 u_size;
uniform vec2 u_mouse;

const float COLOR_MIN = 0.0, COLOR_MAX = 0.7;

void main() {

	float g = (texture2D(u_image, vUv).g - COLOR_MIN) / (COLOR_MAX - COLOR_MIN);
	gl_FragColor = vec4(0., g, 0., 1.);

	return;
}
precision mediump float;

varying vec2 vUv;

uniform float u_dt;
uniform float u_time;
uniform sampler2D u_image;

uniform vec2 u_size;
uniform vec2 u_mouse;
uniform float u_pen;

uniform float u_kill;
uniform float u_feed;
uniform float u_Da;
uniform float u_Db;

void main() {

  vec2 uv = vUv;

  // u_mouse is (-1.0, -1.0) in initial state
  if (u_mouse.x < 0.0) {
    gl_FragColor = vec4(1.0,0.0,0.0,1.0);
  }

  float step_x = 1.0/u_size.x;
  float step_y = 1.0/u_size.y;

  float xm1 = vUv.x - step_x;
  float xp1 = vUv.x + step_x;
  float ym1 = vUv.y - step_y;
  float yp1 = vUv.y + step_y;
  xm1 = (xm1 < 0.0) ? xm1 + 1.0 : xm1;
  xp1 = (xp1 > 1.0) ? xp1 - 1.0 : xp1;
  ym1 = (ym1 < 0.0) ? ym1 + 1.0 : ym1;
  yp1 = (yp1 > 1.0) ? yp1 - 1.0 : yp1;

  vec2 vp = texture2D(u_image, vUv).xy;
  vec2 vu = texture2D(u_image, vec2(vUv.x, yp1)).xy;
  vec2 vr = texture2D(u_image, vec2(xp1, vUv.y)).xy;
  vec2 vd = texture2D(u_image, vec2(vUv.x, ym1)).xy;
  vec2 vl = texture2D(u_image, vec2(xm1, vUv.y)).xy;

  vec2 lapl = (vu + vr + vd + vl - 4.0*vp);
  float du = u_Da*lapl.x - vp.x*vp.y*vp.y + u_feed*(1.0 - vp.x);
  float dv = u_Db*lapl.y + vp.x*vp.y*vp.y - (u_feed+u_kill)*vp.y;

  vec2 dst = vp + u_dt*vec2(du, dv);

  vec2 dist = (u_mouse - vUv) * u_size;
  if (dot(dist, dist) < u_pen) {
    dst.x = 0.0;
    dst.y = 0.95;
  }

  gl_FragColor = vec4(dst, 0.0, 1.0);
}
import { FC, useRef, useMemo } from "react"
import { useThree, useFrame } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import { Mesh, ShaderMaterial, Vector2, RGBAFormat, FloatType, LinearFilter } from "three";
// eslint-disable-next-line import/no-webpack-loader-syntax
import gsFragmentShader from "!!raw-loader!./glsl/gsFragment.frag"
// eslint-disable-next-line import/no-webpack-loader-syntax
import screenFragmentShader from "!!raw-loader!./glsl/screenFragment.frag"
// eslint-disable-next-line import/no-webpack-loader-syntax
import vertexShader from "!!raw-loader!./glsl/vertex.vert"


interface IGSPlane {
  penSize: number;
  feed: number;
  kill: number;
}

const GSPlane: FC<IGSPlane> = ({ penSize, feed, kill }) => {

  const mesh = useRef<Mesh>(null);
  const { width, height } = useThree(state => state.size);

  const buffer0 = useFBO(width, height, {
    format: RGBAFormat,
    type: FloatType,
    stencilBuffer: false,
    magFilter: LinearFilter,
    minFilter: LinearFilter,
  });

  const buffer1 = useFBO(width, height, {
    format: RGBAFormat,
    type: FloatType,
    stencilBuffer: false,
    magFilter: LinearFilter,
    minFilter: LinearFilter,
  });

  const bufferView = useFBO(width, height, {
    format: RGBAFormat,
    type: FloatType,
    magFilter: LinearFilter,
    minFilter: LinearFilter,
  });

  const gsMaterial = useMemo(() => new ShaderMaterial({
    fragmentShader: gsFragmentShader,
    vertexShader: vertexShader,
    uniforms: {
      u_mouse: { value: new Vector2(-1.0, -1.0) },
      u_image: { value: null },
      u_dt: { value: 0.0 },
      u_feed: { value: feed },
      u_kill: { value: kill },
      u_Da: { value: 2.2 },
      u_Db: { value: 0.8 },
      u_size: { value: new Vector2(width, height) },
      u_pen: { value: penSize },
    },
  }), [width, height, penSize, feed, kill]);

  const screenMaterial = useMemo(() => new ShaderMaterial({
    fragmentShader: screenFragmentShader,
    vertexShader: vertexShader,
    uniforms: {
      u_image: { value: null },
      u_size: { value: new Vector2(width, height) },
      u_mouse: { value: new Vector2(-1.0, -1.0) },
    },
  }), [width, height]);

  useFrame((state, dt) => {
    if (!mesh.current) {
      return;
    }

    const iter_cnt = 16;

    mesh.current.material = gsMaterial;

    // dt_1 is 0.1 at 60hz screen
    let dt_1 = dt * 0.1 / 0.0167;
    dt_1 = dt_1 < 0.12 ? dt_1 : 0.12;

    (mesh.current.material as ShaderMaterial).uniforms.u_dt.value = dt_1;
    (mesh.current.material as ShaderMaterial).uniforms.u_mouse.value = new Vector2((state.pointer.x + 1.0) / 2, (state.pointer.y + 1.0) / 2);

    let [buffR, buffW] = [buffer0, buffer1];
    for (let i = 0; i < iter_cnt; i++) {
      (mesh.current.material as ShaderMaterial).uniforms.u_image.value = buffR.texture;
      state.gl.setRenderTarget(buffW);
      state.gl.render(state.scene, state.camera);
      state.gl.setRenderTarget(null);

      [buffR, buffW] = [buffW, buffR];
    }

    mesh.current.material = screenMaterial;
    (mesh.current.material as ShaderMaterial).uniforms.u_image.value = buffR.texture;
    (mesh.current.material as ShaderMaterial).uniforms.u_mouse.value = new Vector2((state.pointer.x + 1.0) / 2, (state.pointer.y + 1.0) / 2);
    state.gl.setRenderTarget(bufferView);
    state.gl.render(state.scene, state.camera);
    state.gl.setRenderTarget(null);
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <planeGeometry args={[width, height]} />
    </mesh>
  );
};

export default GSPlane;
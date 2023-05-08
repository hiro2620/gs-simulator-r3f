import { FC, useRef, useState } from "react"
import { Canvas, useThree } from "@react-three/fiber";
import { OrthographicCamera, Stats } from "@react-three/drei";
import GSPlane from "./GSPlane"

const Camera: FC = () => {
  const { width, height } = useThree(state => state.size);

  return (
    <OrthographicCamera
      makeDefault
      zoom={1}
      top={height / 2}
      bottom={height / -2}
      left={width / -2}
      right={width / 2}
      near={1}
      far={2000}
      position={[0, 0, 200]}
    />
  )
}


const wrapStyle = {
  width: '100%',
  height: 600,
  maxWidth: 800,
  overflow: 'hidden',
}

const Scene = () => {
  const wrapRef = useRef<HTMLDivElement>(null);

  const [penSize, setPenSize] = useState(20);
  const [vFeed, setVFeed] = useState(0.034);
  const [vKill, setVKill] = useState(0.062);

  return (
    <>
      <div style={wrapStyle} ref={wrapRef}>
        <Canvas>
          <Stats />
          <GSPlane penSize={penSize} feed={vFeed} kill={vKill} />
          <Camera />
        </Canvas>

      </div>
      <div>
        <label htmlFor="pen_sld">ペンの大きさ</label>
        <input id="pen_sld" type="range" min={10} max={500} value={penSize} onChange={e => setPenSize(parseInt(e.target.value))}></input>
      </div>
      <div>
        <input type="number" min={0} max={1} step={0.001} placeholder="Feed" value={vFeed} onChange={e => setVFeed(parseFloat(e.target.value))}></input>
        <input type="number" min={0} max={1} step={0.001} placeholder="Kill" value={vKill} onChange={e => setVKill(parseFloat(e.target.value))}></input>
      </div>
    </>
  );
};


export default Scene;
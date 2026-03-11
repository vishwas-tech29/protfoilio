"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const welcomeMessages = [
  { text: "Welcome",        lang: "English"   },
  { text: "\u0C38\u0C4D\u0C35\u0C3E\u0C17\u0C24\u0C02",   lang: "Telugu"    },
  { text: "\u0938\u094D\u0935\u093E\u0917\u0924",          lang: "Hindi"     },
  { text: "\u0BB5\u0BB0\u0BB5\u0BC7\u0BB1\u0BCD\u0BB1\u0BC1\u0B95\u0BBF\u0BB1\u0BCB\u0BAE\u0BCD", lang: "Tamil" },
  { text: "\u0CB8\u0CCD\u0CB5\u0CBE\u0C97\u0CA4",          lang: "Kannada"   },
  { text: "\u0D38\u0D4D\u0D35\u0D3E\u0D17\u0D24\u0D02",   lang: "Malayalam" },
  { text: "\u09B8\u09CD\u09AC\u09BE\u0997\u09A4\u09AE",   lang: "Bengali"   },
  { text: "\u0AB8\u0ACD\u0AB5\u0ABE\u0A97\u0AA4",          lang: "Gujarati"  },
  { text: "\u0A38\u0A35\u0A3E\u0A17\u0A24",                lang: "Punjabi"   },
  { text: "\u0938\u094D\u0935\u093E\u0917\u0924",          lang: "Marathi"   },
  { text: "\u0B38\u0B4D\u0B35\u0B3E\u0B17\u0B24",          lang: "Odia"      },
  { text: "Bienvenido",     lang: "Spanish"   },
  { text: "Bienvenue",      lang: "French"    },
  { text: "Willkommen",     lang: "German"    },
  { text: "Benvenuto",      lang: "Italian"   },
  { text: "\u6B22\u8FCE",   lang: "Chinese"   },
];

// All GLSL shaders stored as plain string arrays — avoids any template-literal
// nesting issues that cause TypeScript/Babel parse errors.
const join = (lines: string[]) => lines.join("\n");

const VERT = join([
  "uniform float uTime;",
  "uniform float uMorph;",
  "uniform float uReveal;",
  "attribute float aRandom;",
  "varying vec3 vPosition;",
  "varying float vRandom;",
  "varying float vReveal;",
  "vec3 mod289v3(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }",
  "vec4 mod289v4(vec4 x){ return x - floor(x*(1.0/289.0))*289.0; }",
  "vec4 permute4(vec4 x){ return mod289v4(((x*34.0)+1.0)*x); }",
  "vec4 taylorInvSqrt4(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }",
  "float snoise(vec3 v){",
  "  const vec2 C=vec2(1.0/6.0,1.0/3.0);",
  "  const vec4 D=vec4(0.0,0.5,1.0,2.0);",
  "  vec3 i=floor(v+dot(v,C.yyy));",
  "  vec3 x0=v-i+dot(i,C.xxx);",
  "  vec3 g=step(x0.yzx,x0.xyz);",
  "  vec3 l=1.0-g;",
  "  vec3 i1=min(g.xyz,l.zxy);",
  "  vec3 i2=max(g.xyz,l.zxy);",
  "  vec3 x1=x0-i1+C.xxx;",
  "  vec3 x2=x0-i2+C.yyy;",
  "  vec3 x3=x0-D.yyy;",
  "  i=mod289v3(i);",
  "  vec4 p=permute4(permute4(permute4(",
  "    i.z+vec4(0.0,i1.z,i2.z,1.0))",
  "    +i.y+vec4(0.0,i1.y,i2.y,1.0))",
  "    +i.x+vec4(0.0,i1.x,i2.x,1.0));",
  "  float n_=0.142857142857;",
  "  vec3 ns=n_*D.wyz-D.xzx;",
  "  vec4 j=p-49.0*floor(p*ns.z*ns.z);",
  "  vec4 x_=floor(j*ns.z);",
  "  vec4 y_=floor(j-7.0*x_);",
  "  vec4 xv=x_*ns.x+ns.yyyy;",
  "  vec4 yv=y_*ns.x+ns.yyyy;",
  "  vec4 h=1.0-abs(xv)-abs(yv);",
  "  vec4 b0=vec4(xv.xy,yv.xy);",
  "  vec4 b1=vec4(xv.zw,yv.zw);",
  "  vec4 s0=floor(b0)*2.0+1.0;",
  "  vec4 s1=floor(b1)*2.0+1.0;",
  "  vec4 sh=-step(h,vec4(0.0));",
  "  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;",
  "  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;",
  "  vec3 p0=vec3(a0.xy,h.x);",
  "  vec3 p1=vec3(a0.zw,h.y);",
  "  vec3 p2=vec3(a1.xy,h.z);",
  "  vec3 p3=vec3(a1.zw,h.w);",
  "  vec4 norm=taylorInvSqrt4(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));",
  "  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;",
  "  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);",
  "  m=m*m;",
  "  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));",
  "}",
  "void main(){",
  "  vPosition=position; vRandom=aRandom; vReveal=uReveal;",
  "  vec3 pos=position;",
  "  float R=2.0; float r2=0.6;",
  "  float phi=atan(pos.y,pos.x);",
  "  float theta=atan(pos.z,length(pos.xy)-R);",
  "  vec3 torus=vec3((R+r2*cos(theta))*cos(phi),(R+r2*cos(theta))*sin(phi),r2*sin(theta));",
  "  pos=mix(pos,torus*0.7,uMorph);",
  "  float n=snoise(pos*0.4+uTime*0.15);",
  "  pos+=normal*n*0.25*(1.0-uMorph*0.5);",
  "  float sc=(1.0-uReveal)*8.0;",
  "  pos.x+=sin(aRandom*6.28+uTime)*sc;",
  "  pos.y+=cos(aRandom*9.42+uTime*1.3)*sc;",
  "  pos.z+=sin(aRandom*12.56)*sc*0.5;",
  "  vPosition=pos;",
  "  gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);",
  "}",
]);

const FRAG = join([
  "uniform float uTime;",
  "uniform float uMorph;",
  "uniform float uReveal;",
  "uniform float uExit;",
  "varying vec3 vPosition;",
  "varying float vRandom;",
  "varying float vReveal;",
  "void main(){",
  "  float dist=length(vPosition);",
  "  float hue=fract(dist*0.18-uTime*0.08+vRandom*0.3);",
  "  vec3 c=clamp(abs(mod(hue*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0);",
  "  c=c*c*(3.0-2.0*c);",
  "  float plasma=sin(dist*3.0-uTime*2.0)*0.5+0.5;",
  "  c=mix(c,vec3(1.0),plasma*0.35*uReveal);",
  "  float edge=1.0-clamp(dist/2.5,0.0,1.0);",
  "  c+=vec3(0.6,0.9,1.0)*edge*edge*0.4;",
  "  c=mix(c,vec3(1.0,0.75,0.1),uMorph*0.4*plasma);",
  "  gl_FragColor=vec4(c,uReveal*(1.0-uExit));",
  "}",
]);

const P_VERT = join([
  "uniform float uTime;",
  "uniform float uReveal;",
  "attribute float aRandom;",
  "varying float vR;",
  "void main(){",
  "  vR=aRandom;",
  "  vec3 pos=position;",
  "  pos.x+=sin(uTime*(0.5+aRandom)+aRandom*6.28)*0.2;",
  "  pos.y+=cos(uTime*(0.4+aRandom*0.6)+aRandom*9.42)*0.2;",
  "  vec4 mv=modelViewMatrix*vec4(pos,1.0);",
  "  gl_PointSize=(2.0+aRandom*3.0)*(1.0/-mv.z)*300.0;",
  "  gl_Position=projectionMatrix*mv;",
  "}",
]);

const P_FRAG = join([
  "uniform float uTime;",
  "uniform float uReveal;",
  "varying float vR;",
  "void main(){",
  "  float d=length(gl_PointCoord-0.5);",
  "  if(d>0.5) discard;",
  "  float hue=fract(vR+uTime*0.05);",
  "  vec3 c=clamp(abs(mod(hue*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0);",
  "  gl_FragColor=vec4(c,(1.0-d*2.0)*uReveal*0.7);",
  "}",
]);

const G_VERT = join([
  "varying vec2 vUv;",
  "void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
]);

const G_FRAG = join([
  "uniform float uTime;",
  "uniform float uReveal;",
  "varying vec2 vUv;",
  "void main(){",
  "  vec2 gr=abs(fract(vUv*20.0)-0.5);",
  "  float line=min(gr.x,gr.y);",
  "  float g=1.0-smoothstep(0.0,0.05,line);",
  "  float pulse=sin(length(vUv-0.5)*15.0-uTime*2.0)*0.5+0.5;",
  "  vec3 col=mix(vec3(0.05,0.05,0.15),vec3(0.1,0.5,1.0),g*pulse);",
  "  gl_FragColor=vec4(col,g*0.4*uReveal);",
  "}",
]);

const CSS = [
  "@keyframes textReveal{",
  "  from{opacity:0;transform:scale(0.94) translateY(8px);filter:blur(8px);}",
  "  to{opacity:1;transform:scale(1) translateY(0);filter:blur(0);}",
  "}",
  "@keyframes fadeSlide{",
  "  from{opacity:0;transform:translateY(-6px);}",
  "  to{opacity:1;transform:translateY(0);}",
  "}",
  "@keyframes pulse{",
  "  0%,100%{transform:scale(1);opacity:1;}",
  "  50%{transform:scale(1.6);opacity:0.5;}",
  "}",
].join("\n");

export default function Loader({ onComplete }: { onComplete?: () => void }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const frameRef  = useRef<number>(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;
    const container = canvasRef.current;

    const scene  = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      60, container.clientWidth / container.clientHeight, 0.1, 1000
    );
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Main sphere
    const geo = new THREE.SphereGeometry(1.6, 128, 128);
    const rnd = new Float32Array(geo.attributes.position.count);
    for (let i = 0; i < rnd.length; i++) rnd[i] = Math.random();
    geo.setAttribute("aRandom", new THREE.BufferAttribute(rnd, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG,
      uniforms: {
        uTime:  { value: 0 }, uMorph: { value: 0 },
        uReveal:{ value: 0 }, uExit:  { value: 0 },
      },
      transparent: true, side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Particles
    const pCount = 3000;
    const pGeo   = new THREE.BufferGeometry();
    const pPos   = new Float32Array(pCount * 3);
    const pRnd   = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const r  = 2.5 + Math.random() * 4;
      pPos[i*3]   = r * Math.sin(ph) * Math.cos(th);
      pPos[i*3+1] = r * Math.sin(ph) * Math.sin(th);
      pPos[i*3+2] = r * Math.cos(ph);
      pRnd[i] = Math.random();
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("aRandom",  new THREE.BufferAttribute(pRnd, 1));
    const pMat = new THREE.ShaderMaterial({
      vertexShader: P_VERT, fragmentShader: P_FRAG,
      uniforms: { uTime: { value: 0 }, uReveal: { value: 0 } },
      transparent: true, depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Grid
    const gridMat = new THREE.ShaderMaterial({
      vertexShader: G_VERT, fragmentShader: G_FRAG,
      uniforms: { uTime: { value: 0 }, uReveal: { value: 0 } },
      transparent: true, side: THREE.DoubleSide, depthWrite: false,
    });
    const grid = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), gridMat);
    grid.rotation.x = -Math.PI / 2.5;
    grid.position.y = -2.5;
    scene.add(grid);

    // Rings
    const rings = Array.from({ length: 5 }, (_, i) => {
      const r  = new THREE.Mesh(
        new THREE.TorusGeometry(1.8 + i * 0.5, 0.008, 8, 128),
        new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(i / 5, 1, 0.6), transparent: true, opacity: 0 })
      );
      r.rotation.x = Math.PI / 2 + (i * Math.PI) / 7;
      r.rotation.y = (i * Math.PI) / 5;
      scene.add(r);
      return r;
    });

    const easeOut   = (x: number) => 1 - Math.pow(1 - Math.min(x, 1), 3);
    const easeInOut = (x: number) =>
      x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x+2, 3) / 2;

    const start = performance.now();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const t = (performance.now() - start) / 1000;

      const reveal = easeOut(Math.min(t / 1.5, 1));
      let morph = 0;
      if (t > 1.5 && t < 5)  morph = easeInOut(Math.min((t - 1.5) / 2.5, 1));
      if (t >= 5  && t < 7)  morph = easeInOut(1 - Math.min((t - 5) / 2, 1));
      const exit = t > 6.5 ? easeInOut(Math.min((t - 6.5) / 1.5, 1)) : 0;

      mat.uniforms.uTime.value   = t;
      mat.uniforms.uMorph.value  = morph;
      mat.uniforms.uReveal.value = reveal;
      mat.uniforms.uExit.value   = exit;

      pMat.uniforms.uTime.value   = t;
      pMat.uniforms.uReveal.value = reveal * (1 - exit);

      gridMat.uniforms.uTime.value   = t;
      gridMat.uniforms.uReveal.value = reveal * (1 - exit);

      mesh.rotation.y = t * 0.3 + morph * Math.sin(t * 0.5) * 0.5;
      mesh.rotation.x = Math.sin(t * 0.2) * 0.3;
      mesh.rotation.z = t * 0.1;
      mesh.scale.setScalar((1 + Math.sin(t * 2) * 0.04 * reveal) * (1 - exit * 0.5));

      camera.position.x = Math.sin(t * 0.1) * 0.5;
      camera.position.y = Math.cos(t * 0.13) * 0.3;
      camera.lookAt(0, 0, 0);

      rings.forEach((ring, i) => {
        (ring.material as THREE.MeshBasicMaterial).opacity =
          reveal * 0.6 * (1 - exit) * (0.4 + Math.sin(t * (1 + i * 0.3)) * 0.4);
        ring.rotation.x += 0.003 * (1 + i * 0.2);
        ring.rotation.y += 0.005 * (1 - i * 0.1);
        ring.rotation.z += 0.002 * i;
        ring.scale.setScalar((1 + morph * i * 0.1) * (1 - exit * 0.3));
      });

      particles.rotation.y = t * 0.05;
      renderer.render(scene, camera);

      if (performance.now() - start >= 8000) onComplete?.();
    };
    animate();

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [onComplete]);

  useEffect(() => {
    const iv = setInterval(() => setMsgIndex(p => (p + 1) % welcomeMessages.length), 420);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowText(false), 8000);
    return () => clearTimeout(t);
  }, []);

  const msg = welcomeMessages[msgIndex];

  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, background:"#000", overflow:"hidden", fontFamily:"'Courier New',monospace" }}>

      <div ref={canvasRef} style={{ position:"absolute", inset:0 }} />

      {/* Scan lines */}
      <div style={{ position:"absolute", inset:0, background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 4px)", pointerEvents:"none", zIndex:2 }} />

      {/* Vignette */}
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,0.85) 100%)", pointerEvents:"none", zIndex:3 }} />

      {showText && (
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:10, pointerEvents:"none" }}>
          <div key={"lang"+msgIndex} style={{ fontSize:"11px", letterSpacing:"0.3em", color:"rgba(100,200,255,0.5)", textTransform:"uppercase", marginBottom:"12px", animation:"fadeSlide 0.3s ease" }}>
            {msg.lang}
          </div>
          <div key={"txt"+msgIndex} style={{ fontSize:"clamp(48px,10vw,120px)", fontWeight:900, letterSpacing:"-0.02em", lineHeight:1, textAlign:"center", background:"linear-gradient(135deg,#fff 0%,rgba(100,220,255,0.9) 40%,rgba(200,100,255,0.8) 70%,#fff 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"textReveal 0.25s cubic-bezier(0.16,1,0.3,1)", filter:"drop-shadow(0 0 30px rgba(100,200,255,0.4))" }}>
            {msg.text}
          </div>
          <div style={{ marginTop:"24px", display:"flex", alignItems:"center", gap:"16px" }}>
            <div style={{ width:"60px", height:"1px", background:"linear-gradient(to right,transparent,rgba(100,200,255,0.6))" }} />
            <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"rgba(100,200,255,0.8)", boxShadow:"0 0 12px rgba(100,200,255,0.8)", animation:"pulse 1s ease infinite" }} />
            <div style={{ width:"60px", height:"1px", background:"linear-gradient(to left,transparent,rgba(100,200,255,0.6))" }} />
          </div>
        </div>
      )}

      {showText && (
        <>
          <div style={{ position:"absolute", top:"24px", left:"28px", zIndex:10, color:"rgba(100,200,255,0.45)", fontSize:"10px", letterSpacing:"0.2em", textTransform:"uppercase", lineHeight:1.8, pointerEvents:"none" }}>
            <div>SYS BOOT</div>
            <div style={{ color:"rgba(255,255,255,0.25)", fontSize:"9px" }}>v3.14159</div>
          </div>
          <div style={{ position:"absolute", top:"24px", right:"28px", zIndex:10, color:"rgba(100,200,255,0.45)", fontSize:"10px", letterSpacing:"0.2em", textTransform:"uppercase", textAlign:"right", lineHeight:1.8, pointerEvents:"none" }}>
            <div>INIT SEQUENCE</div>
            <div style={{ color:"rgba(255,100,200,0.4)", fontSize:"9px" }}>
              {"LANG " + String(msgIndex + 1).padStart(2, "0") + "/" + welcomeMessages.length}
            </div>
          </div>
          <div style={{ position:"absolute", bottom:"24px", left:"28px", zIndex:10, pointerEvents:"none" }}>
            <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
              {Array.from({ length: 16 }, (_, i) => (
                <div key={i} style={{ width:"3px", height:"14px", background: i <= msgIndex ? "rgba(100,220,255,0.8)" : "rgba(255,255,255,0.1)", borderRadius:"2px", transition:"background 0.3s" }} />
              ))}
            </div>
          </div>
          <div style={{ position:"absolute", bottom:"24px", right:"28px", zIndex:10, color:"rgba(255,255,255,0.2)", fontSize:"9px", letterSpacing:"0.15em", textAlign:"right", pointerEvents:"none" }}>
            MORPHOGENESIS ENGINE
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{ __html: CSS }} />
    </div>
  );
}
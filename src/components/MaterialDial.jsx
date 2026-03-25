import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, animate, useMotionValueEvent } from 'framer-motion';

const MATERIALS = [
  { name: 'PEARL WHITE', desc: 'Premium matte ceramic finish', bg: '#e5e2de' },
  { name: 'OAK GRAIN',   desc: 'Natural hardwood texture',      bg: '#8B7355' },
  { name: 'GRAPHITE',    desc: 'Industrial carbon composite',   bg: '#3a3a3a' },
];

/* Material palettes — top face dominant in near-top view */
const PAL = [
  { // Pearl White
    face:['#eae7e2','#e2dfda','#d8d5d0'], rim:['#b5b1ad','#9a9692','#807c78'],
    k:[130,125,118], spec:0.3, edgeLit:'rgba(255,255,255,0.55)', ind:'#8B7355',
  },
  { // Oak Grain
    face:['#907858','#806848','#705838'], rim:['#5a4030','#4a3020','#382010'],
    k:[225,200,165], spec:0.15, edgeLit:'rgba(255,210,140,0.35)', ind:'#E8A020',
  },
  { // Graphite
    face:['#484848','#383838','#282828'], rim:['#1e1e1e','#141414','#0a0a0a'],
    k:[175,175,175], spec:0.12, edgeLit:'rgba(255,255,255,0.22)', ind:'#E8A020',
  },
];

/* ── Near-top-view geometry (pitch ≈ 80°) ── */
const SZ=520, CX=260, CY=252;
const RX=160, RY=157;   // ry/rx ≈ 0.98 → near-top view
const NK=64;             // knurl mark count
const ML=14;             // mark length (radial)

// Bottom-face ellipse for variable-thickness rim:
//   top edge≈16, sides≈28, bottom≈40
const BF_CY=CY+28, BF_RY=169;   // offset center + adjusted ry

// Crescent rim path: traces between top-face bottom arc and bottom-face bottom arc
const rimD=[
  `M${CX-RX},${CY}`,                          // left of top face
  `A${RX},${RY},0,0,0,${CX+RX},${CY}`,        // bottom arc of top face (inner edge)
  `L${CX+RX},${BF_CY}`,                        // right side down to bottom face
  `A${RX},${BF_RY},0,0,1,${CX-RX},${BF_CY}`,  // bottom arc of bottom face (outer edge)
  'Z',
].join(' ');

export default function MaterialDial() {
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [marks, setMarks] = useState([]);
  const [ind, setInd] = useState({x1:0,y1:0,x2:0,y2:0,o:1});

  const progressMV = useMotionValue(0);
  const progress = useSpring(progressMV, {stiffness:100, damping:22});
  const knobRot = useTransform(progress, [0,1,2], [0, Math.PI*2/3, Math.PI*4/3]);
  const bgY = useTransform(progress, [0,1,2], ['0vh','-100vh','-200vh']);

  /* Compute radial knurl marks around circumference */
  const computeMarks = useCallback((rot) => {
    const m = [];
    for (let i = 0; i < NK; i++) {
      const th = (i / NK) * Math.PI * 2 + rot;
      const ct = Math.cos(th), st = Math.sin(th);
      // Outer point on top-face ellipse edge
      const ox = CX + RX * ct, oy = CY + RY * st;
      // Inner point (toward center, scaled for ellipse)
      const ix = CX + (RX - ML) * ct, iy = CY + (RY - ML * RY/RX) * st;
      // Perspective: far side (top, st<0) slightly dimmer
      const perspDim = 0.35 + 0.65 * ((st + 1) / 2);
      // Bottom marks partially hidden by rim
      const rimFade = st > 0.88 ? Math.max(0.1, 1 - (st - 0.88) / 0.12) : 1;
      m.push({ x1:ox, y1:oy, x2:ix, y2:iy, o: perspDim * rimFade * 0.5, w: perspDim > 0.5 ? 2 : 1.2, k:i });
    }
    setMarks(m);
    // Indicator line (from center area to edge)
    const ct = Math.cos(rot), st = Math.sin(rot);
    const indInner = 0.35; // starts 35% from center
    setInd({
      x1: CX + RX * indInner * ct, y1: CY + RY * indInner * st,
      x2: CX + (RX - 6) * ct, y2: CY + (RY - 6 * RY/RX) * st,
      o: 1,
    });
  }, []);

  useMotionValueEvent(knobRot, 'change', computeMarks);
  useEffect(() => { computeMarks(0); }, [computeMarks]);

  /* Intersection observer */
  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => setIsInView(e.isIntersecting && e.intersectionRatio > 0.4), {threshold:0.4});
    obs.observe(el); return () => obs.disconnect();
  }, []);

  /* Scroll snap navigation */
  const scrollAcc = useRef(0), isAnim = useRef(false);
  const snapTo = useCallback((i) => {
    if (isAnim.current) return; isAnim.current = true; setActiveIndex(i);
    animate(progressMV, i, {type:'spring', stiffness:100, damping:20, onComplete:()=>{isAnim.current=false}});
  }, [progressMV]);

  const handleWheel = useCallback((e) => {
    if (!isInView || isAnim.current) return;
    const idx = activeIndex;
    if (idx===0 && e.deltaY<0) return;
    if (idx===2 && e.deltaY>0) return;
    e.preventDefault(); e.stopPropagation();
    scrollAcc.current += e.deltaY;
    if (Math.abs(scrollAcc.current) >= 100) {
      const next = Math.max(0, Math.min(2, idx + (scrollAcc.current>0 ? 1 : -1)));
      if (next !== idx) snapTo(next);
      scrollAcc.current = 0;
    }
  }, [isInView, activeIndex, snapTo]);

  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    el.addEventListener('wheel', handleWheel, {passive:false});
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const p = PAL[activeIndex], kc = p.k;

  return (
    <section ref={sectionRef} style={{width:'100%',height:'100vh',position:'relative',overflow:'hidden',background:'#111'}}>
      {/* BG material bands */}
      <motion.div style={{position:'absolute',inset:0,width:'100%',height:'300vh',y:bgY,willChange:'transform'}}>
        <div style={{width:'100%',height:'100vh',background:'linear-gradient(170deg,#f0ede8 0%,#e5e2de 40%,#d8d4cf 100%)'}}/>
        <div style={{width:'100%',height:'100vh',background:`repeating-linear-gradient(175deg,rgba(120,85,50,.08) 0px,transparent 2px,transparent 8px),linear-gradient(170deg,#a08060 0%,#8B7355 25%,#7a6345 50%,#6b5438 75%,#8B7355 100%)`}}/>
        <div style={{width:'100%',height:'100vh',background:'linear-gradient(170deg,#4a4a4a 0%,#333 40%,#1e1e1e 100%)'}}/>
      </motion.div>

      {/* SVG Dial — Near Top View */}
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',zIndex:3,pointerEvents:'none'}}>
        <svg width={SZ} height={SZ} viewBox={`0 0 ${SZ} ${SZ}`}>
          <defs>
            {/* Per-material face gradients (directional light: top-left) */}
            {PAL.map((pl,mi) => (
              <radialGradient key={`fg${mi}`} id={`fg${mi}`} cx="35%" cy="30%" r="70%" fx="30%" fy="25%">
                <stop offset="0%" stopColor={pl.face[0]}/>
                <stop offset="50%" stopColor={pl.face[1]}/>
                <stop offset="100%" stopColor={pl.face[2]}/>
              </radialGradient>
            ))}
            {/* Per-material rim gradients (lit left, dark right) */}
            {PAL.map((pl,mi) => (
              <linearGradient key={`rg${mi}`} id={`rg${mi}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={pl.rim[0]}/>
                <stop offset="45%" stopColor={pl.rim[1]}/>
                <stop offset="100%" stopColor={pl.rim[2]}/>
              </linearGradient>
            ))}
            {/* Shadow filter */}
            <filter id="shF"><feGaussianBlur in="SourceGraphic" stdDeviation="30"/></filter>
            {/* Soft glow for specular */}
            <filter id="specF"><feGaussianBlur in="SourceGraphic" stdDeviation="8"/></filter>
            {/* Directional light overlay (top-left bright → bottom-right dark) */}
            <linearGradient id="dirLight" x1="0.2" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.12"/>
              <stop offset="40%" stopColor="#fff" stopOpacity="0.03"/>
              <stop offset="100%" stopColor="#000" stopOpacity="0.12"/>
            </linearGradient>
            {/* Rim body AO (contact shadow at body top) */}
            <linearGradient id="rimAO" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#000" stopOpacity="0.35"/>
              <stop offset="40%" stopColor="#000" stopOpacity="0.08"/>
              <stop offset="100%" stopColor="#000" stopOpacity="0"/>
            </linearGradient>
            {/* Edge highlight mask — brighter on left side of rim */}
            <linearGradient id="rimHL" x1="0" y1="0" x2="1" y2="0.3">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.2"/>
              <stop offset="30%" stopColor="#fff" stopOpacity="0.05"/>
              <stop offset="70%" stopColor="#fff" stopOpacity="0"/>
              <stop offset="100%" stopColor="#000" stopOpacity="0.08"/>
            </linearGradient>
          </defs>

          {/* ── 1. Cast shadow ── */}
          <ellipse cx={CX} cy={CY+6} rx={RX*1.1} ry={RY*0.6}
            fill="#000" opacity="0.18" filter="url(#shF)"/>

          {/* ── 2. Body rim (variable-thickness crescent) ── */}
          {PAL.map((_,mi) => (
            <path key={`rim${mi}`} d={rimD} fill={`url(#rg${mi})`}
              style={{opacity:activeIndex===mi?1:0,transition:'opacity 0.8s ease'}}/>
          ))}
          {/* Rim highlight overlay */}
          <path d={rimD} fill="url(#rimHL)"/>
          {/* Rim AO (shadow under top face overhang) */}
          <path d={rimD} fill="url(#rimAO)" opacity="0.6"/>
          {/* Bottom edge line */}
          <ellipse cx={CX} cy={BF_CY} rx={RX} ry={BF_RY}
            fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1"/>

          {/* ── 3. Top face (main visual, near-circular ellipse) ── */}
          {PAL.map((_,mi) => (
            <ellipse key={`face${mi}`} cx={CX} cy={CY} rx={RX} ry={RY}
              fill={`url(#fg${mi})`}
              style={{opacity:activeIndex===mi?1:0,transition:'opacity 0.8s ease'}}/>
          ))}
          {/* Directional light overlay on face */}
          <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="url(#dirLight)"/>

          {/* ── 4. Top face specular highlight (upper-left) ── */}
          <ellipse cx={CX-RX*0.22} cy={CY-RY*0.25} rx={RX*0.45} ry={RY*0.35}
            fill="rgba(255,255,255,1)" opacity={p.spec}
            filter="url(#specF)"
            style={{transition:'opacity 0.8s ease'}}/>
          {/* Sharp specular spot */}
          <ellipse cx={CX-RX*0.28} cy={CY-RY*0.3} rx={RX*0.12} ry={RY*0.08}
            fill="rgba(255,255,255,0.5)"
            style={{opacity:activeIndex===0?0.5:0.2,transition:'opacity 0.8s'}}/>

          {/* ── 5. Face-edge bevel (dark seam between face and rim) ── */}
          <ellipse cx={CX} cy={CY+1} rx={RX-0.5} ry={RY-0.5}
            fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="2"/>

          {/* ── 6. Top edge rim highlight (lit side) ── */}
          {/* Left/top arc brighter, right/bottom darker */}
          <ellipse cx={CX} cy={CY} rx={RX} ry={RY}
            fill="none" stroke={p.edgeLit} strokeWidth="1.5"
            strokeDasharray={`${Math.PI*(RX+RY)*0.35} ${Math.PI*(RX+RY)*0.65}`}
            strokeDashoffset={Math.PI*(RX+RY)*0.15}
            style={{transition:'stroke 0.8s ease'}}/>
          {/* Subtle full-circle thin rim */}
          <ellipse cx={CX} cy={CY} rx={RX} ry={RY}
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8"/>

          {/* ── 7. Knurl marks (radial grooves around circumference) ── */}
          {marks.map(m => (
            <line key={m.k} x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2}
              stroke={`rgba(${kc[0]},${kc[1]},${kc[2]},${m.o})`}
              strokeWidth={m.w} strokeLinecap="round"
              style={{transition:'stroke 0.8s ease'}}/>
          ))}

          {/* ── 8. Indicator line (radial, from center area to edge) ── */}
          <line x1={ind.x1} y1={ind.y1} x2={ind.x2} y2={ind.y2}
            stroke={p.ind} strokeWidth={3.5} strokeLinecap="round"
            opacity={0.85}
            style={{filter:`drop-shadow(0 0 8px ${p.ind})`,transition:'stroke 0.8s ease'}}/>
          {/* Indicator tip dot */}
          <circle cx={ind.x2} cy={ind.y2} r={4}
            fill={p.ind} opacity={0.9}
            style={{filter:`drop-shadow(0 0 6px ${p.ind})`}}/>
          {/* Center dot */}
          <circle cx={CX} cy={CY} r={6}
            fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
          <circle cx={CX-1} cy={CY-1} r={2.5}
            fill="rgba(255,255,255,0.15)"/>

          {/* ── 9. Subtle reflection on bottom-right (ground bounce light) ── */}
          <ellipse cx={CX+RX*0.3} cy={CY+RY*0.25} rx={RX*0.25} ry={RY*0.15}
            fill="rgba(255,255,255,0.03)"/>
        </svg>
      </div>

      {/* Vignette */}
      <div style={{position:'absolute',inset:0,
        background:'linear-gradient(to bottom,rgba(17,17,17,0.4) 0%,transparent 8%,transparent 92%,rgba(17,17,17,0.5) 100%)',
        pointerEvents:'none',zIndex:4}}/>

      {/* Nav dots */}
      <div style={{position:'absolute',right:'2.5rem',top:'50%',transform:'translateY(-50%)',
        display:'flex',flexDirection:'column',gap:'1.2rem',zIndex:5}}>
        {MATERIALS.map((m,i) => (
          <button key={m.name} onClick={()=>snapTo(i)} style={{
            width:activeIndex===i?'12px':'7px',height:activeIndex===i?'12px':'7px',borderRadius:'50%',
            background:activeIndex===i?'#FFF':'rgba(255,255,255,0.25)',
            border:activeIndex===i?'2px solid #FFF':'1px solid rgba(255,255,255,0.15)',
            boxShadow:activeIndex===i?'0 0 12px rgba(255,255,255,0.5)':'none',
            cursor:'pointer',transition:'all 0.4s cubic-bezier(0.16,1,0.3,1)',padding:0,outline:'none',
          }} aria-label={`Select ${m.name}`}/>
        ))}
      </div>

      {/* Material label */}
      <div style={{position:'absolute',bottom:'3.5rem',left:'3.5rem',zIndex:5}}>
        <motion.div key={activeIndex} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}}
          transition={{duration:0.5,ease:[0.16,1,0.3,1]}}>
          <div style={{display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'0.35rem'}}>
            <div style={{width:'20px',height:'20px',borderRadius:'50%',background:MATERIALS[activeIndex].bg,
              border:'2px solid rgba(255,255,255,0.35)',boxShadow:`0 0 15px ${MATERIALS[activeIndex].bg}40`}}/>
            <span className="pixel-text" style={{fontSize:'0.8rem',color:'#FFF',letterSpacing:'0.2em',
              textShadow:'0 2px 10px rgba(0,0,0,0.9)'}}>{MATERIALS[activeIndex].name}</span>
          </div>
          <p style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.45)',fontStyle:'italic',
            textShadow:'0 1px 5px rgba(0,0,0,0.9)',marginLeft:'2rem'}}>{MATERIALS[activeIndex].desc}</p>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div initial={{opacity:1}} animate={{opacity:activeIndex>0?0:1}} transition={{duration:0.4}}
        style={{position:'absolute',bottom:'1.5rem',left:'50%',transform:'translateX(-50%)',
          display:'flex',flexDirection:'column',alignItems:'center',gap:'0.3rem',zIndex:5,pointerEvents:'none'}}>
        <span className="pixel-text" style={{fontSize:'0.6rem',color:'rgba(255,255,255,0.35)',letterSpacing:'0.2em'}}>SCROLL TO EXPLORE</span>
        <motion.div animate={{y:[0,6,0]}} transition={{repeat:Infinity,duration:1.6,ease:'easeInOut'}}
          style={{color:'rgba(255,255,255,0.25)',fontSize:'1rem'}}>↓</motion.div>
      </motion.div>

      {/* Section title */}
      <div style={{position:'absolute',top:'2rem',right:'2.5rem',zIndex:5}}>
        <span className="pixel-text" style={{fontSize:'0.6rem',color:'rgba(255,255,255,0.3)',letterSpacing:'0.25em'}}>CMF / MATERIAL SELECTION</span>
      </div>
    </section>
  );
}

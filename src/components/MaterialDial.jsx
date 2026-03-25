import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';

/*
 * MaterialDial — CMF Material Selector
 *
 * Architecture:
 *   LAYER 1 (Background): Three material bands stacked vertically, slide up/down
 *   LAYER 2 (Foreground): SVG-rendered knob (dome + glowing arc + ticks),
 *                         fixed center, rotates on scroll
 *
 * The knob is built in SVG to match the original image's aesthetic:
 *   - Dark 3D dome with metallic gradients
 *   - Glowing white arc (partial circle)
 *   - Radial tick marks
 *   - Soft shadow
 */

const MATERIALS = [
  { name: 'PEARL WHITE', desc: 'Premium matte ceramic finish',  bg: '#e5e2de' },
  { name: 'OAK GRAIN',   desc: 'Natural hardwood texture',      bg: '#8B7355' },
  { name: 'GRAPHITE',    desc: 'Industrial carbon composite',   bg: '#3a3a3a' },
];

export default function MaterialDial() {
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const progressMV = useMotionValue(0);
  const smoothProgress = useSpring(progressMV, { stiffness: 120, damping: 22 });

  // Knob rotation: 0→120° (keeps dome visible and natural)
  const knobRotation = useTransform(smoothProgress, [0, 1, 2], [0, 60, 120]);
  // Background Y offset
  const bgY = useTransform(smoothProgress, [0, 1, 2], ['0vh', '-100vh', '-200vh']);

  const scrollAccumulator = useRef(0);
  const isAnimating = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting && entry.intersectionRatio > 0.4),
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const snapTo = useCallback((index) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setActiveIndex(index);
    animate(progressMV, index, {
      type: 'spring', stiffness: 100, damping: 20,
      onComplete: () => { isAnimating.current = false; }
    });
  }, [progressMV]);

  const handleWheel = useCallback((e) => {
    if (!isInView || isAnimating.current) return;
    const idx = activeIndex;
    if (idx === 0 && e.deltaY < 0) return;
    if (idx === 2 && e.deltaY > 0) return;
    e.preventDefault();
    e.stopPropagation();
    scrollAccumulator.current += e.deltaY;
    if (Math.abs(scrollAccumulator.current) >= 100) {
      const dir = scrollAccumulator.current > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(2, idx + dir));
      if (next !== idx) snapTo(next);
      scrollAccumulator.current = 0;
    }
  }, [isInView, activeIndex, snapTo]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const imgSrc = `${import.meta.env.BASE_URL}assets/cmf_mock_3 1.png`;
  const KNOB_SIZE = 420;

  return (
    <section
      ref={sectionRef}
      style={{
        width: '100%', height: '100vh',
        position: 'relative', overflow: 'hidden',
        background: '#111',
      }}
    >
      {/* === LAYER 1: BACKGROUND MATERIAL BANDS === */}
      <motion.div style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '300vh',
        y: bgY, willChange: 'transform',
      }}>
        {/* Band 1: Pearl White */}
        <div style={{
          width: '100%', height: '100vh',
          background: 'linear-gradient(170deg, #f0ede8 0%, #e5e2de 40%, #d8d4cf 100%)',
        }} />
        {/* Band 2: Oak Grain — rich wood-tone CSS gradient */}
        <div style={{
          width: '100%', height: '100vh',
          background: `
            repeating-linear-gradient(
              175deg,
              rgba(120,85,50,0.08) 0px,
              transparent 2px,
              transparent 8px
            ),
            linear-gradient(170deg, #a08060 0%, #8B7355 25%, #7a6345 50%, #6b5438 75%, #8B7355 100%)
          `,
        }} />
        {/* Band 3: Graphite */}
        <div style={{
          width: '100%', height: '100vh',
          background: 'linear-gradient(170deg, #4a4a4a 0%, #333 40%, #1e1e1e 100%)',
        }} />
      </motion.div>

      {/* === LAYER 2: SVG KNOB — fixed center, rotates === */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 3,
        width: `${KNOB_SIZE}px`, height: `${KNOB_SIZE}px`,
        pointerEvents: 'none',
      }}>
        <motion.div style={{
          width: '100%', height: '100%',
          rotate: knobRotation,
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6)) drop-shadow(0 8px 15px rgba(0,0,0,0.4))',
        }}>
          <SVGKnob size={KNOB_SIZE} />
        </motion.div>
      </div>

      {/* === UI OVERLAYS === */}
      {/* Edge vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          linear-gradient(to bottom, rgba(17,17,17,0.4) 0%, transparent 8%, transparent 92%, rgba(17,17,17,0.5) 100%)
        `,
        pointerEvents: 'none', zIndex: 4,
      }} />

      {/* Nav dots */}
      <div style={{
        position: 'absolute', right: '2.5rem', top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: '1.2rem', zIndex: 5,
      }}>
        {MATERIALS.map((mat, i) => (
          <button key={mat.name} onClick={() => snapTo(i)}
            style={{
              width: activeIndex === i ? '12px' : '7px',
              height: activeIndex === i ? '12px' : '7px',
              borderRadius: '50%',
              background: activeIndex === i ? '#FFF' : 'rgba(255,255,255,0.25)',
              border: activeIndex === i ? '2px solid #FFF' : '1px solid rgba(255,255,255,0.15)',
              boxShadow: activeIndex === i ? '0 0 12px rgba(255,255,255,0.5)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              padding: 0, outline: 'none',
            }}
            aria-label={`Select ${mat.name}`}
          />
        ))}
      </div>

      {/* Material label */}
      <div style={{ position: 'absolute', bottom: '3.5rem', left: '3.5rem', zIndex: 5 }}>
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%',
              background: MATERIALS[activeIndex].bg,
              border: '2px solid rgba(255,255,255,0.35)',
              boxShadow: `0 0 15px ${MATERIALS[activeIndex].bg}40`,
            }} />
            <span className="pixel-text" style={{
              fontSize: '0.8rem', color: '#FFF', letterSpacing: '0.2em',
              textShadow: '0 2px 10px rgba(0,0,0,0.9)',
            }}>{MATERIALS[activeIndex].name}</span>
          </div>
          <p style={{
            fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', fontStyle: 'italic',
            textShadow: '0 1px 5px rgba(0,0,0,0.9)', marginLeft: '2rem',
          }}>{MATERIALS[activeIndex].desc}</p>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: activeIndex > 0 ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
          zIndex: 5, pointerEvents: 'none',
        }}
      >
        <span className="pixel-text" style={{
          fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em',
        }}>SCROLL TO EXPLORE</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          style={{ color: 'rgba(255,255,255,0.25)', fontSize: '1rem' }}
        >↓</motion.div>
      </motion.div>

      {/* Section title */}
      <div style={{ position: 'absolute', top: '2rem', right: '2.5rem', zIndex: 5 }}>
        <span className="pixel-text" style={{
          fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.25em',
        }}>CMF / MATERIAL SELECTION</span>
      </div>
    </section>
  );
}


/* =========================================================
   SVG KNOB COMPONENT — Faithful recreation of the dial from the original image
   ========================================================= */
function SVGKnob({ size }) {
  const cx = size / 2;
  const cy = size / 2;
  const arcR = size * 0.42;  // outer arc radius
  const domeRx = size * 0.30; // dome horizontal radius  
  const domeRy = size * 0.18; // dome is shorter (side-view perspective)
  const domeShift = size * 0.04; // dome sits slightly below center (perspective)

  // Generate tick marks around 270° of arc (from -225° to 45°, same as original)
  const ticks = [];
  const tickCount = 24;
  const startAngle = -225;
  const endAngle = 45;
  for (let i = 0; i <= tickCount; i++) {
    const angle = startAngle + (endAngle - startAngle) * (i / tickCount);
    const rad = (angle * Math.PI) / 180;
    const innerR = arcR - (i % 3 === 0 ? size * 0.065 : size * 0.04);
    const outerR = arcR - size * 0.01;
    ticks.push({
      x1: cx + innerR * Math.cos(rad),
      y1: cy + innerR * Math.sin(rad),
      x2: cx + outerR * Math.cos(rad),
      y2: cy + outerR * Math.sin(rad),
      major: i % 3 === 0,
    });
  }

  // Arc path (270° sweep)
  const arcStart = (-225 * Math.PI) / 180;
  const arcEnd = (45 * Math.PI) / 180;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Dome body gradient — metallic dark */}
        <radialGradient id="domeGrad" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#6a6a6a" />
          <stop offset="35%" stopColor="#4a4a4a" />
          <stop offset="70%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </radialGradient>

        {/* Dome highlight */}
        <radialGradient id="domeHighlight" cx="40%" cy="25%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        {/* Dome base rim gradient */}
        <linearGradient id="baseRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#555" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>

        {/* Arc glow filter */}
        <filter id="arcGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Drop shadow for dome */}
        <filter id="domeShadow" x="-20%" y="-10%" width="140%" height="150%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
          <feOffset dy="6" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer arc glow (partial circle, 270°) */}
      <path
        d={describeArc(cx, cy, arcR, -225, 45)}
        fill="none"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="3"
        strokeLinecap="round"
        filter="url(#arcGlow)"
      />

      {/* Thin inner arc line */}
      <path
        d={describeArc(cx, cy, arcR - size * 0.015, -225, 45)}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Tick marks */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1} y1={t.y1}
          x2={t.x2} y2={t.y2}
          stroke={t.major ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)'}
          strokeWidth={t.major ? 2.5 : 1.5}
          strokeLinecap="round"
        />
      ))}

      {/* Dome base (wider ellipse, darker — the "shelf" the dome sits on) */}
      <ellipse
        cx={cx}
        cy={cy + domeShift + domeRy * 0.3}
        rx={domeRx * 1.15}
        ry={domeRy * 0.45}
        fill="url(#baseRimGrad)"
        opacity="0.8"
      />

      {/* Dome body */}
      <ellipse
        cx={cx}
        cy={cy + domeShift}
        rx={domeRx}
        ry={domeRy}
        fill="url(#domeGrad)"
        filter="url(#domeShadow)"
      />

      {/* Dome specular highlight */}
      <ellipse
        cx={cx - domeRx * 0.1}
        cy={cy + domeShift - domeRy * 0.15}
        rx={domeRx * 0.7}
        ry={domeRy * 0.5}
        fill="url(#domeHighlight)"
      />

      {/* Indicator dot on the dome */}
      <circle
        cx={cx}
        cy={cy + domeShift - domeRy * 0.5}
        r={3.5}
        fill="#E8A020"
        opacity="0.9"
      />
      <circle
        cx={cx}
        cy={cy + domeShift - domeRy * 0.5}
        r={6}
        fill="none"
        stroke="#E8A020"
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  );
}

/* Utility: describe an SVG arc path from startAngle to endAngle (degrees) */
function describeArc(cx, cy, r, startAngle, endAngle) {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

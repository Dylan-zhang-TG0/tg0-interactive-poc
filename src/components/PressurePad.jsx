import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PressurePad() {
  const [isPressing, setIsPressing] = useState(false);
  const [pressure, setPressure] = useState(0); 
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let animationFrame;
    const loop = () => {
      setTick(Date.now());
      if (isPressing) {
        setPressure(prev => (prev < 100 ? prev + 3 : 100));
      } else {
        setPressure(prev => (prev > 0 ? prev - 5 : 0));
      }
      animationFrame = requestAnimationFrame(loop);
    };
    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPressing]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span className="heading-xl">{Math.round(pressure)}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>FORCE KG</span>
      </div>

      <motion.div
        onPointerDown={() => setIsPressing(true)}
        onPointerUp={() => setIsPressing(false)}
        onPointerLeave={() => setIsPressing(false)}
        style={{
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'var(--bg-panel)',
          boxShadow: 'var(--shadow-pill)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          touchAction: 'none'
        }}
        animate={{ scale: isPressing ? 0.96 : 1, boxShadow: isPressing ? 'inset 0 10px 30px rgba(0,0,0,0.8)' : 'var(--shadow-pill)' }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <motion.div 
           style={{
             width: '200px', height: '200px', borderRadius: '50%',
             background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)',
           }}
           animate={{ opacity: 0.3 + (pressure / 150) }}
        />
      </motion.div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '3rem', height: '60px', alignItems: 'flex-end', justifyContent: 'center' }}>
        {[...Array(9)].map((_, i) => {
          const noise = Math.sin((tick / 200) + i) * 15 * (pressure/100);
          const height = Math.max(4, 10 + (pressure / 100 * 35) + noise);
          return (
            <motion.div
              key={i}
              style={{
                width: '3px',
                background: i % 2 === 0 ? 'var(--text-primary)' : 'var(--accent-blue)',
                borderRadius: '2px',
                height: `${height}px`
              }}
              transition={{ type: 'tween', duration: 0.1 }}
            />
          );
        })}
      </div>
    </div>
  );
}

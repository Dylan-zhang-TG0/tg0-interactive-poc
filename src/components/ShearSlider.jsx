import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export default function ShearSlider() {
  const containerRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    return x.onChange(latest => setCoords(prev => ({ ...prev, x: Math.round(latest) })));
  }, [x]);

  useEffect(() => {
    return y.onChange(latest => setCoords(prev => ({ ...prev, y: Math.round(latest) })));
  }, [y]);

  const distance = Math.sqrt(Math.pow(coords.x, 2) + Math.pow(coords.y, 2));
  const angle = Math.atan2(coords.y, coords.x) * (180 / Math.PI);
  
  const twistAngle = useTransform(x, [-60, 60], [-45, 45]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      
      <div 
        ref={containerRef}
        style={{
          width: '240px',
          height: '240px',
          background: 'var(--bg-panel)',
          borderRadius: '50%',
          boxShadow: 'var(--shadow-pad)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <motion.div
           drag
           dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
           dragElastic={0.5}
           style={{
             width: '50px',
             height: '180px',
             borderRadius: '25px',
             background: 'linear-gradient(135deg, #e0e0e0, #ffffff)',
             boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 -4px 8px rgba(0,0,0,0.2), inset 0 4px 8px rgba(255,255,255,0.8)',
             cursor: 'grab',
             x,
             y,
             rotate: twistAngle
           }}
           whileTap={{ cursor: 'grabbing', scale: 0.95 }}
           transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
      </div>

      <div style={{ marginBottom: '1rem', marginTop: '3rem', display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '240px' }}>
        <div style={{ display: 'flex', fontFamily: 'var(--font-pixel)', color: 'var(--accent-purple)', fontSize: '1rem', gap: '0.5rem' }}>
          <span>X: </span>
          <span>0, 29, 34, 55, 47, {Math.abs(coords.x).toString().padStart(3, '0')}</span>
        </div>
        <div style={{ display: 'flex', fontFamily: 'var(--font-pixel)', color: 'var(--accent-purple)', fontSize: '1rem', gap: '0.5rem', margin: '0.5rem 0' }}>
          <span>Y: </span>
          <span>0, 29, 34, 55, 47, {Math.abs(coords.y).toString().padStart(3, '0')}</span>
        </div>
        <div style={{ display: 'flex', fontFamily: 'var(--font-pixel)', color: 'var(--accent-purple)', fontSize: '1rem', gap: '0.5rem' }}>
          <span>Z: </span>
          <span>0, 29, 34, 55, 47, {(89 - Math.round(distance / 2)).toString().padStart(3, '0')}</span>
        </div>
      </div>

      <div style={{ position: 'relative', width: '80px', height: '80px', marginTop: '1rem' }}>
         <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--text-secondary)' }} />
         
         <div
            style={{
               position: 'absolute',
               top: '50%', left: '50%',
               height: '2px',
               background: 'var(--text-primary)',
               transformOrigin: '0% 50%',
               width: `${distance * 0.6}px`, 
               transform: `rotate(${angle}deg)`
            }}
         />

         <div 
           style={{
             position: 'absolute', top: '50%', left: '50%',
             width: '12px', height: '12px', borderRadius: '50%', background: 'var(--text-primary)',
             transform: `translate(calc(-50% + ${coords.x * 0.6}px), calc(-50% + ${coords.y * 0.6}px))`
           }}
         />
      </div>
    </div>
  );
}

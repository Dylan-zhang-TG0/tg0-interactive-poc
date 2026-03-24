import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TouchDial({ size = 'large' }) {
  const dialRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [angle, setAngle] = useState(0); 
  const lastAngle = useRef(0);
  
  const value = Math.round((((angle % 360) + 360) % 360) / 360 * 100);
  const isSmall = size === 'small';

  const handlePointerDown = (e) => {
    setIsDragging(true);
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    lastAngle.current = rad * (180 / Math.PI);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    let currentDeg = rad * (180 / Math.PI);
    
    // Calculate continuous delta to avoid 180/-180 snap flips
    let delta = currentDeg - lastAngle.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    
    setAngle(prev => prev + delta);
    lastAngle.current = currentDeg;
  };

  const handlePointerUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      
      {/* Readout only for large mode */}
      {!isSmall && (
        <div style={{ display: 'flex', gap: '4rem', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="heading-xl">{value}%</span>
            <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }} className="pixel-text">DYNAMICS</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="heading-xl" style={{ color: 'var(--accent-blue)' }}>{100 - value}%</span>
            <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }} className="pixel-text">REMAINING</span>
          </div>
        </div>
      )}

      {/* The Dial */}
      <div 
        ref={dialRef}
        onPointerDown={handlePointerDown}
        style={{
          width: isSmall ? '240px' : '400px',
          height: isSmall ? '240px' : '400px',
          borderRadius: '50%',
          background: 'var(--bg-panel)',
          boxShadow: 'var(--shadow-dial)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
      >
        {/* Tick Marks */}
        <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
           {[...Array(40)].map((_, i) => (
             <div key={i} style={{
               position: 'absolute',
               top: 0, left: '50%',
               width: '2px', height: isSmall ? '10px' : '16px',
               marginLeft: '-1px',
               background: 'rgba(255,255,255,0.15)',
               transformOrigin: isSmall ? '50% 120px' : '50% 200px',
               transform: `rotate(${i * 9}deg)`
             }}/>
           ))}
        </div>

        <motion.div 
          style={{
            width: isSmall ? '160px' : '260px',
            height: isSmall ? '160px' : '260px',
            borderRadius: '50%',
            background: 'var(--bg-dark)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8), inset 0 2px 5px rgba(255,255,255,0.1)',
            position: 'absolute'
          }}
          animate={{ rotate: angle }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Indicator Dot */}
          <div style={{
            position: 'absolute',
            top: isSmall ? '15px' : '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: isSmall ? '12px' : '16px',
            height: isSmall ? '12px' : '16px',
            borderRadius: '50%',
            background: 'var(--accent-orange)',
            boxShadow: '0 0 15px var(--accent-orange), 0 0 30px var(--accent-orange)'
          }}/>
        </motion.div>
      </div>

      {/* Small Circle Visualizer only for small mode */}
      {isSmall && (
        <div style={{ marginTop: '3rem', width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--text-secondary)', position: 'relative' }}>
           <motion.div 
             style={{
               position: 'absolute', top: 0, left: '50%', width: '16px', height: '16px', 
               borderRadius: '50%', background: 'var(--text-primary)', marginLeft: '-8px', marginTop: '-8px',
               transformOrigin: '50% 38px' 
             }}
             animate={{ rotate: angle }}
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
           />
        </div>
      )}
    </div>
  );
}

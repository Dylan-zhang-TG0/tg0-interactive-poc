import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function Preloader({ onComplete }) {
  const [pressure, setPressure] = useState(0);
  const blockControls = useAnimation();
  const textControls = useAnimation();
  const bgControls = useAnimation();

  useEffect(() => {
    let start;
    const duration = 1200;
    
    // 1. Counter animation
    const raf = (time) => {
      if (!start) start = time;
      const progress = Math.min((time - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setPressure(Math.floor(ease * 999));
      
      if (progress < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // 2. Main choreography sequence
    const sequence = async () => {
      // Wait for counter to near end
      await new Promise(r => setTimeout(r, 1000));
      
      // Slam down the block
      await blockControls.start({
        y: "0vh",
        transition: { duration: 0.3, ease: "easeIn" }
      });

      // The exact moment it hits, the text is "stamped" 
      // (hidden under block, but we set opacity so it's there when block lifts)
      textControls.set({ opacity: 1, scale: 1 });

      // Slight pause for the "pressure" impact feel
      await new Promise(r => setTimeout(r, 150));

      // Lift the block up quickly
      await blockControls.start({
        y: "-100vh",
        transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } // Expo ease out
      });

      // Pause briefly showing the stamped logo to the user
      await new Promise(r => setTimeout(r, 800));

      // Fade out the entire preloader background
      await bgControls.start({
        opacity: 0,
        transition: { duration: 0.8, ease: "easeInOut" }
      });

      onComplete();
    };

    sequence();
  }, [blockControls, textControls, bgControls, onComplete]);

  return (
    <motion.div
      animate={bgControls}
      style={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: '#EBEBEB',
        zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      <div style={{
        position: 'absolute', bottom: '3vw', right: '4vw',
        fontFamily: "'IBM Plex Mono', monospace", fontSize: '1rem',
        color: '#111', letterSpacing: '0.1em'
      }}>
        [ PRESSURE: {String(pressure).padStart(3, '0')} kPa ]
      </div>

      <motion.div
        animate={textControls}
        initial={{ opacity: 0, scale: 0.95 }}
        style={{
          fontFamily: "'General Sans', sans-serif", fontWeight: 600,
          fontSize: 'clamp(5rem, 15vw, 15rem)', letterSpacing: '-0.04em',
          color: '#111', zIndex: 1
        }}
      >
        TG0
      </motion.div>

      {/* The Heavy Mold Press */}
      <motion.div
        animate={blockControls}
        initial={{ y: "-100vh" }}
        style={{
          position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: '#1B4EDC', zIndex: 2
        }}
      />
    </motion.div>
  );
}

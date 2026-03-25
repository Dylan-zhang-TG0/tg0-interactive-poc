import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function InteractiveSliderMockup() {
  const constraintsRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div 
      style={{ 
        width: '100%', 
        maxWidth: '800px', 
        padding: '2rem 1rem',
        margin: '0 auto', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      {/* Real Track Container */}
      <div 
        ref={constraintsRef}
        style={{
          width: '100%',
          height: '140px',
          background: '#fff', 
          border: '1px solid var(--accent-blue)',
          boxShadow: '0 10px 30px rgba(27,78,220,0.1)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          overflow: 'visible', // allow our cut-out ridge to overflow a bit
          padding: '0 40px'
        }}
      >
        {/* Track center line */}
        <div style={{ position: 'absolute', top: '50%', left: '40px', width: 'calc(100% - 80px)', height: '1px', background: 'var(--accent-blue)', borderTop: '1px dashed var(--accent-blue)' }} />

        <div style={{ 
          position: 'absolute', 
          width: '100%', 
          textAlign: 'center', 
          left: 0,
          pointerEvents: 'none',
          color: 'var(--accent-blue)',
          fontWeight: '500',
          letterSpacing: '0.2em',
          fontSize: '0.85rem',
          fontFamily: 'var(--font-pixel)',
          userSelect: 'none',
          top: '-30px'
        }}>
          [ 04 — INTERACTIVE MOCKUP ]
        </div>

        {/* The isolated Ridge (Thumb) */}
        <motion.div
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.2}
          dragMomentum={false}
          whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
          whileHover={{ scale: 1.02, cursor: 'grab' }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          initial={{ x: 0 }}
          style={{
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // Here is the magic: we isolate the center "ridge"
            width: '100px', // crop width for the ridge
            height: '240px', // crop height for the ridge
            overflow: 'hidden', // hides the rest of the image background
            borderRadius: '50px', // gives the crop a pill-shape just in case
            filter: isDragging ? 'drop-shadow(0 20px 30px rgba(0,0,0,0.2))' : 'drop-shadow(0 10px 15px rgba(0,0,0,0.15))',
            transition: 'filter 0.3s ease, transform 0.3s ease',
            // mixBlendMode: 'multiply' works great to "erase" white/light backgrounds
            mixBlendMode: 'multiply'
          }}
        >
          {/* We load the full image, but center it perfectly so the ridge aligns in our 100x240 cutout */}
          <img 
            src={`${import.meta.env.BASE_URL}assets/Inters_test_01 2.svg`} 
            alt="Isolated Slider Ridge"
            style={{
              width: '384px',
              height: '340px',
              maxWidth: 'none', // Critical: prevents the image from shrinking into the 100px container
              objectFit: 'none', // Disables resizing
              objectPosition: 'center', // Centers the ridge exactly in the crop window
              pointerEvents: 'none',
              userSelect: 'none'
            }}
            draggable={false}
          />
        </motion.div>
      </div>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';

export default function Marquee({ speed = 20 }) {
  const logos = [
    "etee", "ZWIFT", "Harley Davidson", "University of South Wales", "Bournemouth University", "ITALDESIGN"
  ];

  // We duplicate the list to create a seamless infinite scroll loop
  const content = [...logos, ...logos, ...logos].map((logo, index) => (
    <div key={index} style={{ 
      fontSize: '1.2rem', 
      fontWeight: '600', 
      color: 'var(--accent-blue)', 
      fontFamily: 'var(--font-pixel)',
      letterSpacing: '0.15em',
      padding: '0 3rem',
      whiteSpace: 'nowrap'
    }}>
      {logo.toUpperCase()}
    </div>
  ));

  return (
    <div style={{
      overflow: 'hidden',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      background: '#ffffff',
      padding: '2rem 0',
      borderTop: '1px solid var(--accent-blue)',
      borderBottom: '1px solid var(--accent-blue)'
    }}>
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed
        }}
        style={{ display: 'flex', minWidth: 'max-content' }}
      >
        {content}
      </motion.div>
    </div>
  );
}

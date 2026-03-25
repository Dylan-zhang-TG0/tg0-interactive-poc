import React from 'react';
import { motion } from 'framer-motion';

const LOGOS = [
  { src: 'logos/Logo_etee_Black 1.png', alt: 'etee', h: 40 },
  { src: 'logos/Logo_Zwift_Black 1.png', alt: 'Zwift', h: 40 },
  { src: 'logos/Harley-Davidson_logo_black 1.png', alt: 'Harley Davidson', h: 52 },
  { src: 'logos/Logo_SouthWales_Black 1.png', alt: 'University of South Wales', h: 48 },
  { src: 'logos/Logo_Bournemouth_Black 1.png', alt: 'Bournemouth University', h: 48 },
  { src: 'logos/2023-car-design-studio-italdesign-new-logo-design-black 1.png', alt: 'Italdesign', h: 44 },
];

export default function Marquee({ speed = 30 }) {
  const base = import.meta.env.BASE_URL;
  // Triple for seamless loop
  const items = [...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <div style={{
      overflow: 'hidden',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      background: '#E4E4E4',
      padding: '2rem 0',
      borderTop: '1px solid rgba(0,0,0,0.1)',
      borderBottom: '1px solid rgba(0,0,0,0.1)',
    }}>
      <motion.div
        animate={{ x: [0, -(LOGOS.length * 220)] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: speed,
        }}
        style={{ display: 'flex', alignItems: 'center', minWidth: 'max-content' }}
      >
        {items.map((logo, i) => (
          <div key={i} style={{ padding: '0 3.5rem', display: 'flex', alignItems: 'center' }}>
            <img
              src={`${base}assets/${logo.src}`}
              alt={logo.alt}
              style={{
                height: `${logo.h}px`,
                objectFit: 'contain',
                opacity: 0.7,
                filter: 'grayscale(100%)',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              draggable={false}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

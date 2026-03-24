import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function TechExplosion() {
  const containerRef = useRef(null);
  
  // Track scroll correctly within the 300vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Layer Animations: As scroll goes 0 -> 0.6, the object fully explodes
  const layer1Y = useTransform(scrollYProgress, [0, 0.6], [0, -150]); // Top (Black Surface)
  const layer2Y = useTransform(scrollYProgress, [0, 0.6], [0, -50]);  // Internal Structure
  const layer3Y = useTransform(scrollYProgress, [0, 0.6], [0, 50]);   // Green PCB
  const layer4Y = useTransform(scrollYProgress, [0, 0.6], [0, 150]);  // Base
  
  const layers = [
    { src: 'Tech_explosion_4 1.png', zIndex: 1, y: layer4Y },
    { src: 'Tech_explosion_3 1.png', zIndex: 2, y: layer3Y },
    { src: 'Tech_explosion_2 1.png', zIndex: 3, y: layer2Y },
    { src: 'Tech_explosion_1 1.png', zIndex: 4, y: layer1Y },
  ];

  // Specific Text Callout fade-in mapped to the scroll progress
  // They fade in sequentially as the device opens up
  const callouts = [
    {
      text: "Retain the customer's chosen <b>surface material</b>, while adapting seamlessly to any 3D geometry or level of flexibility.",
      opacity: useTransform(scrollYProgress, [0.1, 0.3], [0, 1]),
      x: useTransform(scrollYProgress, [0.1, 0.3], [20, 0])
    },
    {
      text: "<b>Customized textures</b> are engineered to generate touch signals that are uniquely interpretable by TG0 algorithms.",
      opacity: useTransform(scrollYProgress, [0.2, 0.4], [0, 1]),
      x: useTransform(scrollYProgress, [0.2, 0.4], [20, 0])
    },
    {
      text: "Specially engineered <b>internal structures</b> detect and amplify deformation.",
      opacity: useTransform(scrollYProgress, [0.3, 0.5], [0, 1]),
      x: useTransform(scrollYProgress, [0.3, 0.5], [20, 0])
    },
    {
      text: "Simple and robust <b>electrical connections</b> between the conductive material and the PCB.",
      opacity: useTransform(scrollYProgress, [0.4, 0.6], [0, 1]),
      x: useTransform(scrollYProgress, [0.4, 0.6], [20, 0])
    },
    {
      text: "Compatible with existing casings or protective <b>layers</b>.",
      opacity: useTransform(scrollYProgress, [0.5, 0.7], [0, 1]),
      x: useTransform(scrollYProgress, [0.5, 0.7], [20, 0])
    }
  ];

  // Title animation: Fades in slightly before the explosion starts
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1], [0.5, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.2], [20, 0]);

  return (
    // The outer container sets the scroll duration. 250vh = 1.5 extra screens of scrolling.
    <section ref={containerRef} style={{ height: '250vh', background: '#F0F0F0', color: '#333' }}>
      
      {/* The sticky container pins strictly to the viewport while we scroll down through the 250vh */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '2rem' }}>
        
        {/* Title */}
        <motion.div 
          style={{ opacity: titleOpacity, y: titleY, textAlign: 'center', marginBottom: '4rem', zIndex: 10 }}
        >
          <h3 style={{ 
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', 
            fontWeight: '300', 
            lineHeight: '1.4', 
            letterSpacing: '0.05em',
            maxWidth: '1000px',
            margin: '0 auto',
            color: '#111'
          }}>
            OUR PLATFORM REPLACES COMPLEX SENSOR NETWORKS WITH AN <strong style={{fontWeight: 800}}>OVER-MOULDED MATERIAL STACK</strong> TO ACHIEVE TRUE SIMPLICITY, BEAUTY AND ELEGANCE.
          </h3>
        </motion.div>

        {/* 2-Column Layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '4rem', 
          alignItems: 'center',
          position: 'relative',
          width: '100%',
          maxWidth: '1200px'
        }}>
          
          {/* Left: 3D Explosion Graphic pinned to scroll */}
          <div 
            style={{ position: 'relative', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {layers.reverse().map((layer, index) => (
              <motion.img 
                key={index}
                src={`${import.meta.env.BASE_URL}assets/${layer.src}`} 
                alt={`Stack Layer ${index}`}
                style={{ 
                  position: 'absolute', 
                  width: '100%', 
                  maxWidth: '500px',
                  objectFit: 'contain',
                  zIndex: layer.zIndex,
                  y: layer.y // Framer Motion uses exactly what useTransform computes dynamically based on scroll
                }} 
              />
            ))}
          </div>

          {/* Right: Sequential Text Callouts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {callouts.map((item, idx) => (
              <motion.div 
                key={idx} 
                style={{ 
                  opacity: item.opacity,
                  x: item.x,
                  background: '#FFFFFF', 
                  padding: '1.2rem 1.5rem', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  position: 'relative',
                  borderLeft: '4px solid var(--accent-blue)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {/* Visual marker pointing to the left */}
                <div style={{ position: 'absolute', left: '-24px', width: '20px', height: '2px', background: 'rgba(0,0,0,0.1)' }} />
                <div style={{ position: 'absolute', left: '-28px', width: '6px', height: '6px', borderRadius: '50%', background: '#ccc' }} />

                <p 
                  style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6', color: '#555' }}
                  dangerouslySetInnerHTML={{ __html: item.text }} 
                />
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

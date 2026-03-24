import React from 'react';
import { motion } from 'framer-motion';

export default function TechExplosion() {
  const layerVariants = {
    hidden: { y: 0, opacity: 0.5 },
    visible: (i) => ({
      y: i * -60, // each layer shifts up by a factor of 60px
      opacity: 1,
      transition: { 
        duration: 1.2, 
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
        delay: 0.2 + i * 0.1 
      }
    })
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.4 }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const layers = [
    { src: 'Tech_explosion_4 1.png', zIndex: 1, yFactor: 0 },   // Base layer (bottom)
    { src: 'Tech_explosion_3 1.png', zIndex: 2, yFactor: 1 },   // PCB
    { src: 'Tech_explosion_2 1.png', zIndex: 3, yFactor: 2 },   // Internal Structure
    { src: 'Tech_explosion_1 1.png', zIndex: 4, yFactor: 3 },   // Top surface
  ];

  const callouts = [
    {
      title: "surface material",
      text: "Retain the customer's chosen <b>surface material</b>, while adapting seamlessly to any 3D geometry or level of flexibility."
    },
    {
      title: "textures",
      text: "<b>Customized textures</b> are engineered to generate touch signals that are uniquely interpretable by TG0 algorithms."
    },
    {
      title: "internal structures",
      text: "Specially engineered <b>internal structures</b> detect and amplify deformation."
    },
    {
      title: "electrical connections",
      text: "Simple and robust <b>electrical connections</b> between the conductive material and the PCB."
    },
    {
      title: "layers",
      text: "Compatible with existing casings or protective <b>layers</b>."
    }
  ];

  return (
    <section style={{ padding: '8rem 2rem', background: '#EFEFEF', color: '#333', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Title Section aligned to the screenshots */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '6rem' }}
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
          position: 'relative'
        }}>
          
          {/* Left: 3D Explosion Graphic */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-200px" }} // Explodes every time we scroll into it
            style={{ position: 'relative', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {layers.reverse().map((layer, index) => (
              <motion.img 
                key={index}
                custom={layer.yFactor}
                variants={layerVariants}
                src={`${import.meta.env.BASE_URL}assets/${layer.src}`} 
                alt={`Stack Layer ${index}`}
                style={{ 
                  position: 'absolute', 
                  width: '100%', 
                  maxWidth: '450px',
                  objectFit: 'contain',
                  zIndex: layer.zIndex,
                  // Tweak transform origin just in case the images are tightly cropped
                  transformOrigin: 'center'
                }} 
              />
            ))}
          </motion.div>

          {/* Right: Callouts */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-200px" }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {callouts.map((item, idx) => (
              <motion.div 
                key={idx} 
                variants={textVariants}
                style={{ 
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
                <div style={{
                  position: 'absolute',
                  left: '-24px',
                  width: '20px',
                  height: '2px',
                  background: 'rgba(0,0,0,0.1)'
                }} />
                <div style={{
                  position: 'absolute',
                  left: '-28px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#ccc'
                }} />

                <p 
                  style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6', color: '#555' }}
                  dangerouslySetInnerHTML={{ __html: item.text }} 
                />
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

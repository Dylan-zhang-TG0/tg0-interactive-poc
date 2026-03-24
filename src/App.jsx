import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import TouchDial from './components/TouchDial';
import PressurePad from './components/PressurePad';
import ShearSlider from './components/ShearSlider';
import Marquee from './components/Marquee';
import InteractiveSliderMockup from './components/InteractiveSliderMockup';
import TechExplosion from './components/TechExplosion';

const PixelText = ({ text, style, lightMode = false }) => {
  return (
    <h2 className="pixel-text" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', ...style }}>
      {text.split(' ').map((word, wIdx) => (
        <span key={wIdx} style={{ display: 'flex' }}>
          {word.split('').map((char, cIdx) => (
            <motion.span
              key={cIdx}
              whileHover={{
                color: 'var(--accent-purple)',
                textShadow: lightMode ? 'none' : '0 0 10px var(--accent-purple), 0 0 20px var(--accent-purple)',
                scale: 1.1,
                transition: { duration: 0.1 }
              }}
              style={{ cursor: 'pointer', display: 'inline-block' }}
            >
              {char}
            </motion.span>
          ))}
          {wIdx !== text.split(' ').length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </h2>
  );
};

export default function App() {
  const { scrollYProgress } = useScroll();
  
  // Parallax effect for the hero hand background
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <div className="dashboard-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar with Logo */}
      <nav style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%',
        padding: '2rem 3rem',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'flex-start'
      }}>
        <img src={`${import.meta.env.BASE_URL}assets/TG0_logo_white_large-01-01 2.svg`} alt="TG0 Logo" style={{ height: '30px', opacity: 0.9 }} />
      </nav>

      {/* 1. Hero Section (Dark) */}
      <section className="section-dark" style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '6rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <motion.div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '120%',
          backgroundImage: `url("${import.meta.env.BASE_URL}assets/Screenshot 2022-04-29 16.21.39 1.png")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.8) contrast(1.1)',
          opacity: 0.9,
          y: yBg
        }} />
        {/* Soft dark vignette overlay just for text readability, drastically weakened */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1000px', textAlign: 'center', zIndex: 1, marginTop: '4rem' }}>
          <PixelText text="WE DEFINE NEW" style={{ marginBottom: '1rem' }} />
          <PixelText text="CATEGORIES OF" style={{ marginBottom: '1rem' }} />
          <PixelText text="SENSING" style={{ marginBottom: '3rem' }} />
          <h3 style={{ fontWeight: '400', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
            BUILT FROM EVERYDAY MATERIALS AND AI
          </h3>
          {/* Down Arrow */}
           <motion.div 
             animate={{ y: [0, 10, 0] }} 
             transition={{ repeat: Infinity, duration: 2 }}
             style={{ marginTop: '5rem', opacity: 0.5 }}
           >
             ↓
           </motion.div>
        </div>
      </section>

      {/* 2. Client Logos Marquee (Light #E4E4E4) */}
      <section className="section-light" style={{ background: '#E4E4E4' }}>
        <Marquee speed={30} />
      </section>

      {/* 3. Performance Stats Area (Light) */}
      <section className="section-light" style={{ padding: '8rem 2rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem', justifyContent: 'space-around' }}>
           <div style={{ flex: '1 1 400px', textAlign: 'center' }}>
             <h2 className="heading-xl" style={{ fontSize: '4rem', marginBottom: '1rem', color: '#000' }}>33%</h2>
             <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '0.1em' }}>CARBON REDUCTION</h4>
             <p className="text-secondary" style={{ lineHeight: '1.6' }}>Proven 33% reduction in carbon footprint compared to traditional sensor assemblies.</p>
           </div>
           <div style={{ flex: '1 1 400px', textAlign: 'center' }}>
             <h2 className="heading-xl" style={{ fontSize: '4rem', marginBottom: '1rem', color: '#000' }}>80%</h2>
             <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '0.1em' }}>COMPONENT REDUCTION</h4>
             <p className="text-secondary" style={{ lineHeight: '1.6' }}>80% fewer components in standard assemblies (e.g., eliminating 6+ mechanical switches).</p>
           </div>
        </div>
      </section>

      {/* 4. Core Technology Dial (Dark Mode) */}
      <section className="section-dark" style={{ 
        padding: '8rem 2rem', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'linear-gradient(180deg, var(--bg-dark) 0%, #161616 100%)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
           <h4 className="pixel-text" style={{ fontSize: '1rem', color: 'var(--accent-blue)', marginBottom: '1rem' }}>
             CORE TECHNOLOGY INTERACTIONS + UI + DATA VISUALISATION
           </h4>
        </div>
        <TouchDial size="large" />
      </section>

      {/* 5. Interaction Modes Grid (Light Mode) */}
      <section className="section-light" style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '4rem',
        padding: '8rem 2rem',
        maxWidth: '1440px',
        margin: '0 auto',
        width: '100%'
      }}>
        
        {/* Feature 1 */}
        <div className="glass-panel" style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 className="pixel-text" style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#000' }}>TOUCH</h3>
            <h3 className="pixel-text" style={{ fontSize: '1.8rem', color: '#000' }}>SENSING</h3>
          </div>
          <p className="text-secondary" style={{ textAlign: 'center', fontSize: '1rem', lineHeight: '1.6', minHeight: '100px' }}>
            Detect precise contact location and gestures across complex 3D surfaces, enabling intuitive control without mechanical buttons.
          </p>
          <TouchDial size="small" />
        </div>

        {/* Feature 2 */}
        <div className="glass-panel" style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 className="pixel-text" style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#000' }}>PRESSURE</h3>
            <h3 className="pixel-text" style={{ fontSize: '1.8rem', color: '#000' }}>MAPPING</h3>
          </div>
          <p className="text-secondary" style={{ textAlign: 'center', fontSize: '1rem', lineHeight: '1.6', minHeight: '100px' }}>
            Measure distributed force across a surface in real time, delivering actionable data for monitoring and performance.
          </p>
          <div style={{ filter: 'invert(1) hue-rotate(180deg)', opacity: 0.9 }}>
             <PressurePad />
          </div>
        </div>

        {/* Feature 3 */}
        <div className="glass-panel" style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 className="pixel-text" style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#000' }}>SHEAR-</h3>
            <h3 className="pixel-text" style={{ fontSize: '1.8rem', color: '#000' }}>FORCE</h3>
          </div>
          <p className="text-secondary" style={{ textAlign: 'center', fontSize: '1rem', lineHeight: '1.6', minHeight: '100px' }}>
            Capture lateral movement and directional force, enabling the world's thinnest sensors for dynamic environments.
          </p>
          <div style={{ filter: 'invert(1) hue-rotate(180deg)' }}>
            <ShearSlider />
          </div>
        </div>
      </section>

      {/* 6. What is TG0 Section (Explosion View) */}
      <TechExplosion />

      {/* 7. Interactive Slider Section (Light) */}
      <section className="section-light" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
         <h4 className="pixel-text" style={{ color: 'var(--accent-blue)', marginBottom: '2rem' }}>INTERACTIVE SLIDER</h4>
         <InteractiveSliderMockup />
      </section>

      {/* 8. Contact Form Footer (Dark) */}
      <section className="section-dark" style={{ padding: '10rem 2rem 6rem', textAlign: 'center' }}>
         <h2 className="heading-xl" style={{ fontSize: '3vw', marginBottom: '4rem' }}>READY TO STREAMLINE YOUR HARDWARE?</h2>
         <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px', margin: '0 auto' }}>
            <input type="text" placeholder="Name" style={{ padding: '1.5rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#FFF', fontSize: '1rem' }} />
            <input type="email" placeholder="E-mail" style={{ padding: '1.5rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#FFF', fontSize: '1rem' }} />
            <button type="submit" style={{ padding: '1.5rem', borderRadius: '30px', background: '#FFF', color: '#000', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' }}>
              GET IN TOUCH
            </button>
         </form>
      </section>

    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

import TouchDial from './components/TouchDial';
import PressurePad from './components/PressurePad';
import ShearSlider from './components/ShearSlider';
import Marquee from './components/Marquee';
import InteractiveSliderMockup from './components/InteractiveSliderMockup';
import TechExplosion from './components/TechExplosion';
import HeroWaveBackground from './components/HeroWaveBackground';
import Preloader from './components/Preloader';

const FluidHeadline = ({ text, style, startAnim }) => {
  return (
    <motion.h1 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: startAnim ? 1 : 0, y: startAnim ? 0 : 50 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ 
        fontSize: 'clamp(3rem, 9vw, 8rem)', 
        fontWeight: '500', 
        lineHeight: '0.85', 
        letterSpacing: '-0.02em',
        textTransform: 'uppercase',
        margin: 0,
        ...style 
      }}
    >
      {text}
    </motion.h1>
  );
};

export default function App() {
  const { scrollYProgress } = useScroll();
  const [loading, setLoading] = useState(true);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);
  
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0); // start at top
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [loading]);
  
  // Parallax effect for the hero hand background
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <div className="dashboard-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AnimatePresence>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      
      {/* Navbar with Logo */}
      <nav style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%',
        padding: '2rem 4vw',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'flex-start'
      }}>
        {/* We invert the white logo to make it black/blue for the light background */}
        <img src={`${import.meta.env.BASE_URL}assets/TG0_logo_white_large-01-01 2.svg`} alt="TG0 Logo" style={{ height: '30px', filter: 'invert(1)' }} />
      </nav>

      {/* 1. Hero Section (Blueprint Style) */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start', 
        justifyContent: 'flex-end', 
        padding: '2rem 4vw',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Background Image with Blueprint filter */}
        <motion.div style={{
          position: 'absolute',
          top: '10%', right: '0%', width: '60%', height: '80%',
          backgroundImage: `url("${import.meta.env.BASE_URL}assets/Screenshot 2022-04-29 16.21.39 1.png")`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
          filter: 'grayscale(100%) contrast(1.2) opacity(0.3)',
          mixBlendMode: 'multiply',
          y: yBg,
          zIndex: 0
        }} />

        {/* 3D Interactive Particle Wave */}
        <HeroWaveBackground />

        <div style={{ zIndex: 1, position: 'relative', width: '100%', borderTop: '1px solid var(--accent-blue)', paddingTop: '2rem', marginBottom: '2vh' }}>
          {/* Blueprint Annotation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: loading ? 0 : 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            style={{ 
              position: 'absolute', top: 0, right: 0, 
              background: 'var(--accent-blue)', color: '#fff', 
              fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', 
              padding: '0.3rem 0.6rem', letterSpacing: '0.1em' 
            }}
          >
            [ 01 — INTRO ]
          </motion.div>
          
          <FluidHeadline text="WE DEFINE NEW" startAnim={!loading} />
          <FluidHeadline text="CATEGORIES OF" startAnim={!loading} />
          <FluidHeadline text="SENSING." style={{ color: 'var(--accent-blue)' }} startAnim={!loading} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '3rem' }}>
            <h3 style={{ fontFamily: 'var(--font-pixel)', fontWeight: '500', letterSpacing: '0.05em', color: '#111', maxWidth: '400px', fontSize: '0.85rem', lineHeight: '1.6', textTransform: 'uppercase' }}>
              BUILT FROM EVERYDAY MATERIALS AND AI. <br/>
              REPLACING COMPLEX SENSOR NETWORKS WITH OVER-MOULDED MATERIAL STACKS.
            </h3>
            
            {/* Scroll Indicator */}
            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.8rem', color: 'var(--accent-blue)', letterSpacing: '0.1em' }}
            >
              SCROLL //
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Client Logos Marquee (Light #E4E4E4) */}
      <section className="section-light" style={{ background: '#E4E4E4' }}>
        <Marquee speed={30} />
      </section>

      {/* 2. Performance Stats Area (Blueprint) */}
      <section style={{ padding: '8rem 2vw', borderBottom: '1px solid var(--accent-blue)', position: 'relative' }}>
         <div style={{ position: 'absolute', top: 0, left: '4vw', width: '1px', height: '100%', background: 'var(--accent-blue)', opacity: 0.2 }} />
         <div style={{ position: 'absolute', top: 0, right: '4vw', width: '1px', height: '100%', background: 'var(--accent-blue)', opacity: 0.2 }} />

        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem', justifyContent: 'space-around' }}>
           <motion.div 
             initial={{ opacity: 0, y: 50, rotate: 0 }}
             whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
             viewport={{ once: true, margin: '-100px' }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             style={{ flex: '1 1 400px', textAlign: 'center', padding: '5rem 3rem', border: '1px solid var(--accent-blue)', background: '#fff', boxShadow: '12px 12px 0 rgba(27,78,220,0.1)' }}
           >
             <h2 className="heading-xl" style={{ fontSize: 'clamp(4rem, 8vw, 7rem)', marginBottom: '1rem', color: 'var(--accent-blue)', fontWeight: 500, letterSpacing: '-0.04em' }}>33%</h2>
             <h4 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.9rem', fontWeight: '500', marginBottom: '2rem', letterSpacing: '0.15em' }}>( CARBON REDUCTION )</h4>
             <p className="text-secondary" style={{ lineHeight: '1.6', fontSize: '1.1rem', color: '#444' }}>Proven 33% reduction in carbon footprint compared to traditional sensor assemblies.</p>
           </motion.div>
           
           <motion.div 
             initial={{ opacity: 0, y: 50, rotate: 0 }}
             whileInView={{ opacity: 1, y: 0, rotate: 1.5 }}
             viewport={{ once: true, margin: '-100px' }}
             transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
             style={{ flex: '1 1 400px', textAlign: 'center', padding: '5rem 3rem', border: '1px solid var(--accent-blue)', background: '#fff', boxShadow: '-12px 12px 0 rgba(27,78,220,0.1)' }}
           >
             <h2 className="heading-xl" style={{ fontSize: 'clamp(4rem, 8vw, 7rem)', marginBottom: '1rem', color: 'var(--accent-blue)', fontWeight: 500, letterSpacing: '-0.04em' }}>80%</h2>
             <h4 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.9rem', fontWeight: '500', marginBottom: '2rem', letterSpacing: '0.15em' }}>( COMPONENT REDUCTION )</h4>
             <p className="text-secondary" style={{ lineHeight: '1.6', fontSize: '1.1rem', color: '#444' }}>80% fewer components in standard assemblies (e.g., eliminating 6+ mechanical switches).</p>
           </motion.div>
        </div>
      </section>

      {/* 3. Core Technology Dial (Blueprint) */}
      <section style={{ 
        padding: '8rem 2vw', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        borderBottom: '1px solid var(--accent-blue)',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-blue)', color: '#fff', fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', padding: '0.3rem 0.6rem', letterSpacing: '0.1em' }}>
            [ 02 — INTERACTIONS ]
        </div>

        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
           <h4 style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.9rem', color: 'var(--accent-blue)', marginBottom: '1rem', letterSpacing: '0.2em' }}>
             // CORE TECHNOLOGY INTERACTIONS + UI + DATA VISUALISATION
           </h4>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <TouchDial size="large" />
        </div>
      </section>

      {/* 4. Interaction Modes Grid (Blueprint Mode) */}
      <section style={{ padding: '8rem 2vw', width: '100%', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: '4vw', width: '1px', height: '100%', background: 'var(--accent-blue)', opacity: 0.2 }} />
        <div style={{ position: 'absolute', top: 0, right: '4vw', width: '1px', height: '100%', background: 'var(--accent-blue)', opacity: 0.2 }} />

        <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-blue)', color: '#fff', fontFamily: 'var(--font-pixel)', fontSize: '0.75rem', padding: '0.3rem 0.6rem', letterSpacing: '0.1em' }}>
            [ 03 — CAPABILITIES ]
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '4rem',
          maxWidth: '1440px',
          margin: '0 auto',
          width: '100%'
        }}>
        
        {/* Feature 1 */}
        <motion.div 
          whileHover={{ y: -10 }}
          style={{ background: '#fff', border: '1px solid var(--accent-blue)', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem', boxShadow: '12px 12px 0 rgba(27,78,220,0.1)' }}
        >
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.2rem', color: 'var(--accent-blue)', letterSpacing: '0.15em', fontWeight: 600 }}>[ TOUCH SENSING ]</h3>
          </div>
          <p className="text-secondary" style={{ textAlign: 'center', fontSize: '1.05rem', lineHeight: '1.6', minHeight: '80px', color: '#444' }}>
            Detect precise contact location and gestures across complex 3D surfaces, enabling intuitive control without mechanical buttons.
          </p>
          <TouchDial size="small" />
        </motion.div>

        {/* Feature 2 */}
        <motion.div 
          whileHover={{ y: -10 }}
          style={{ background: '#fff', border: '1px solid var(--accent-blue)', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem', boxShadow: '12px 12px 0 rgba(27,78,220,0.1)' }}
        >
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.2rem', color: 'var(--accent-blue)', letterSpacing: '0.15em', fontWeight: 600 }}>[ PRESSURE MAPPING ]</h3>
          </div>
          <p className="text-secondary" style={{ textAlign: 'center', fontSize: '1.05rem', lineHeight: '1.6', minHeight: '80px', color: '#444' }}>
            Measure distributed force across a surface in real time, delivering actionable data for monitoring and performance.
          </p>
          <div style={{ filter: 'invert(1) hue-rotate(180deg)' }}>
             <PressurePad />
          </div>
        </motion.div>

        {/* Feature 3 */}
        <motion.div 
          whileHover={{ y: -10 }}
          style={{ background: '#fff', border: '1px solid var(--accent-blue)', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem', boxShadow: '12px 12px 0 rgba(27,78,220,0.1)' }}
        >
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1.2rem', color: 'var(--accent-blue)', letterSpacing: '0.15em', fontWeight: 600 }}>[ SHEAR-FORCE ]</h3>
          </div>
          <p className="text-secondary" style={{ textAlign: 'center', fontSize: '1.05rem', lineHeight: '1.6', minHeight: '80px', color: '#444' }}>
            Capture lateral movement and directional force, enabling the world's thinnest sensors for dynamic environments.
          </p>
          <div style={{ filter: 'invert(1) hue-rotate(180deg)' }}>
            <ShearSlider />
          </div>
        </motion.div>
        </div>
      </section>

      {/* 6. What is TG0 Section (Explosion View) */}
      <TechExplosion />

      {/* 7. Interactive Slider Section (Blueprint) */}
      <section style={{ padding: '8rem 2vw', textAlign: 'center', borderTop: '1px solid var(--accent-blue)', position: 'relative' }}>
         <h4 style={{ fontFamily: 'var(--font-pixel)', fontSize: '1rem', color: 'var(--accent-blue)', marginBottom: '3rem', letterSpacing: '0.2em' }}>
           // 04 — INTERACTIVE MOCKUP
         </h4>
         <InteractiveSliderMockup />
      </section>

      {/* 8. Contact Form Footer (Blueprint) */}
      <section style={{ padding: '10rem 2vw 6rem', borderTop: '1px solid var(--accent-blue)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
         <h2 className="heading-xl" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', marginBottom: '4rem', color: 'var(--accent-blue)', letterSpacing: '-0.02em', textAlign: 'center', fontWeight: '500' }}>
           STREAMLINE YOUR<br/>HARDWARE.
         </h2>
         <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <input type="text" placeholder="NAME" style={{ padding: '1.5rem', borderRadius: '0', border: '1px solid var(--accent-blue)', background: '#fff', color: '#111', fontSize: '1rem', fontFamily: 'var(--font-pixel)', letterSpacing: '0.1em' }} />
            <input type="email" placeholder="E-MAIL" style={{ padding: '1.5rem', borderRadius: '0', border: '1px solid var(--accent-blue)', background: '#fff', color: '#111', fontSize: '1rem', fontFamily: 'var(--font-pixel)', letterSpacing: '0.1em' }} />
            <motion.button 
              whileHover={{ backgroundColor: '#111', color: '#fff' }}
              transition={{ duration: 0.2 }}
              type="submit" 
              style={{ padding: '1.5rem', borderRadius: '0', background: 'var(--accent-blue)', color: '#FFF', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem', fontFamily: 'var(--font-pixel)', letterSpacing: '0.2em', border: 'none' }}
            >
              GET IN TOUCH →
            </motion.button>
         </form>
      </section>

    </div>
  );
}

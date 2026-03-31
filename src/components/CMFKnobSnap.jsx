import React, { useEffect, useRef, useState } from 'react';

const BASE = import.meta.env.BASE_URL;

export default function CMFKnobSnap() {
  const containerRef = useRef(null);
  const dialRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [lastRotation, setLastRotation] = useState(0);
  const [position, setPosition] = useState(1);
  const startAngleRef = useRef(0);


  const getAngle = (x, y) => {
    if (!dialRef.current) return 0;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rad = Math.atan2(y - centerY, x - centerX);
    return rad * (180 / Math.PI);
  };

  const handleStartInteraction = (e) => {
    setIsDragging(true);
    const coords = e.touches ? e.touches[0] : e;
    startAngleRef.current = getAngle(coords.clientX, coords.clientY) - lastRotation;
    if (dialRef.current) {
      dialRef.current.style.transition = 'none';
    }
  };

  const handleMove = (e) => {
    const coords = e.touches ? e.touches[0] : e;

    if (!isDragging) return;

    const angle = getAngle(coords.clientX, coords.clientY);
    const newRotation = angle - startAngleRef.current;
    setCurrentRotation(newRotation);
    if (dialRef.current) {
      dialRef.current.style.transform = `rotateX(30deg) rotateZ(${newRotation}deg)`;
    }
  };

  const handleStopInteraction = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dialRef.current) {
      dialRef.current.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }

    // Snapping Logic (3 positions: 0, 120, 240)
    let normalized = currentRotation % 360;
    if (normalized < 0) normalized += 360;

    const snapPoints = [0, 120, 240, 360];
    const closest = snapPoints.reduce((prev, curr) =>
      Math.abs(curr - normalized) < Math.abs(prev - normalized) ? curr : prev
    );

    const finalSnap = closest === 360 ? 0 : closest;
    setLastRotation(finalSnap);
    setCurrentRotation(finalSnap);
    const pos = finalSnap === 0 ? 1 : finalSnap === 120 ? 2 : 3;
    setPosition(pos);

    if (dialRef.current) {
      dialRef.current.style.transform = `rotateX(30deg) rotateZ(${finalSnap}deg)`;
    }
  };



  useEffect(() => {
    window.addEventListener('mousedown', handleStartInteraction);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleStopInteraction);
    window.addEventListener('touchstart', handleStartInteraction);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleStopInteraction);

    return () => {
      window.removeEventListener('mousedown', handleStartInteraction);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleStopInteraction);
      window.removeEventListener('touchstart', handleStartInteraction);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleStopInteraction);
    };
  }, [isDragging, lastRotation, currentRotation]);

  return (
    <section
      className="section-dark"
      style={{
        padding: '8rem 2rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'radial-gradient(circle at 50% 25%, #1e1e1e 0%, #0f0f0f 65%, #070707 100%)',
  
      }}
    >
      <div
        style={{
          maxWidth: '980px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <h4
            className="pixel-text"
            style={{
              fontSize: '0.9rem',
              letterSpacing: '0.18em',
              color: 'var(--accent-blue)',
              marginBottom: '1rem',
            }}
          >
            CMF DIAL 3D SNAP
          </h4>
          <h2 className="heading-xl" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)', marginBottom: '0.8rem' }}>
            3 POSITION DIAL
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: '42ch' }}>
            Drag to rotate and snap to one of 3 distinct positions. Features 3D tilt and smooth snapping.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="pixel-text" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.75rem' }}>
              POSITION
            </span>
            <span className="heading-xl" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#ffffff' }}>
              {position}
            </span>
          </div>
        </div>

        <div
          ref={containerRef}
          style={{
            width: 'min(70vw, 430px)',
            height: 'min(70vw, 430px)',
            position: 'relative',
            cursor: 'pointer',
            perspective: '1200px',
          }}
        >
          <div
            ref={dialRef}
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              borderRadius: '50%',
              transformStyle: 'preserve-3d',
              transition: 'none',
              boxShadow: '0 20px 55px rgba(0,0,0,0.55)',
              transform: 'rotateX(30deg) rotateZ(0deg)',
            }}
          >
            {/* Indicator lines around circumference */}
            {[...Array(36)].map((_, i) => {
              const isTopIndicator = i === 0;
              const lineHeight = isTopIndicator ? 55 : 27.5;
              const angle = (i * 360) / 36;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: '3px',
                    height: `${lineHeight}px`,
                    background: 'white',
                    top: '-5px',
                    left: '50%',
                    transform: `translateX(-50%) rotate(${angle}deg)`,
                    transformOrigin: '50% 220px',
                    borderRadius: '2px',
                    filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.8))',
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => {
            setLastRotation(0);
            setCurrentRotation(0);
            setPosition(1);
            if (dialRef.current) {
              dialRef.current.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
              dialRef.current.style.transform = 'rotateX(30deg) rotateZ(0deg)';
            }
          }}
          style={{
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.03)',
            color: 'white',
            borderRadius: '999px',
            padding: '0.6rem 1.2rem',
            fontSize: '0.78rem',
            letterSpacing: '0.15em',
            cursor: 'pointer',
          }}
          className="pixel-text"
        >
          RESET DIAL
        </button>
      </div>
    </section>
  );
}

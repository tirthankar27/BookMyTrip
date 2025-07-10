import React, { useEffect, useRef } from 'react';
import GLOBE from 'vanta/dist/vanta.globe.min';
import * as THREE from 'three';

const VantaBackground = ({ children, darkMode }) => {
  const vantaRef = useRef(null);

  useEffect(() => {
    const effect = GLOBE({
      el: vantaRef.current,
      THREE: THREE,
      color: darkMode ? 0x3a7bd5 : 0x1a73e8, // Blue tones
      backgroundColor: darkMode ? 0x0a0f2a : 0xf0f8ff, // Dark navy / Light blue
      size: 0.8, // Smaller globe
      scale: 1.2, // Zoom level
      scaleMobile: 1.0, // Mobile adjustment
    });

    return () => effect?.destroy();
  }, [darkMode]);

  return (
    <>
      {/* Fixed globe background */}
      <div 
        ref={vantaRef} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1
        }}
      />
      
      {/* Scrollable content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </>
  );
};

export default VantaBackground;
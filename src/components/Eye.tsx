'use client'
import React, { useRef, useEffect, useState } from 'react';

const EyeTrackingSVG = () => {
  const svgRef = useRef(null);
  const eyeRefs = useRef([]);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const svg = svgRef.current;
    const eyes = eyeRefs.current;
    const eyePositions = eyes.map(eye => ({
      cx: parseFloat(eye.getAttribute('cx')),
      cy: parseFloat(eye.getAttribute('cy'))
    }));

    let animationFrameId;
    let velocityX = 0;
    let velocityY = 0;

    const updateEyePosition = (clientX, clientY) => {
      if (svg) {
        const rect = svg.getBoundingClientRect();
        const centerX = clientX - rect.left - rect.width / 2;
        const centerY = clientY - rect.top - rect.height / 2;

        eyes.forEach((eye, index) => {
          const { cx, cy } = eyePositions[index];
          const targetX = Math.min((centerX - cx) * 0.1, 60);
          const targetY = Math.min((centerY - cy) * 0.1, 60);

          const animate = () => {
            const currentX = parseFloat(eye.getAttribute('cx') || '0');
            const currentY = parseFloat(eye.getAttribute('cy') || '0');

            velocityX = 0.05 * velocityX + (targetX - (currentX - cx)) * 0.1;
            velocityY = 0.05 * velocityY + (targetY - (currentY - cy)) * 0.1;

            eye.setAttribute('cx', (currentX + velocityX).toString());
            eye.setAttribute('cy', (currentY + velocityY).toString());

            if (Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1) {
              animationFrameId = requestAnimationFrame(animate);
            }
          };

          animate();
        });
      }
    };

    const handleMouseMove = (e) => updateEyePosition(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        updateEyePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Set up blinking interval
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200); // Blink for 200ms
    }, 5000); // Blink every 3 seconds

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
      clearInterval(blinkInterval);
    };
  }, []);

  return (
    
        <svg
          ref={svgRef}
          fill="currentColor"
          viewBox="0 0 256 256"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12"
        >
          <circle cx="128" cy="128" r="128" fill="#222"></circle>
          <ellipse
            ref={(el) => (eyeRefs.current[0] = el)}
            cx="114.71047581148345"
            cy="119.6986500860767"
            rx="18"
            ry={isBlinking ? "0" : "18"}
            fill="white"
            className=" transition-[ry]  duration-200"
          ></ellipse>
          <ellipse
            ref={(el) => (eyeRefs.current[1] = el)}
            cx="161.5104773061616"
            cy="119.6986500860767"
            rx="18"
            ry={isBlinking ? "0" : "18"}
            fill="white"
            className=" transition-[ry] duration-200"
          ></ellipse>
        </svg>
  
  );
};

export default EyeTrackingSVG;
'use client';

import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

export function LocomotiveScrollProvider({ children }) {
  const scrollRef = useRef(null);
  const locomotiveScrollInstance = useRef(null);

  useEffect(() => {
    // Delay initialization to ensure DOM is ready
    const initScroll = () => {
      if (!scrollRef.current) return;

      try {
        locomotiveScrollInstance.current = new LocomotiveScroll({
          el: scrollRef.current,
          smooth: true,
          smartphone: {
            smooth: false,
          },
          tablet: {
            smooth: true,
          },
        });
      } catch (error) {
        console.error('Locomotive Scroll init error:', error);
      }
    };

    // Wait for next frame to ensure DOM is ready
    const timeoutId = setTimeout(initScroll, 100);

    // Handle resize
    const handleResize = () => {
      if (locomotiveScrollInstance.current) {
        locomotiveScrollInstance.current.update();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      if (locomotiveScrollInstance.current) {
        locomotiveScrollInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      data-scroll-container
      className="w-full"
    >
      {children}
    </div>
  );
}

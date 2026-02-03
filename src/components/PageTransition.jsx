import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

const PageTransition = ({ children }) => {
    const transitionRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const clickPosition = location.state?.clickPosition;

        // Reset any previous animations/styles
        gsap.set(transitionRef.current, { clearProps: "all" });

        if (clickPosition) {
            // Circular Reveal Animation
            const { x, y } = clickPosition;

            // Set initial state: Circle of minimally visible size to avoid rendering glitches
            gsap.set(transitionRef.current, {
                clipPath: `circle(0px at ${x}px ${y}px)`,
                autoAlpha: 1
            });

            // Animate to full screen
            gsap.to(transitionRef.current, {
                duration: 1.5,
                clipPath: `circle(150% at ${x}px ${y}px)`,
                ease: "expo.out",
                onComplete: () => {
                    // Clear clip-path after animation to prevent issues with fixed elements or interactions
                    gsap.set(transitionRef.current, { clipPath: "none" });
                }
            });
        } else {
            // Standard Fade/Slide Animation (Fallback)
            // Set initial state
            gsap.set(transitionRef.current, { autoAlpha: 0, y: 50, scale: 0.95 });

            // Animate in
            gsap.to(transitionRef.current, {
                duration: 0.8,
                autoAlpha: 1,
                y: 0,
                scale: 1,
                ease: "power3.out",
                delay: 0.1
            });
        }

        return () => {
            // Cleanup if needed
            gsap.killTweensOf(transitionRef.current);
        };
    }, [location.pathname, location.state]); // Re-run when path or state changes

    return (
        <div ref={transitionRef} className="w-full min-h-screen">
            {children}
        </div>
    );
};

export default PageTransition;

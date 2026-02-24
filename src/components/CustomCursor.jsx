import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);

    useEffect(() => {
        // Check if device is mobile/touch
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            (window.matchMedia("(pointer: coarse)").matches);

        if (isMobile) return;

        const moveCursor = (e) => {
            const { clientX, clientY } = e;

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
            }

            if (followerRef.current) {
                followerRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
            }
        };

        window.addEventListener('mousemove', moveCursor);

        // Hide default cursor
        document.body.style.cursor = 'none';

        // Add styles to hide cursor on all elements
        const style = document.createElement('style');
        style.innerHTML = `
            * {
                cursor: none !important;
            }
        `;
        style.id = 'custom-cursor-style';
        document.head.appendChild(style);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.body.style.cursor = 'auto';
            const existingStyle = document.getElementById('custom-cursor-style');
            if (existingStyle) {
                existingStyle.remove();
            }
        };
    }, []);

    // Check if mobile for conditional rendering
    const isMobile = typeof navigator !== 'undefined' &&
        (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches));

    if (isMobile) return null;

    return (
        <>
            {/* Center Dot */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-2 h-2 bg-zinc-800 dark:bg-white rounded-full pointer-events-none z-[9999] -ml-1 -mt-1"
            />

            {/* Dashed Circle Follower */}
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-8 h-8 border-[1.5px] border-dashed border-zinc-500 dark:border-zinc-400 rounded-full pointer-events-none z-[9998] -ml-4 -mt-4 transition-transform duration-75 ease-out"
            />
        </>
    );
};

export default CustomCursor;

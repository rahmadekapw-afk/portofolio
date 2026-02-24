import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Github, Globe, User } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const TypewriterEffect = ({ text }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className="inline-block">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Image Removed due to missing asset
// import RobotImage from '../assets/robot_character.png';

// Import video asset
import RobotRunVideo from '../assets/robot_run.mp4';

// ChromaKeyVideo Component (Local definition to ensure isolation)
const ChromaKeyVideo = ({ src }) => {
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let animationFrameId;

    const render = () => {
      if (video.readyState >= 2) {
        const rect = canvas.getBoundingClientRect();
        const displayWidth = rect.width || video.videoWidth;
        const displayHeight = rect.height || video.videoHeight;

        // Cap DPR multiplier to avoid memory issues on high-end mobile devices
        const dpr = window.devicePixelRatio || 1;
        const dprMultiplier = Math.min(dpr, 2.0);

        const targetWidth = Math.floor(displayWidth * dprMultiplier);
        const targetHeight = Math.floor(displayHeight * dprMultiplier);

        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
          canvas.width = targetWidth;
          canvas.height = targetHeight;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
          const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = frame.data;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            const maxRB = Math.max(r, b);
            const difference = g - maxRB;

            if (g > maxRB && difference > 18) {
              const alpha = Math.max(0, 1 - (difference - 18) / 15);
              data[i + 3] = Math.floor(alpha * 255);
              if (alpha < 0.9) data[i + 1] = Math.floor(g * 0.6);
            }
          }
          ctx.putImageData(frame, 0, 0);
        } catch (e) {
          console.error("Canvas error:", e);
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const startPlay = async () => {
      try {
        if (video.paused) {
          await video.play();
        }
      } catch (err) {
        console.error("Video play failed:", err);
        setTimeout(startPlay, 1000);
      }
    };

    if (video.readyState >= 3) {
      startPlay();
    } else {
      video.addEventListener('canplay', startPlay);
      video.addEventListener('canplaythrough', startPlay);
      video.addEventListener('loadeddata', startPlay);
    }

    return () => {
      video.removeEventListener('canplay', startPlay);
      video.removeEventListener('canplaythrough', startPlay);
      video.removeEventListener('loadeddata', startPlay);
      cancelAnimationFrame(animationFrameId);
    };
  }, [src]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <video
        ref={videoRef}
        src={src}
        muted={true}
        playsInline={true}
        autoPlay={true}
        loop={true}
        crossOrigin="anonymous"
        preload="auto"
        className="fixed top-[-100%] left-[-100%] w-1 h-1 pointer-events-none opacity-0"
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain drop-shadow-2xl translate-z-0"
        style={{
          filter: 'contrast(1.1) brightness(1.05) saturate(1.1)',
          willChange: 'transform'
        }}
      />
    </div>
  );
};

const BackgroundEffect = () => (
  <div className="absolute inset-0 overflow-hidden bg-[#000000]">
    {/* Subtle animated background gradients for depth */}
    <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
    <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />

    {/* Modern Glass Overlay - Moved behind the robot */}
    <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] z-0" />

    {/* Floating Robot Character - Centered and Smooth */}
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
        {/* Video with Chroma Key Effect */}
        <div className="w-[100%] h-[100%] flex items-center justify-center animate-float"
          style={{
            animation: 'float 8s ease-in-out infinite',
          }}>
          <ChromaKeyVideo src={RobotRunVideo} />
        </div>
      </div>
    </div>

    <style jsx>{`
      @keyframes float {
        0% { transform: translate(0, 15px); }
        35% { transform: translate(0, -15px); }
        65% { transform: translate(0, 15px); }
        85% { transform: translate(15px, 5px); }
        100% { transform: translate(0, 15px); }
      }
      canvas {
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
        image-rendering: pixelated;
      }
    `}</style>
  </div>
);


const IconButton = ({ Icon }) => (
  <div className="relative group hover:scale-110 transition-transform duration-300">
    <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-75 transition duration-300" />
    <div className="relative p-2 sm:p-3 bg-black/50 backdrop-blur-sm rounded-full border border-white/10">
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
    </div>
  </div>
);

const WelcomeScreen = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
    });

    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => {
        onLoadingComplete?.();
      }, 1000);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  const containerVariants = {
    exit: {
      opacity: 0,
      scale: 1.1,
      filter: "blur(10px)",
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const childVariants = {
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-[#030014]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit="exit"
          variants={containerVariants}
        >
          <BackgroundEffect />

          {/* Main Content - Added z-20 to ensure it's above the video */}
          <div className="relative z-20 min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-4xl mx-auto">



              {/* Welcome Text */}
              <motion.div
                className="text-center mb-6 sm:mb-8 md:mb-12"
                variants={childVariants}
              >
                <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold space-y-1 sm:space-y-4">
                  <div className="mb-1 sm:mb-4 flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-4">
                    <span data-aos="fade-right" data-aos-delay="200" className="inline-block px-1 sm:px-2 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                      Welcome
                    </span>
                    <span data-aos="fade-right" data-aos-delay="400" className="inline-block px-1 sm:px-2 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                      To
                    </span>
                    <span data-aos="fade-right" data-aos-delay="600" className="inline-block px-1 sm:px-2 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                      My
                    </span>
                  </div>
                  <div className="flex flex-col sm:block">
                    <span data-aos="fade-up" data-aos-delay="800" className="inline-block px-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Portfolio
                    </span>
                    <span data-aos="fade-up" data-aos-delay="1000" className="inline-block px-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent sm:ml-2">
                      Website
                    </span>
                  </div>
                </h1>
              </motion.div>

              {/* Website Link */}
              <motion.div
                className="text-center mt-12 sm:mt-24 md:mt-32"
                variants={childVariants}
                data-aos="fade-up"
                data-aos-delay="1200"
              >
                <a
                  href="https://www.linkedin.com/in/putra-wardhani-1497383a9/"
                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full relative group hover:scale-105 transition-transform duration-300 mx-auto"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />
                  <div className="relative flex items-center gap-2 text-base sm:text-xl md:text-2xl">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-medium">
                      <TypewriterEffect text="www.rahmadeka.com" />
                    </span>
                  </div>
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeScreen;
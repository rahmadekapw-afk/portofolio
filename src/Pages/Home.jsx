import React, { useState, useEffect, useCallback, memo } from "react"
import { Github, Linkedin, Mail, ExternalLink, Instagram, Sparkles } from "lucide-react"
import AOS from 'aos'
import 'aos/dist/aos.css'

import { useLanguage } from "../context/LanguageContext";

// Memoized Components
const StatusBadge = memo(() => {
  const { t } = useLanguage();
  return (
    <div className="inline-block" data-aos="zoom-in" data-aos-delay="400">
      <div className="px-4 py-2 rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-widest text-black dark:text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          {t('hero.greeting')}
        </span>
      </div>
    </div>
  );
});



const TechStack = memo(({ tech }) => (
  <div className="px-4 py-2 rounded-none border-b-2 border-gray-200 dark:border-zinc-800 text-sm font-bold uppercase tracking-wider text-black dark:text-white hover:border-black dark:hover:border-white transition-colors">
    {tech}
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href}>
    <button className="group relative w-[160px] h-12 bg-black dark:bg-white overflow-hidden rounded-full transition-all hover:scale-105 active:scale-95">
      <div className="absolute inset-0 flex items-center justify-center gap-2 text-white dark:text-black font-oswald font-bold uppercase tracking-widest z-10">
        {text}
        <Icon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </button>
  </a>
));

const SocialLink = memo(({ icon: Icon, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <button className="group p-3 rounded-full border border-gray-200 dark:border-zinc-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300">
      <Icon className="w-5 h-5 transition-colors" />
    </button>
  </a>
));

// Constants
const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;
const WORDS = ["Network Engineer", "Tech Enthusiast"]; // Updated words for professional look
const TECH_STACK = ["React", "Javascript", "Node.js", "Tailwind"];
const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/EkiZR" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/ekizr/" },
  { icon: Instagram, link: "https://www.instagram.com/ekizr._/?hl=id" }
];

const Home = () => {
  const { t } = useLanguage();
  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Optimize AOS initialization
  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: true,
        offset: 10,
      });
    };

    initAOS();
    window.addEventListener('resize', initAOS);
    return () => window.removeEventListener('resize', initAOS);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  // Optimize typing effect
  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText(prev => prev + WORDS[wordIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else {
        setWordIndex(prev => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  return (
    <div className="min-h-screen bg-white dark:bg-black overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%]" id="Home">
      <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="container mx-auto min-h-screen flex flex-col justify-center py-20 pt-32">
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-12 lg:gap-20">

            {/* Left Column */}
            <div className="w-full lg:w-1/2 space-y-8 text-left order-1"
              data-aos="fade-right"
              data-aos-delay="200">
              <div className="space-y-6">
                <StatusBadge />
                <div className="space-y-1" data-aos="fade-up" data-aos-delay="600">
                  <h1 className="text-5xl sm:text-6xl md:text-8xl font-oswald font-black uppercase tracking-tighter text-black dark:text-white leading-[0.9]">
                    {t('hero.title')}
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-black to-gray-400 dark:from-white dark:to-zinc-500">
                      {t('hero.subtitle')}
                    </span>
                  </h1>
                </div>

                {/* Typing Effect - Minimalist */}
                <div className="h-8 flex items-center" data-aos="fade-up" data-aos-delay="800">
                  <span className="text-lg md:text-xl font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                    {text}
                  </span>
                  <span className="w-2 h-5 bg-black dark:bg-white ml-2 animate-blink"></span>
                </div>

                {/* Description */}
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed font-medium"
                  data-aos="fade-up"
                  data-aos-delay="1000">
                  {t('hero.description')}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-4 justify-start" data-aos="fade-up" data-aos-delay="1200">
                  {TECH_STACK.map((tech, index) => (
                    <TechStack key={index} tech={tech} />
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-row gap-4 w-full justify-start mt-8" data-aos="fade-up" data-aos-delay="1400">
                  <CTAButton href="#Portofolio" text={t('hero.ctaProjects')} icon={ExternalLink} />
                  <CTAButton href="#Contact" text={t('hero.ctaContact')} icon={Mail} />
                </div>

                {/* Social Links */}
                <div className="hidden sm:flex gap-4 justify-start mt-8" data-aos="fade-up" data-aos-delay="1600">
                  {SOCIAL_LINKS.map((social, index) => (
                    <SocialLink key={index} {...social} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Image/Graphic */}
            <div className="w-full lg:w-1/2 relative flex items-center justify-center order-2 lg:order-2"
              data-aos="fade-left"
              data-aos-delay="600">
              <div className="relative w-full aspect-square max-w-[500px]">
                {/* Solid geometric shape instead of blur blob */}
                <div className="absolute inset-0 bg-gray-100 dark:bg-zinc-900 rounded-full scale-90"></div>

                {/* Image with grayscale filter */}
                <img
                  src="Animation1.gif"
                  alt="Developer Animation"
                  className="relative z-10 w-full h-full object-contain transition-all duration-500 hover:scale-105"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Home);
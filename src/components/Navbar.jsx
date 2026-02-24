import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import gsap from "gsap";
import MagneticButton from "./MagneticButton";
import { motion } from "framer-motion";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    const { theme, toggleTheme } = useTheme();
    const { language, toggleLanguage, t } = useLanguage();

    const navRef = useRef(null);
    const fabRef = useRef(null);
    const overlayRef = useRef(null);
    const overlayContentRef = useRef(null);

    const navItems = [
        { href: "#Home", label: t('nav.home') },
        { href: "#About", label: t('nav.about') },
        { href: "#Portofolio", label: t('nav.projects') },
        { href: "#Contact", label: t('nav.contact') },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            const sections = navItems.map(item => {
                const section = document.querySelector(item.href);
                if (section) {
                    return {
                        id: item.href.replace("#", ""),
                        offset: section.offsetTop - 550,
                        height: section.offsetHeight
                    };
                }
                return null;
            }).filter(Boolean);

            const currentPosition = window.scrollY;
            const active = sections.find(section =>
                currentPosition >= section.offset &&
                currentPosition < section.offset + section.height
            );

            if (active) {
                setActiveSection(active.id);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [navItems]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';

            // Overlay Open Animation
            gsap.to(overlayRef.current, {
                duration: 0.5,
                autoAlpha: 1,
                ease: "power3.out"
            });

            // Staggered Links Animation
            gsap.fromTo(
                overlayContentRef.current.children,
                { y: 50, autoAlpha: 0 },
                {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power4.out",
                    delay: 0.1
                }
            );

        } else {
            document.body.style.overflow = 'unset';

            // Overlay Close Animation
            gsap.to(overlayRef.current, {
                duration: 0.4,
                autoAlpha: 0,
                ease: "power3.in"
            });
        }
    }, [isOpen]);

    useEffect(() => {
        // Simple Navbar shadow/background transition based on scroll
        // Removed hiding logic to satisfy user request
    }, [scrolled, isOpen]);

    const scrollToSection = (e, href) => {
        e.preventDefault();
        const section = document.querySelector(href);
        if (section) {
            const top = section.offsetTop - 100;
            window.scrollTo({
                top: top,
                behavior: "smooth"
            });
        }
        setIsOpen(false);
    };

    return (
        <>
            {/* Main Navbar */}
            <nav
                ref={navRef}
                className={`fixed w-full top-0 z-50 transition-all duration-300 ${!scrolled ? "bg-transparent" : "bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-zinc-800 backdrop-blur-md"
                    }`}
                style={{
                    paddingTop: 'env(safe-area-inset-top)',
                    WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none'
                }}
            >
                <div className="mx-auto px-[5%] sm:px-[5%] lg:px-[10%]">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <a
                                href="#Home"
                                onClick={(e) => scrollToSection(e, "#Home")}
                                className="text-2xl sm:text-3xl font-oswald font-bold uppercase tracking-tighter text-black dark:text-white transition-opacity hover:opacity-80"
                            >
                                WARDHANI
                            </a>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <div className="flex items-center space-x-8">
                                {navItems.map((item) => (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        onClick={(e) => scrollToSection(e, item.href)}
                                        className="group relative px-1 py-2 text-sm font-bold font-oswald tracking-widest text-black dark:text-white"
                                    >
                                        <span className={`relative z-10 transition-colors duration-300 ${activeSection === item.href.substring(1) ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
                                            {item.label}
                                        </span>
                                        <span
                                            className={`absolute bottom-0 left-0 w-full h-[2px] bg-black dark:bg-white transform origin-left transition-transform duration-300 ${activeSection === item.href.substring(1)
                                                ? "scale-x-100"
                                                : "scale-x-0 group-hover:scale-x-100"
                                                }`}
                                        />
                                    </a>
                                ))}
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={toggleLanguage}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-300 text-black dark:text-white border border-gray-200 dark:border-zinc-700 font-bold font-oswald w-10 h-10 flex items-center justify-center text-sm"
                                    aria-label="Toggle Language"
                                >
                                    {language.toUpperCase()}
                                </button>
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-300 text-black dark:text-white border border-gray-200 dark:border-zinc-700"
                                    aria-label="Toggle Theme"
                                >
                                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                </button>
                                <MagneticButton
                                    onClick={() => setIsOpen(true)}
                                    className="p-2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors bg-transparent border-none cursor-pointer"
                                >
                                    <Menu className="w-6 h-6" />
                                </MagneticButton>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center gap-2 sm:gap-4">
                            <button
                                onClick={toggleLanguage}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-300 text-black dark:text-white border border-gray-200 dark:border-zinc-700 font-bold font-oswald w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm"
                            >
                                {language.toUpperCase()}
                            </button>
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-300 text-black dark:text-white border border-gray-200 dark:border-zinc-700 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center"
                            >
                                {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
                            </button>
                            <MagneticButton
                                onClick={() => setIsOpen(true)}
                                className="relative p-2 text-black dark:text-white bg-transparent border-none cursor-pointer w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center"
                            >
                                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                            </MagneticButton>
                        </div>
                    </div>
                </div>
            </nav>

            {/* FAB Removed per user request to keep main navbar visible */}

            {/* Universal Overlay Menu */}
            <div
                ref={overlayRef}
                className="fixed inset-0 z-[70] bg-white/95 dark:bg-black/95 backdrop-blur-md opacity-0 invisible"
                style={{ WebkitBackdropFilter: 'blur(20px)' }}
            >
                {/* Language Toggle - Top Left */}
                <button
                    onClick={toggleLanguage}
                    className="absolute top-6 left-[5%] p-3 text-lg font-oswald font-bold text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-[80]"
                    style={{ marginTop: 'env(safe-area-inset-top)' }}
                >
                    {language.toUpperCase()}
                </button>

                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-6 right-[5%] p-3 rounded-full bg-transparent text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-300 z-[80]"
                    style={{ marginTop: 'env(safe-area-inset-top)' }}
                    aria-label="Close Menu"
                >
                    <X className="w-8 h-8" />
                </button>

                {/* Menu Content */}
                <div
                    ref={overlayContentRef}
                    className="flex flex-col items-center justify-center h-full space-y-8"
                >
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => scrollToSection(e, item.href)}
                            className={`text-5xl md:text-6xl font-oswald font-bold uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 hover:from-blue-600 hover:to-blue-400 dark:hover:from-blue-400 dark:hover:to-blue-600 transition-colors duration-300 ${activeSection === item.href.substring(1) ? "opacity-100" : "opacity-50 hover:opacity-100"
                                }`}
                        >
                            {item.label}
                        </a>
                    ))}

                    <div className="flex items-center gap-8 mt-12 mb-8">
                        {/* Social Icons */}
                        <div className="flex items-center gap-6">
                            <a href="https://github.com/rahmadekapw-afk" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                                <span className="sr-only">GitHub</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="https://www.linkedin.com/in/putra-wardhani-1497383a9/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
                                <span className="sr-only">LinkedIn</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/wardhani.12_" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600 transition-colors">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.047 1.379-.06 3.808-.06zm0-1.832c-2.63 0-2.957.012-3.82.029-1.28.026-2.228.25-3.085.575a6.76 6.76 0 00-2.27 1.478 6.76 6.76 0 00-1.478 2.27c-.325.857-.549 1.805-.575 3.085-.017.863-.029 1.19-.029 3.82 0 2.63.012 2.957.029 3.82.026 1.28.25 2.228.575 3.085.31.798.804 1.492 1.478 2.27a6.76 6.76 0 002.27 1.478c.857.325 1.805.549 3.085.575.863.017 1.19.029 3.82.029 2.63 0 2.957-.012 3.82-.029 1.28-.026 2.228-.25 3.085-.575.798-.31 1.492-.804 2.27-1.478a6.76 6.76 0 001.478-2.27c.325-.857.549-1.805.575-3.085.017-.863.029-1.19.029-3.82 0-2.63-.012-2.957-.029-3.82-.026-1.28-.25-2.228-.575-3.085a6.76 6.76 0 00-1.478-2.27 6.76 6.76 0 00-2.27-1.478c-.857-.325-1.805-.549-3.085-.575-.863-.017-1.19-.029-3.82-.029zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-500 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors">
                                <span className="sr-only">TikTok</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Navbar;
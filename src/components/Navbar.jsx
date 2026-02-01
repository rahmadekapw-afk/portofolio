import React, { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    const { theme, toggleTheme } = useTheme();
    const { language, toggleLanguage, t } = useLanguage();

    const navItems = [
        { href: "#Home", label: t('nav.home') },
        { href: "#About", label: t('nav.about') },
        { href: "#Portofolio", label: t('nav.projects') },
        { href: "#Contact", label: t('nav.contact') },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
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
    }, [navItems]); // Added dependency to update on lang change

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

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
        <nav
            className={`fixed w-full top-0 z-50 transition-all duration-300 ${isOpen
                ? "bg-white dark:bg-black"
                : scrolled
                    ? "bg-white dark:bg-black border-b border-gray-200 dark:border-zinc-800"
                    : "bg-transparent"
                }`}
        >
            <div className="mx-auto px-[5%] sm:px-[5%] lg:px-[10%]">
                <div className="flex items-center justify-between h-20">
                    {/* Logo - Nike Style */}
                    <div className="flex-shrink-0">
                        <a
                            href="#Home"
                            onClick={(e) => scrollToSection(e, "#Home")}
                            className="text-3xl font-oswald font-bold uppercase tracking-tighter text-black dark:text-white"
                        >
                            WARDHANI
                        </a>
                    </div>

                    {/* Desktop Navigation - Nike Style */}
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
                            {/* Language Toggle */}
                            <button
                                onClick={toggleLanguage}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-300 text-black dark:text-white border border-gray-200 dark:border-zinc-700 font-bold font-oswald w-10 h-10 flex items-center justify-center text-sm"
                                aria-label="Toggle Language"
                            >
                                {language.toUpperCase()}
                            </button>

                            {/* Theme Toggle - Minimalist */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-300 text-black dark:text-white border border-gray-200 dark:border-zinc-700"
                                aria-label="Toggle Theme"
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        {/* Language Toggle Mobile */}
                        <button
                            onClick={toggleLanguage}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-300 text-black dark:text-white border border-gray-200 dark:border-zinc-700 font-bold font-oswald w-10 h-10 flex items-center justify-center text-sm"
                        >
                            {language.toUpperCase()}
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-300 text-black dark:text-white border border-gray-200 dark:border-zinc-700"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="relative p-2 text-black dark:text-white"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Nike Style */}
            <div
                className={`md:hidden fixed inset-0 top-20 bg-white dark:bg-black transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
                style={{ height: 'calc(100vh - 5rem)' }}
            >
                <div className="flex flex-col h-full p-8 space-y-8">
                    {navItems.map((item, index) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => scrollToSection(e, item.href)}
                            className={`text-4xl font-oswald font-bold uppercase tracking-tighter text-black dark:text-white ${activeSection === item.href.substring(1) ? "opacity-100" : "opacity-50"}`}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
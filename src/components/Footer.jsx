import SocialLinks from './SocialLinks';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const footerLinks = [
        { name: t('nav.home'), href: '#Home' },
        { name: t('nav.projects'), href: '#Portofolio' },
        { name: t('nav.about'), href: '#About' },
        { name: t('nav.contact'), href: '#Contact' }
    ];

    return (
        <footer className="bg-black dark:bg-white text-white dark:text-black relative overflow-hidden transition-colors duration-300">
            {/* Upper Section */}
            <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
                <div className="flex flex-col gap-2">

                    {/* Main Footer Content */}
                    <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12">
                        {/* Connect With Me Grid */}
                        <div className="w-full md:flex-1">
                            <SocialLinks />
                        </div>

                        {/* Menu & Navigation */}
                        <div className="flex flex-col items-center md:items-end gap-2 mt-0">
                            {footerLinks.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="text-gray-500 hover:text-white dark:hover:text-black text-xs font-bold uppercase tracking-wider transition-colors"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="relative flex justify-center items-center border-t border-white/10 dark:border-black/10 pt-4 mt-4">
                        <p className="text-zinc-500 dark:text-zinc-500 text-[10px] font-medium tracking-wider text-center">
                            Coding With Wardhani © 2026
                        </p>

                        <button
                            onClick={scrollToTop}
                            className="absolute right-0 p-1.5 rounded-full border border-white/20 dark:border-black/20 hover:border-white dark:hover:border-black hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white transition-all group"
                            aria-label="Back to top"
                        >
                            <ArrowUp className="w-3 h-3 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

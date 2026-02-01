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
            <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
                <div className="flex flex-col gap-12">

                    {/* Connect With Me Grid - Full Width */}
                    <div className="w-full">
                        <SocialLinks />
                    </div>

                    {/* Menu & Navigation */}
                    <div className="flex flex-col md:flex-row justify-start items-center gap-12 border-t border-white/10 dark:border-black/10 pt-8">
                        {/* Copyright */}
                        <p className="text-zinc-500 dark:text-zinc-500 text-xs font-medium uppercase tracking-wider order-2 md:order-1">
                            © 2026 WARDHANI. {t('footer.rights')}
                        </p>

                        {/* Menu Links */}
                        <div className="flex items-center gap-6 order-1 md:order-2">
                            {footerLinks.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="text-gray-500 hover:text-white dark:hover:text-black text-sm font-bold uppercase tracking-wider transition-colors"
                                >
                                    {item.name}
                                </a>
                            ))}
                            <button
                                onClick={scrollToTop}
                                className="p-2 rounded-full border border-white/20 dark:border-black/20 hover:border-white dark:hover:border-black hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white transition-all group"
                                aria-label="Back to top"
                            >
                                <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

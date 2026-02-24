import { useEffect, useMemo } from "react";
import {
  Linkedin,
  Github,
  Instagram,
  Youtube,
  ExternalLink,
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
// import PresenceWidget from "./PresenceWidget";
import { useLanguage } from "../context/LanguageContext";

const SocialLinks = () => {
  const { t } = useLanguage();

  const socialLinks = useMemo(() => [
    {
      name: "LinkedIn",
      displayName: t('social.linkedin'),
      subText: "on LinkedIn",
      icon: Linkedin,
      url: "https://www.linkedin.com/in/putra-wardhani-1497383a9/",
      color: "currentColor",
      gradient: "from-zinc-500/20 to-zinc-800/20",
      isPrimary: true,
    },
    {
      name: "Instagram",
      displayName: "Instagram",
      subText: "@wardhani",
      icon: Instagram,
      url: "https://www.instagram.com/wardhani.12_",
      color: "currentColor",
      gradient: "from-zinc-500/20 via-zinc-600/20 to-zinc-700/20",
    },
    {
      name: "YouTube",
      displayName: "Youtube",
      subText: "@wardhani",
      icon: Youtube,
      url: "https://www.youtube.com/@RAHMADEKAPUTRAWARDHANI",
      color: "currentColor",
      gradient: "from-zinc-700/20 to-zinc-900/20",
    },
    {
      name: "GitHub",
      displayName: "Github",
      subText: "@wardhani",
      icon: Github,
      url: "https://github.com/rahmadekapw-afk",
      color: "currentColor",
      gradient: "from-zinc-800/20 to-black/20",
    },
    {
      name: "TikTok",
      displayName: "Tiktok",
      subText: "@wardhani",
      icon: ({ className, ...props }) => (
        <svg
          width="24px"
          height="24px"
          viewBox="0 0 45 45"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          className={className}
          {...props}
        >
          <title>Tiktok</title>
          <g
            id="Icon/Social/tiktok-color"
            stroke="none"
            strokeWidth="8"
            fill="none"
            fillRule="evenodd"
          >
            <g id="Group-7" transform="translate(8.000000, 6.000000)">
              <path
                d="M29.5248245,9.44576327 C28.0821306,9.0460898 26.7616408,8.29376327 25.6826204,7.25637551 C25.5109469,7.09719184 25.3493143,6.92821224 25.1928245,6.75433469 C23.9066204,5.27833469 23.209151,3.38037551 23.2336408,1.42290612 L17.3560898,1.42290612 L17.3560898,23.7086204 C17.3560898,27.7935184 15.1520082,29.9535184 12.416498,29.9535184 C11.694049,29.9611102 10.9789469,29.8107429 10.3213959,29.5124571 C9.6636,29.2144163 9.07951837,28.7758041 8.60955918,28.2272327 C8.1398449,27.6789061 7.79551837,27.0340898 7.60180408,26.3385796 C7.4078449,25.6430694 7.36890612,24.9132735 7.48743673,24.2008653 C7.60596735,23.4884571 7.87902857,22.8105796 8.28751837,22.2154776 C8.69625306,21.6198857 9.23037551,21.1212735 9.85241633,20.7546612 C10.474702,20.3878041 11.1694776,20.1617633 11.8882531,20.0924571 C12.6070286,20.023151 13.3324163,20.1122939 14.0129878,20.3535184 L14.0129878,14.3584163 C13.4889061,14.2430694 12.9530694,14.1862531 12.416498,14.1894367 L12.3917633,14.1894367 C10.2542939,14.1943347 8.16604898,14.8325388 6.39127347,16.0234776 C4.61649796,17.2149061 3.23429388,18.9051918 2.41976327,20.8812735 C1.60523265,22.8578449 1.39486531,25.0310694 1.8151102,27.1269061 C2.2351102,29.2227429 3.2671102,31.1469061 4.78033469,32.6564571 C6.29380408,34.1660082 8.22066122,35.1933551 10.3174776,35.6082122 C12.4142939,36.0230694 14.5870286,35.8073143 16.561151,34.9878857 C18.5355184,34.1682122 20.2226204,32.7820898 21.409151,31.0041306 C22.5959265,29.2264163 23.2289878,27.136702 23.228498,24.9992327 L23.228498,12.8155592 C25.5036,14.392702 28.2244163,15.134498 31.1289061,15.1886204 L31.1289061,9.68551837 C30.5869469,9.66568163 30.049151,9.5851102 29.5248245,9.44576327"
                fill="currentColor"
              ></path>
            </g>
          </g>
        </svg>
      ),
      url: "",
      color: "currentColor",
      gradient: "from-zinc-400 via-zinc-500 to-zinc-600",
    },
  ], [t]);

  useEffect(() => {
    AOS.init({
      offset: 10,
    });
  }, []);

  return (
    <div className="w-full">
      <h2
        className="text-2xl md:text-3xl font-black uppercase text-white dark:text-black mb-6 font-oswald tracking-tight"
        data-aos="fade-down"
      >
        {t('footer.cta')}
      </h2>

      <h3
        className="text-lg font-semibold text-white dark:text-black mb-4"
        data-aos="fade-down"
      >
        {t('footer.connect')}
      </h3>

      <div className="grid grid-cols-5 md:grid-cols-9 lg:grid-cols-12 gap-3">
        {socialLinks.map((link, index) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-center justify-center gap-2 p-2 rounded-xl 
                       bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 overflow-hidden
                       hover:border-white/20 dark:hover:border-black/20 transition-all duration-500 aspect-square"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500
                         bg-gradient-to-r ${link.gradient}`}
            />

            <div className="relative flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-20 rounded-lg transition-all duration-500
                           group-hover:scale-125 group-hover:opacity-30"
                style={{ backgroundColor: link.color }}
              />
              <div className="relative p-2 rounded-lg">
                <link.icon
                  className="w-4 h-4 transition-all duration-500 group-hover:scale-110"
                  style={{ color: link.color }}
                />
              </div>
            </div>

            <div className="flex flex-col min-w-0 items-center">
              <span className="text-[10px] font-bold text-gray-200 dark:text-zinc-700 group-hover:text-white dark:group-hover:text-black transition-colors duration-300">
                {link.displayName}
              </span>
              <span className="text-[9px] text-gray-400 dark:text-zinc-500 truncate group-hover:text-gray-300 dark:group-hover:text-zinc-600 transition-colors duration-300">
                {link.subText}
              </span>
            </div>

            <ExternalLink
              className="w-4 h-4 text-gray-500 group-hover:text-white ml-auto
                         opacity-0 group-hover:opacity-100 transition-all duration-300
                         transform group-hover:translate-x-0 -translate-x-2"
            />

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                           translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;
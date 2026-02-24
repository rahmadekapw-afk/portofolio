import React, { useEffect, memo, useMemo, useState } from "react"
import { FileText, Code, Award, Globe, ArrowUpRight } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import { supabase } from "../supabase"
import AOS from "aos"
import "aos/dist/aos.css"
import MagneticButton from "../components/MagneticButton"
import { projectData } from "../data/ProjectList"

// ================= LOCATION BADGE =================
const LocationBadge = memo(() => {
  const { t } = useLanguage();
  const locationParts = t('about.location').split(' ');
  return (
    <div
      className="inline-flex items-center bg-zinc-950 dark:bg-zinc-900 rounded-full pl-6 pr-2 py-2 border border-white/10 shadow-2xl"
    >
      <style>
        {`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 10s linear infinite;
          }
        `}
      </style>
      <div className="flex flex-col text-left">
        <span className="text-white/50 text-[10px] font-bold uppercase tracking-[0.2em] leading-none mb-1">
          {locationParts[0]} {locationParts[1]}
        </span>
        <span className="text-white text-lg font-black tracking-tighter leading-none uppercase">
          {locationParts[2]}
        </span>
      </div>
      <div className="ml-6 w-12 h-12 rounded-full bg-white flex items-center justify-center border border-white/20">
        <Globe className="w-6 h-6 text-black animate-spin-slow" />
      </div>
    </div>
  );
})

// ================= HEADER =================
const Header = memo(() => {
  const { t } = useLanguage();
  return (
    <div className="text-center pb-8 pt-12 md:pb-12 md:pt-20 portfolio-header">
      <h2 className="text-3xl md:text-5xl font-oswald font-black uppercase tracking-tighter text-black dark:text-white mb-4">
        {t('about.title')}
      </h2>
      <p className="text-gray-500 font-medium tracking-wide uppercase text-xs md:text-base max-w-2xl mx-auto px-4">
        {t('about.subtitle')}
      </p>
    </div>
  );
})

// ================= PROFILE IMAGE =================
const ProfileImage = memo(() => (
  <div className="flex justify-center lg:justify-end items-center sm:p-12 p-0">
    <div className="relative group" data-aos="zoom-in" data-aos-duration="1000">
      {/* Decorative Background Blobs */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="absolute inset-0 bg-gray-100 dark:bg-zinc-900 rounded-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 border border-black/5 dark:border-white/5 shadow-xl"></div>

      <div className="relative w-[280px] h-[350px] sm:w-[350px] sm:h-[450px] lg:w-[400px] lg:h-[500px] overflow-hidden rounded-2xl transition-all duration-500 shadow-2xl border-4 border-white dark:border-zinc-800">
        <img
          src="/Photo.jpeg"
          alt="Profile"
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
          loading="lazy"
        />
      </div>
    </div>
  </div>
))

// ================= STAT CARD =================
const StatCard = memo(({ icon: Icon, value, label, description, animation }) => (
  <div data-aos={animation} data-aos-duration="1300" className="w-full">
    <div className="bg-transparent dark:bg-black p-8 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300 group">
      <div className="flex items-center justify-between mb-6">
        <Icon className="w-12 h-12 text-black dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors" />
        <span className="text-5xl font-oswald font-bold tracking-tight">{value}</span>
      </div>

      <p className="text-lg font-bold uppercase tracking-wider mb-2">{label}</p>
      <p className="text-sm text-gray-500 group-hover:text-gray-400 dark:text-gray-400 dark:group-hover:text-gray-600 flex justify-between items-center">
        {description}
        <ArrowUpRight className="w-4 h-4" />
      </p>
    </div>
  </div>
))

// ================= MAIN COMPONENT =================
const AboutPage = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalCertificates: 0,
    YearExperience: 0
  });

  useEffect(() => {
    AOS.init({ once: false });

    const fetchData = async () => {
      try {
        // Fetch projects from Supabase
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*');

        // Fetch certificates from Supabase
        const { data: certificatesData, error: certsError } = await supabase
          .from('certificates')
          .select('*');

        const startDate = new Date("2021-11-06");
        const today = new Date();
        const experience =
          today.getFullYear() -
          startDate.getFullYear() -
          (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0);

        const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        const currentProjects = (!projectsError && projectsData && projectsData.length > 0)
          ? projectsData
          : (storedProjects.length > 0 ? storedProjects : projectData);

        const totalProjects = currentProjects.length;
        const totalCertificates = !certsError && certificatesData ? (certificatesData.length > 0 ? certificatesData.length : 1) : 1;

        setStats({
          totalProjects,
          totalCertificates,
          YearExperience: experience
        });

        // Sync with localStorage only if data is not empty
        if (!projectsError && projectsData && projectsData.length > 0) localStorage.setItem("projects", JSON.stringify(projectsData));
        if (!certsError && certificatesData && certificatesData.length > 0) localStorage.setItem("certificates", JSON.stringify(certificatesData));
      } catch (error) {
        console.error("Error fetching stats from Supabase:", error);

        // Fallback to localStorage if API fails
        const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
        const storedCertificates = JSON.parse(localStorage.getItem("certificates") || "[]");

        const startDate = new Date("2021-11-06");
        const today = new Date();
        const experience =
          today.getFullYear() -
          startDate.getFullYear() -
          (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0);

        setStats({
          totalProjects: storedProjects.length,
          totalCertificates: storedCertificates.length > 0 ? storedCertificates.length : 1,
          YearExperience: experience
        });
      }
    };

    fetchData();
  }, []);

  const statsData = [
    {
      icon: Code,
      value: stats.totalProjects,
      label: t('about.statProjects'),
      description: "Web projects completed",
      animation: "fade-right",
    },
    {
      icon: Award,
      value: stats.totalCertificates,
      label: "Certificates",
      description: "Skills & achievements",
      animation: "fade-up",
    },
    {
      icon: Globe,
      value: stats.YearExperience,
      label: t('about.statYears'),
      description: "Learning & building",
      animation: "fade-left",
    },
  ]

  return (
    <div className="pb-20 pt-20 bg-transparent text-black dark:text-white px-[5%] lg:px-[10%]" id="About">
      <Header />

      <div className="grid lg:grid-cols-2 gap-16 items-center mt-10">
        <div className="flex flex-col items-start">
          <div className="mb-6">
            <LocationBadge />
          </div>
          <h2
            className="text-3xl md:text-5xl font-oswald font-bold uppercase mb-6 md:mb-8 leading-tight"
            data-aos="fade-right"
          >
            Rahmad Eka Putra Wardhani
          </h2>

          <p
            className="text-lg md:text-xl text-gray-800 dark:text-gray-300 leading-relaxed text-justify font-medium"
            data-aos="fade-right"
            data-aos-duration="1200"
          >
            {t('about.intro')}
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <MagneticButton
              href="https://drive.google.com/drive/folders/1ffna917F2awgK7z0ChNmYZa2IKdtC3EH?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-oswald font-bold uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 flex items-center gap-2 relative z-10 rounded-none cursor-pointer"
            >
              <FileText className="w-5 h-5" /> Download CV
            </MagneticButton>
          </div>
        </div>

        <ProfileImage />
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-24">
        {statsData.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </div >
  )
}

export default memo(AboutPage)

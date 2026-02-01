import React, { useEffect, memo, useMemo } from "react"
import { FileText, Code, Award, Globe, ArrowUpRight } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import AOS from "aos"
import "aos/dist/aos.css"

// ================= HEADER =================
const Header = memo(() => {
  const { t } = useLanguage();
  return (
    <div className="text-center lg:mb-16 mb-10 px-[5%]">
      <h2
        className="text-6xl md:text-8xl font-oswald font-black uppercase tracking-tighter text-black dark:text-white"
        data-aos="fade-down"
        data-aos-duration="600"
      >
        {t('about.title')}
      </h2>
      <div className="w-24 h-2 bg-black dark:bg-white mx-auto mt-4"></div>
    </div>
  );
})

// ================= PROFILE IMAGE =================
const ProfileImage = memo(() => (
  <div className="flex justify-end items-center sm:p-12 p-0">
    <div className="relative group" data-aos="zoom-in" data-aos-duration="1000">
      {/* Solid Geometric Background */}
      <div className="absolute top-4 right-4 w-full h-full bg-gray-200 dark:bg-zinc-800 -z-10 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>

      <div className="relative w-72 h-72 sm:w-96 sm:h-96 overflow-hidden border-2 border-black dark:border-white transition-all duration-500">
        <img
          src="/Photo.jpeg"
          alt="Profile"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  </div>
))

// ================= STAT CARD =================
const StatCard = memo(({ icon: Icon, value, label, description, animation }) => (
  <div data-aos={animation} data-aos-duration="1300">
    <div className="bg-white dark:bg-black p-8 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300 group">
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
  const { totalProjects, totalCertificates, YearExperience } = useMemo(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]")
    const storedCertificates = JSON.parse(localStorage.getItem("certificates") || "[]")

    const startDate = new Date("2021-11-06")
    const today = new Date()
    const experience =
      today.getFullYear() -
      startDate.getFullYear() -
      (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0)

    return {
      totalProjects: storedProjects.length,
      totalCertificates: storedCertificates.length,
      YearExperience: experience,
    }
  }, [])

  useEffect(() => {
    AOS.init({ once: false })
  }, [])

  const statsData = [
    {
      icon: Code,
      value: totalProjects,
      label: t('about.statProjects'),
      description: "Web projects completed",
      animation: "fade-right",
    },
    {
      icon: Award,
      value: totalCertificates,
      label: "Certificates",
      description: "Skills & achievements",
      animation: "fade-up",
    },
    {
      icon: Globe,
      value: YearExperience,
      label: t('about.statYears'),
      description: "Learning & building",
      animation: "fade-left",
    },
  ]

  return (
    <div className="pb-20 pt-20 text-black dark:text-white px-[5%] lg:px-[10%]" id="About">
      <Header />

      <div className="grid lg:grid-cols-2 gap-16 items-center mt-10">
        <div>
          <h2
            className="text-4xl md:text-5xl font-oswald font-bold uppercase mb-8 leading-tight"
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
            <a href="https://drive.google.com" target="_blank">
              <button className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-oswald font-bold uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Download CV
              </button>
            </a>

            <a href="#Portofolio">
              <button className="px-8 py-4 border-2 border-black dark:border-white text-black dark:text-white font-oswald font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-95 flex items-center gap-2">
                <Code className="w-5 h-5" /> {t('projects.viewProject')}
              </button>
            </a>
          </div>
        </div>

        <ProfileImage />
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-24">
        {statsData.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  )
}

export default memo(AboutPage)

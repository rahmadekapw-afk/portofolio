import React, { useEffect, memo, useMemo } from "react"
import { FileText, Code, Award, Globe, ArrowUpRight, Sparkles } from "lucide-react"
import AOS from "aos"
import "aos/dist/aos.css"

// ================= HEADER =================
const Header = memo(() => (
  <div className="text-center lg:mb-8 mb-2 px-[5%]">
    <h2
      className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
      data-aos="zoom-in-up"
      data-aos-duration="600"
    >
      About Me
    </h2>

    <p
      className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base sm:text-lg flex items-center justify-center gap-2"
      data-aos="zoom-in-up"
      data-aos-duration="800"
    >
      <Sparkles className="w-5 h-5 text-purple-400" />
      Transforming ideas into digital experiences
      <Sparkles className="w-5 h-5 text-purple-400" />
    </p>
  </div>
))

// ================= PROFILE IMAGE =================
const ProfileImage = memo(() => (
  <div className="flex justify-end items-center sm:p-12 p-0">
    <div className="relative group" data-aos="fade-up" data-aos-duration="1000">
      <div className="absolute -inset-6 opacity-[25%] z-0 hidden sm:block">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 rounded-full blur-2xl animate-spin-slower" />
        <div className="absolute inset-0 bg-gradient-to-l from-fuchsia-500 via-rose-500 to-pink-600 rounded-full blur-2xl animate-pulse-slow opacity-50" />
      </div>

      <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-[0_0_40px_rgba(120,119,198,0.3)]">
        <img
          src="/Photo.jpeg"
          alt="Profile"
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          loading="lazy"
        />
      </div>
    </div>
  </div>
))

// ================= STAT CARD =================
const StatCard = memo(({ icon: Icon, color, value, label, description, animation }) => (
  <div data-aos={animation} data-aos-duration="1300">
    <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-black/5 dark:border-white/10 hover:scale-105 transition-all duration-300">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10`} />

      <div className="flex items-center justify-between mb-4">
        <Icon className="w-10 h-10 text-primary dark:text-white" />
        <span className="text-4xl font-bold text-gray-900 dark:text-white">{value}</span>
      </div>

      <p className="text-sm uppercase tracking-wider text-gray-600 dark:text-gray-300">{label}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
        {description}
        <ArrowUpRight className="w-4 h-4" />
      </p>
    </div>
  </div>
))

// ================= MAIN COMPONENT =================
const AboutPage = () => {
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
      color: "from-[#6366f1] to-[#a855f7]",
      value: totalProjects,
      label: "Total Projects",
      description: "Web projects completed",
      animation: "fade-right",
    },
    {
      icon: Award,
      color: "from-[#a855f7] to-[#6366f1]",
      value: totalCertificates,
      label: "Certificates",
      description: "Skills & achievements",
      animation: "fade-up",
    },
    {
      icon: Globe,
      color: "from-[#6366f1] to-[#a855f7]",
      value: YearExperience,
      label: "Years Experience",
      description: "Learning & building",
      animation: "fade-left",
    },
  ]

  return (
    <div className="pb-[10%] text-white px-[5%] lg:px-[10%] mt-10" id="About">
      <Header />

      <div className="grid lg:grid-cols-2 gap-12 items-center mt-10">
        <div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            data-aos="fade-right"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
              Hello, I'm
            </span>
            <span className="block text-gray-700 dark:text-gray-200 mt-2">
              Rahmad Eka Putra Wardhani
            </span>
          </h2>

          <p
            className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed text-justify"
            data-aos="fade-right"
            data-aos-duration="1200"
          >
            Saya Rahmad Eka Putra Wardhani, mahasiswa Universitas Amikom Yogyakarta semester 6
            yang berfokus pada pengembangan web. Saya memiliki ketertarikan besar dalam
            membangun aplikasi web yang modern, responsif, dan user-friendly. Dengan
            semangat belajar yang tinggi, saya terus mengembangkan kemampuan sebagai Web
            Developer serta mengikuti perkembangan teknologi terkini.
          </p>

          <div className="flex gap-4 mt-6">
            <a href="https://drive.google.com" target="_blank">
              <button className="px-6 py-3 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-lg flex items-center gap-2 hover:scale-105 transition">
                <FileText className="w-5 h-5" /> Download CV
              </button>
            </a>

            <a href="#Portofolio">
              <button className="px-6 py-3 border border-[#a855f7] rounded-lg text-[#a855f7] hover:bg-[#a855f7]/10 transition flex items-center gap-2">
                <Code className="w-5 h-5" /> View Projects
              </button>
            </a>
          </div>
        </div>

        <ProfileImage />
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-16">
        {statsData.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <style jsx>{`
        @keyframes spin-slower {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slower {
          animation: spin-slower 8s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s infinite;
        }
      `}</style>
    </div>
  )
}

export default memo(AboutPage)

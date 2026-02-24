import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ExternalLink, Github, Code2, Star,
  ChevronRight, Layers, Layout, Globe, Package, Cpu, Code,
} from "lucide-react";
import Swal from 'sweetalert2';
import { projectData } from "../data/ProjectList";
import MagneticButton from "./MagneticButton";

const TECH_ICONS = {
  React: Globe,
  Tailwind: Layout,
  Express: Cpu,
  Python: Code,
  Javascript: Code,
  HTML: Code,
  CSS: Code,
  default: Package,
};

const TechBadge = ({ tech }) => {
  const Icon = TECH_ICONS[tech] || TECH_ICONS["default"];

  return (
    <div className="group relative overflow-hidden px-3 py-2 md:px-4 md:py-2.5 bg-gray-100 dark:bg-white/10 rounded-xl border border-gray-200 dark:border-white/10 hover:border-black dark:hover:border-white transition-all duration-300 cursor-default">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-500/0 to-zinc-500/0 group-hover:from-black/5 group-hover:to-zinc-500/5 transition-all duration-500" />
      <div className="relative flex items-center gap-1.5 md:gap-2">
        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-black dark:text-white group-hover:scale-110 transition-transform" />
        <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-zinc-300 group-hover:text-black dark:group-hover:text-white transition-colors">
          {tech}
        </span>
      </div>
    </div>
  );
};

const FeatureItem = ({ feature }) => {
  return (
    <li className="group flex items-start space-x-3 p-2.5 md:p-3.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-white/10">
      <div className="relative mt-2">
        <div className="absolute -inset-1 bg-gradient-to-r from-gray-600/20 to-zinc-600/20 rounded-full blur group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
        <div className="relative w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-black dark:bg-white group-hover:scale-125 transition-transform duration-300" />
      </div>
      <span className="text-sm md:text-base text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white transition-colors">
        {feature}
      </span>
    </li>
  );
};

const ProjectStats = ({ project }) => {
  const techStackCount = project?.TechStack?.length || 0;
  const featuresCount = project?.Features?.length || 0;

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 dark:bg-zinc-900 rounded-xl overflow-hidden relative border border-gray-200 dark:border-zinc-800">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/5 to-zinc-900/5 dark:from-white/5 dark:to-zinc-100/5 opacity-50 blur-2xl z-0" />

      <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-white dark:bg-white/5 p-2 md:p-3 rounded-lg border border-gray-100 dark:border-white/10 transition-all duration-300 hover:scale-105 hover:border-black dark:hover:border-white hover:shadow-lg">
        <div className="bg-gray-100 dark:bg-white/10 p-1.5 md:p-2 rounded-full">
          <Code2 className="text-black dark:text-white w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">{techStackCount}</div>
          <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Total Teknologi</div>
        </div>
      </div>

      <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-white dark:bg-white/5 p-2 md:p-3 rounded-lg border border-gray-100 dark:border-white/10 transition-all duration-300 hover:scale-105 hover:border-black dark:hover:border-white hover:shadow-lg">
        <div className="bg-gray-100 dark:bg-white/10 p-1.5 md:p-2 rounded-full">
          <Layers className="text-black dark:text-white w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">{featuresCount}</div>
          <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Fitur Utama</div>
        </div>
      </div>
    </div>
  );
};

const handleGithubClick = (githubLink) => {
  if (githubLink === 'Private') {
    Swal.fire({
      icon: 'info',
      title: 'Source Code Private',
      text: 'Maaf, source code untuk proyek ini bersifat privat.',
      confirmButtonText: 'Mengerti',
      confirmButtonColor: '#3085d6',
      background: '#030014',
      color: '#ffffff'
    });
    return false;
  }
  return true;
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Mengambil langsung dari file data statis
    const selectedProject = projectData.find((p) => String(p.id) === id);

    if (selectedProject) {
      const enhancedProject = {
        ...selectedProject,
        Features: selectedProject.Features || [],
        TechStack: selectedProject.TechStack || [],
        Github: selectedProject.Github || 'https://github.com/rahmadekapw-afk',
      };
      setProject(enhancedProject);
    }
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#030014] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto border-4 border-black/10 dark:border-white/10 border-t-black dark:border-t-white rounded-full animate-spin" />
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">Loading Project...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#030014] px-[2%] sm:px-0 relative overflow-hidden transition-colors duration-300">
      {/* Background animations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -inset-[10px] opacity-10 dark:opacity-10 opacity-20">
          <div className="absolute top-0 -left-4 w-72 md:w-96 h-72 md:h-96 bg-gray-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 md:w-96 h-72 md:h-96 bg-zinc-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 md:w-96 h-72 md:h-96 bg-slate-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] dark:invert" />
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
          <div className="flex items-center space-x-2 md:space-x-4 mb-8 md:mb-12">
            <MagneticButton
              onClick={() => navigate(-1)}
              className="group inline-flex items-center space-x-1.5 md:space-x-2 px-3 md:px-5 py-2 md:py-2.5 bg-gray-100 dark:bg-white/5 backdrop-blur-xl rounded-xl text-black dark:text-white/90 hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-300 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 text-sm md:text-base cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </MagneticButton>
            <div className="flex items-center space-x-1 md:space-x-2 text-sm md:text-base text-gray-500 dark:text-white/50">
              <span>Projects</span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-gray-900 dark:text-white/90 truncate font-medium">{project.Title}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
            <div className="space-y-6 md:space-y-10 order-2 lg:order-1">
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-oswald text-black dark:text-white leading-tight">
                  {project.Title}
                </h1>
                <div className="relative h-1 w-16 md:w-24">
                  <div className="absolute inset-0 bg-black dark:bg-white rounded-full" />
                </div>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-300/90 leading-relaxed font-medium">
                  {project.Description}
                </p>
              </div>

              <ProjectStats project={project} />

              <div className="flex flex-wrap gap-3 md:gap-4">
                {/* Action buttons with Magnetic Effect */}
                <MagneticButton
                  href={project.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  strength={0.3}
                  className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-black dark:bg-white text-white dark:text-black rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-sm md:text-base font-bold uppercase tracking-wider"
                >
                  <ExternalLink className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                  <span className="relative">Live Demo</span>
                </MagneticButton>

                <MagneticButton
                  href={project.Github}
                  target="_blank"
                  rel="noopener noreferrer"
                  strength={0.3}
                  className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-zinc-900 hover:scale-105 active:scale-95 text-sm md:text-base font-bold uppercase tracking-wider"
                  onClick={(e) => !handleGithubClick(project.Github) && e.preventDefault()}
                >
                  <Github className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                  <span className="relative">Github</span>
                </MagneticButton>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h3 className="text-lg md:text-xl font-bold font-oswald text-black dark:text-white uppercase tracking-wider flex items-center gap-2 md:gap-3">
                  <Code2 className="w-5 h-5 md:w-6 md:h-6" />
                  Technologies Used
                </h3>
                {project.TechStack.length > 0 ? (
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {project.TechStack.map((tech, index) => (
                      <TechBadge key={index} tech={tech} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm md:text-base text-gray-500 opacity-50">No technologies added.</p>
                )}
              </div>
            </div>

            <div className="space-y-6 md:space-y-10 order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden border-2 border-black dark:border-white shadow-2xl group">
                <div className="absolute inset-0 bg-black/10 dark:bg-black/20 group-hover:opacity-0 transition-opacity duration-500 z-10" />
                <img
                  src={project.Img}
                  alt={project.Title}
                  className="w-full h-auto object-cover transform transition-transform duration-700 will-change-transform group-hover:scale-105"
                  onLoad={() => setIsImageLoaded(true)}
                />
              </div>

              {/* Fitur Utama */}
              <div className="bg-gray-50 dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-white/10 space-y-6 hover:border-gray-300 dark:hover:border-white/20 transition-colors duration-300 group">
                <h3 className="text-xl font-bold font-oswald text-black dark:text-white uppercase tracking-wider flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-500 group-hover:rotate-[20deg] transition-transform duration-300" />
                  Key Features
                </h3>
                {project.Features.length > 0 ? (
                  <ul className="list-none space-y-2">
                    {project.Features.map((feature, index) => (
                      <FeatureItem key={index} feature={feature} />
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 opacity-50">No features added.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ProjectDetails;

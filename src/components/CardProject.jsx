import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import MagneticButton from './MagneticButton';

const CardProject = ({ Img, Title, Description, Link: ProjectLink, id }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLiveDemo = (e) => {
    if (!ProjectLink) {
      console.log("ProjectLink kosong");
      e.preventDefault();
      alert("Live demo link is not available");
    }
  };

  const handleDetails = (e, projectId) => {
    e.preventDefault();
    if (!projectId) {
      console.log("ID kosong");
      alert("Project details are not available");
      return;
    }

    // Capture click position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    // Navigate with state
    navigate(`/project/${projectId}`, {
      state: {
        clickPosition: { x, y }
      }
    });
  };

  return (
    <div className="group relative w-full border-2 border-transparent hover:border-black dark:hover:border-white transition-all duration-300">
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:shadow-lg transition-all duration-300">

        {/* Image Section - Magnetic Effect */}
        <MagneticButton className="relative aspect-video overflow-hidden cursor-pointer" strength={0.3}>
          <img
            src={Img}
            alt={Title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-300"></div>
        </MagneticButton>

        {/* Content Section */}
        <div className="p-6">
          <h3 className="text-2xl font-oswald font-bold uppercase text-black dark:text-white mb-3">
            {Title}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-6 font-medium">
            {Description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800">
            {ProjectLink ? (
              <a
                href={ProjectLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLiveDemo}
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black dark:text-white hover:underline"
              >
                LIVE DEMO
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <span className="text-gray-400 text-sm font-bold uppercase cursor-not-allowed">Demo N/A</span>
            )}

            {id ? (
              <button
                onClick={(e) => handleDetails(e, id)}
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black dark:text-white hover:underline bg-transparent border-none cursor-pointer"
              >
                DETAILS
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-gray-400 text-sm font-bold uppercase cursor-not-allowed">Details N/A</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProject;
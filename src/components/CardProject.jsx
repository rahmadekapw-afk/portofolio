import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import MagneticButton from './MagneticButton';
import DeviceMockup from './DeviceMockup';

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
    <div className="group relative w-full h-full border-2 border-transparent hover:border-black dark:hover:border-white transition-all duration-300">
      <div className="relative h-full overflow-hidden bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:shadow-lg transition-all duration-300 flex flex-col">

        {/* Image Section - Device Mockup */}
        <div className="relative overflow-hidden cursor-pointer group/mockup py-6 px-4 bg-gray-50/50 dark:bg-zinc-900/50" onClick={(e) => id && handleDetails(e, id)}>
          <div className="hidden md:block">
            <DeviceMockup type="laptop" image={Img} />
          </div>
          <div className="block md:hidden">
            <DeviceMockup type="phone" image={Img} />
          </div>

          <div className="absolute inset-0 bg-black/0 group-hover/mockup:bg-black/5 transition-all duration-300"></div>
        </div>

        {/* Content Section */}
        <div className="p-3 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-oswald font-bold uppercase text-black dark:text-white mb-2">
              {Title}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4 font-medium">
              {Description}
            </p>
          </div>

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
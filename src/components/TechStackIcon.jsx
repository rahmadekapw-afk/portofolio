import React from 'react';

const TechStackIcon = ({ TechStackIcon, Language }) => {
  return (
    <div className="group p-6 rounded-2xl bg-zinc-100/50 dark:bg-zinc-800/50 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 transition-all duration-300 ease-in-out flex flex-col items-center justify-center gap-3 hover:scale-105 cursor-pointer border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm hover:shadow-md">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-zinc-400 to-zinc-600 rounded-full opacity-0 group-hover:opacity-50 blur transition duration-300"></div>
        <img
          src={TechStackIcon}
          alt={`${Language} icon`}
          className="relative h-16 w-16 md:h-20 md:w-20 transform transition-transform duration-300 pointer-events-none"
        />
      </div>
      <span className="text-zinc-600 dark:text-zinc-400 font-bold text-sm md:text-base tracking-wide group-hover:text-black dark:group-hover:text-white transition-colors duration-300 uppercase font-oswald">
        {Language}
      </span>
    </div>
  );
};

export default TechStackIcon; 
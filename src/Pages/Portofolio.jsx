import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes } from "lucide-react";
import { projectData } from "../data/ProjectList";
import { useLanguage } from "../context/LanguageContext";

const ToggleButton = ({ onClick, isShowingMore }) => {
  const { t } = useLanguage();
  return (
    <button
      onClick={onClick}
      className="
      px-6 py-3
      text-black dark:text-white
      bg-transparent
      text-sm 
      font-bold 
      uppercase 
      tracking-widest
      border-2 
      border-black dark:border-white
      hover:bg-black hover:text-white 
      dark:hover:bg-white dark:hover:text-black
      transition-all 
      duration-300 
      flex 
      items-center 
      gap-3
      mx-auto
    "
    >
      {isShowingMore ? "SEE LESS" : "SEE MORE"}
    </button>
  );
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const techStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "tailwind.svg", language: "Tailwind CSS" },
  { icon: "reactjs.svg", language: "ReactJS" },
  { icon: "vite.svg", language: "Vite" },
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "firebase.svg", language: "Firebase" },
  { icon: "MUI.svg", language: "Material UI" },
  { icon: "vercel.svg", language: "Vercel" },
  { icon: "SweetAlert.svg", language: "SweetAlert2" },
];

export default function FullWidthTabs() {
  const theme = useTheme();
  const { t } = useLanguage();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    AOS.init({
      once: false,
    });
    setProjects(projectData);
    localStorage.setItem("projects", JSON.stringify(projectData));
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback((type) => {
    if (type === 'projects') {
      setShowAllProjects(prev => !prev);
    } else {
      setShowAllCertificates(prev => !prev);
    }
  }, []);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);

  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-white dark:bg-black overflow-hidden pb-20" id="Portofolio">
      {/* Header section - Nike Style */}
      <div className="text-center pb-12 pt-20" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="text-5xl md:text-8xl font-oswald font-black uppercase tracking-tighter text-black dark:text-white mb-4">
          {t('projects.title')}
        </h2>
        <p className="text-gray-500 font-medium tracking-wide uppercase text-sm md:text-base max-w-2xl mx-auto">
          {t('projects.subtitle')}
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        {/* AppBar and Tabs section - Nike Style */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            boxShadow: "none",
          }}
          className="border-b-2 border-gray-100 dark:border-zinc-800"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            indicatorColor="primary"
            variant="fullWidth"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#000',
                height: 4,
              },
              "& .MuiTab-root": {
                fontFamily: "Oswald, sans-serif",
                fontSize: { xs: "1rem", md: "1.25rem" },
                fontWeight: 700,
                color: theme.palette.mode === 'dark' ? '#666' : '#999',
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                "&.Mui-selected": {
                  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                },
              },
            }}
          >
            <Tab label={t('projects.title')} {...a11yProps(0)} />
            <Tab label="CERTIFICATES" {...a11yProps(1)} />
            <Tab label={t('projects.techStack')} {...a11yProps(2)} />
          </Tabs>
        </AppBar>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={setValue}
        >
          {/* Projects Tab */}
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
                {displayedProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    data-aos="fade-up"
                    data-aos-duration="1000"
                  >
                    <CardProject
                      Img={project.Img}
                      Title={project.Title}
                      Description={project.Description}
                      Link={project.Link}
                      id={project.id}
                    />
                  </div>
                ))}
              </div>
            </div>
            {projects.length > initialItems && (
              <div className="mt-12 w-full flex justify-center">
                <ToggleButton
                  onClick={() => toggleShowMore('projects')}
                  isShowingMore={showAllProjects}
                />
              </div>
            )}
          </TabPanel>

          {/* Certificates Tab */}
          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 gap-4">
                {displayedCertificates.map((certificate, index) => (
                  <div
                    key={certificate.id || index}
                    data-aos="fade-up"
                    data-aos-duration="1000"
                  >
                    <Certificate ImgSertif={certificate.Img} />
                  </div>
                ))}
              </div>
            </div>
            {certificates.length > initialItems && (
              <div className="mt-12 w-full flex justify-center">
                <ToggleButton
                  onClick={() => toggleShowMore('certificates')}
                  isShowingMore={showAllCertificates}
                />
              </div>
            )}
          </TabPanel>

          {/* Tech Stack Tab */}
          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="container mx-auto pb-[5%] overflow-hidden">
              <div className="relative flex overflow-hidden pause-on-hover">
                <div className="animate-marquee flex gap-12 py-8">
                  {[...techStacks, ...techStacks].map((stack, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 transition-all duration-300 hover:scale-110"
                    >
                      <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
}
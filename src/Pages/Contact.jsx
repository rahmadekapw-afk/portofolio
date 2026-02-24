import React, { useState, useEffect } from "react";
import { Share2, User, Mail, MessageSquare, Send } from "lucide-react";
import SocialLinks from "../components/SocialLinks";
import Komentar from "../components/Commentar";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import MagneticButton from "../components/MagneticButton";

const ContactPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    Swal.fire({
      title: t('contact.sending'),
      html: 'Please wait',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      const formSubmitUrl = 'https://formsubmit.co/putrawardhani7@gmail.com';
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('message', formData.message);
      submitData.append('_captcha', 'false');
      submitData.append('_template', 'table'); // Better email formatting

      await axios.post(formSubmitUrl, submitData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      Swal.fire({
        title: t('contact.successTitle'),
        text: t('contact.successMessage'),
        icon: 'success',
        confirmButtonColor: '#000',
      });

      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error); // Log error for debugging
      Swal.fire({
        title: t('contact.errorTitle'),
        text: t('contact.errorMessage'),
        icon: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen pb-12 pt-12 md:pb-20 md:pt-20 px-[5%] md:px-[10%] overflow-hidden bg-gray-50 dark:bg-black text-black dark:text-white" id="Contact">

      {/* Header Section - Nike Style: Big, Bold, Uppercase */}
      <div className="text-center mb-12 md:mb-20">
        <h2
          data-aos="fade-down"
          className="text-3xl md:text-5xl font-oswald font-black uppercase tracking-tighter mb-4 text-black dark:text-white"
        >
          {t('contact.title')}
        </h2>
        <p
          data-aos="fade-up"
          className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-xs md:text-base font-medium tracking-wide uppercase px-4"
        >
          {t('contact.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 items-start">

        {/* Left Side: Contact Form - Improved 'Nike' Style */}
        <div
          data-aos="fade-right"
          className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-8 md:p-12 shadow-sm relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-3xl font-oswald font-bold uppercase text-black dark:text-white mb-1">
                {t('contact.formTitle')}
              </h3>
              <p className="text-gray-400 text-sm font-medium">{t('contact.dropMessage')}</p>
            </div>
            <div className="p-3 bg-black dark:bg-white rounded-full">
              <Share2 className="w-5 h-5 text-white dark:text-black" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <label className="text-xs font-bold uppercase text-gray-500 mb-2 block tracking-wider">{t('contact.nameLabel')}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder={t('contact.namePlaceholder')}
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full py-4 pl-12 pr-4 bg-gray-100 dark:bg-zinc-800/50 rounded-none border-b-2 border-transparent focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white placeholder:text-gray-400 font-bold uppercase tracking-wider text-sm"
                  required
                />
              </div>
            </div>

            <div className="relative group">
              <label className="text-xs font-bold uppercase text-gray-500 mb-2 block tracking-wider">{t('contact.emailLabel')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder={t('contact.emailPlaceholder')}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full py-4 pl-12 pr-4 bg-gray-100 dark:bg-zinc-800/50 rounded-none border-b-2 border-transparent focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white placeholder:text-gray-400 font-bold uppercase tracking-wider text-sm"
                  required
                />
              </div>
            </div>

            <div className="relative group">
              <label className="text-xs font-bold uppercase text-gray-500 mb-2 block tracking-wider">{t('contact.messageLabel')}</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-5 w-5 h-5 text-gray-400" />
                <textarea
                  name="message"
                  placeholder={t('contact.messagePlaceholder')}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full min-h-[150px] py-4 pl-12 pr-4 bg-gray-100 dark:bg-zinc-800/50 rounded-none border-b-2 border-transparent focus:border-black dark:focus:border-white transition-all outline-none text-black dark:text-white placeholder:text-gray-400 font-bold uppercase tracking-wider text-sm resize-none"
                  required
                />
              </div>
            </div>

            <MagneticButton
              as="button"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-oswald font-bold text-lg uppercase tracking-widest rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 mt-4 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="animate-pulse">{t('contact.sending')}</span>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {t('contact.sendButton')}
                </>
              )}
            </MagneticButton>
          </form>


        </div>

        {/* Right Side: Comments Section */}
        <div
          data-aos="fade-left"
          className="h-full"
        >
          <Komentar />
        </div>

      </div>

    </div>
  );
};

export default ContactPage;
import React, { useState, useEffect } from "react";
import { Share2, User, Mail, MessageSquare, Send, Phone, MapPin } from "lucide-react";
import SocialLinks from "../components/SocialLinks";
import Komentar from "../components/Commentar";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

const ContactPage = () => {
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
      title: 'Mengirim Pesan...',
      html: 'Harap tunggu sebentar',
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

      await axios.post(formSubmitUrl, submitData);

      Swal.fire({
        title: 'Berhasil!',
        text: 'Pesan Anda telah terkirim!',
        icon: 'success',
        confirmButtonColor: '#6366f1',
      });

      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      Swal.fire({
        title: 'Gagal!',
        text: 'Terjadi kesalahan, coba lagi nanti.',
        icon: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen pb-20 pt-10 px-[5%] md:px-[10%] overflow-hidden" id="Contact">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[10%] left-[-10%] w-[300px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[300px] h-[300px] bg-purple-500/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Header Section */}
      <div className="text-center mb-16">
        <h2
          data-aos="fade-down"
          className="text-4xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500"
        >
          Mari Terhubung
        </h2>
        <p
          data-aos="fade-up"
          className="text-slate-400 max-w-xl mx-auto text-base md:text-lg leading-relaxed"
        >
          Punya ide luar biasa atau sekadar ingin menyapa? Pintu digital saya selalu terbuka untuk Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-10 items-start">

        {/* Left Side: Contact Info & Form */}
        <div
          data-aos="fade-right"
          className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden group"
        >
          {/* Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50"></div>

          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Hubungi Saya</h3>
              <p className="text-slate-400 text-sm">Silakan isi formulir di bawah ini.</p>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-2xl">
              <Share2 className="w-6 h-6 text-indigo-400" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full py-4 pl-12 pr-4 bg-white/[0.05] rounded-xl border border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-white placeholder:text-slate-500"
                required
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="email"
                name="email"
                placeholder="Alamat Email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full py-4 pl-12 pr-4 bg-white/[0.05] rounded-xl border border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-white placeholder:text-slate-500"
                required
              />
            </div>

            <div className="relative group">
              <MessageSquare className="absolute left-4 top-5 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <textarea
                name="message"
                placeholder="Pesan Anda..."
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full min-h-[150px] py-4 pl-12 pr-4 bg-white/[0.05] rounded-xl border border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-white placeholder:text-slate-500 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Mengirim...</span>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Kirim Pesan
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5">
            <div className="flex justify-center gap-6">
              <SocialLinks />
            </div>
          </div>
        </div>

        {/* Right Side: Comments Section */}
        <div
          data-aos="fade-left"
          className="h-full"
        >
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-2 md:p-6 shadow-2xl h-full mt-[-2px]">
            <Komentar />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
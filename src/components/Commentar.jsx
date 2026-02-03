import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { MessageCircle, UserCircle2, Loader2, Send, ImagePlus, X, Pin, Sparkles } from 'lucide-react';
import AOS from "aos";
import "aos/dist/aos.css";
import { supabase } from '../supabase';
import { useLanguage } from "../context/LanguageContext";
import MagneticButton from './MagneticButton';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Comment = memo(({ comment, formatDate, isPinned = false, t }) => (
    <div
        className={`px-6 py-6 border-b transition-all duration-300 group ${isPinned
            ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
            : 'bg-transparent border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-900'
            }`}
        data-aos="fade-up"
    >
        {isPinned && (
            <div className="flex items-center gap-2 mb-4 text-white dark:text-black">
                <Pin className="w-4 h-4 fill-current" />
                <span className="text-xs font-oswald font-bold uppercase tracking-widest">{t('discussion.pinned')}</span>
            </div>
        )}
        <div className="flex items-start gap-4">
            <div className="relative inline-block flex-shrink-0">
                {comment.profile_image ? (
                    <img
                        src={comment.profile_image}
                        alt={comment.user_name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-black dark:border-white"
                        loading="lazy"
                    />
                ) : (
                    <div className={`p-3 rounded-full ${isPinned
                        ? 'bg-white text-black dark:bg-black dark:text-white'
                        : comment.user_name === 'Gemini AI'
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400'
                        }`}>
                        {comment.user_name === 'Gemini AI' ? <Sparkles className="w-6 h-6" /> : <UserCircle2 className="w-6 h-6" />}
                    </div>
                )}
            </div>

            <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                        <h4 className={`font-bold font-oswald uppercase text-lg ${isPinned ? 'text-white dark:text-black' : 'text-black dark:text-white'}`}>
                            {comment.user_name}
                        </h4>
                        {isPinned && (
                            <span className="px-2 py-0.5 text-[10px] bg-white text-black dark:bg-black dark:text-white font-bold uppercase tracking-wider">
                                ADMIN
                            </span>
                        )}
                        {comment.user_name === 'Gemini AI' && (
                            <span className="px-2 py-0.5 text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> AI
                            </span>
                        )}
                    </div>
                    <span className={`text-xs font-medium uppercase tracking-wider ${isPinned ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500'}`}>
                        {formatDate(comment.created_at)}
                    </span>
                </div>
                <p className={`text-sm leading-relaxed ${isPinned ? 'text-gray-200 dark:text-gray-800' : 'text-gray-700 dark:text-gray-300'}`}>
                    {comment.content}
                </p>
            </div>
        </div>
    </div>
));

const CommentForm = memo(({ onSubmit, isSubmitting, t }) => {
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) return alert('File terlalu besar (Maks 5MB)');
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim() || !userName.trim()) return;
        onSubmit({ newComment, userName, imageFile });
        setNewComment('');
        // setUserName(''); // Optional: keep username for easier multiple comments
        setImagePreview(null);
        setImageFile(null);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                    <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        placeholder={t('discussion.placeholderName')}
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full py-4 pl-12 pr-4 bg-gray-100 dark:bg-zinc-800/50 rounded-none border-b-2 border-transparent focus:border-black dark:focus:border-white outline-none text-black dark:text-white font-bold uppercase tracking-wider placeholder:text-gray-400 transition-all text-sm"
                        required
                    />
                </div>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-4 px-4 bg-gray-100 dark:bg-zinc-800/50 border-b-2 border-transparent hover:border-black dark:hover:border-white text-gray-400 hover:text-black dark:hover:text-white font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-sm rounded-none"
                    >
                        <ImagePlus className="w-5 h-5" />
                        {imagePreview ? t('discussion.changePhoto') : t('discussion.profilePhoto')}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                </div>
            </div>

            {imagePreview && (
                <div className="relative inline-block">
                    <img src={imagePreview} className="w-20 h-20 object-cover border-2 border-black dark:border-white" alt="preview" />
                    <button
                        onClick={() => { setImagePreview(null); setImageFile(null); }}
                        className="absolute -top-2 -right-2 bg-black text-white p-1 hover:scale-110 transition-transform rounded-full"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="relative">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={t('discussion.placeholderComment')}
                    className="w-full min-h-[120px] p-6 bg-gray-100 dark:bg-zinc-800/50 rounded-none border-b-2 border-transparent focus:border-black dark:focus:border-white outline-none text-black dark:text-white text-base font-medium resize-none transition-all placeholder:text-gray-400 placeholder:font-bold placeholder:uppercase placeholder:tracking-wider text-sm"
                    required
                />
            </div>

            <MagneticButton
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-oswald font-bold uppercase tracking-widest text-lg rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {isSubmitting ? t('discussion.sending') : t('discussion.postButton')}
            </MagneticButton>
        </form>
    );
});

const Komentar = () => {
    const { t } = useLanguage();
    const [comments, setComments] = useState([]);
    const [pinnedComment, setPinnedComment] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize Gemini AI safely
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

    useEffect(() => {
        AOS.init({ once: false });
        fetchPinnedComment();
        fetchComments();

        const subscription = supabase
            .channel('portfolio_comments')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio_comments' }, () => {
                fetchComments();
                fetchPinnedComment();
            })
            .subscribe();

        return () => subscription.unsubscribe();
    }, []);

    const fetchPinnedComment = async () => {
        const { data } = await supabase.from('portfolio_comments').select('*').eq('is_pinned', true).single();
        if (data) setPinnedComment(data);
    };

    const fetchComments = async () => {
        const { data } = await supabase.from('portfolio_comments').select('*').eq('is_pinned', false).order('created_at', { ascending: false });
        if (data) setComments(data);
    };

    const handleAIResponse = async (userComment, userName) => {
        if (!genAI) {
            console.error("Gemini API Key is missing or not loaded!");
            alert("System Error: Gemini API Key is missing. Please restart the terminal server.");
            return;
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            const prompt = `
                You are an AI Assistant for Rahmad Eka Putra Wardhani's Portfolio Website.
                A user named "${userName}" just commented: "${userComment}".
                
                Please reply to them politely, professionally, and briefly (max 2-3 sentences).
                Appreciate their visit or feedback. If they ask a question about Rahmad, answer generally that Rahmad is a Fullstack Developer student at Amikom University Yogyakarta.
                Keep the tone friendly and encouraging.
            `;

            console.log("Sending prompt to Gemini...", prompt);
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            console.log("Gemini Response:", text);

            if (text) {
                await supabase.from('portfolio_comments').insert([{
                    content: text,
                    user_name: 'Gemini AI',
                    profile_image: null,
                    is_pinned: false,
                }]);
            }
        } catch (error) {
            console.error("Gemini AI Error:", error);
            // Optional: alert the user if debugging
            alert(`AI Error: ${error.message}`);
        }
    };

    const handleCommentSubmit = async ({ newComment, userName, imageFile }) => {
        setIsSubmitting(true);
        try {
            let profileImageUrl = null;
            if (imageFile) {
                const fileName = `${Date.now()}_${imageFile.name}`;
                const { data: uploadData } = await supabase.storage.from('profile-images').upload(`profile-images/${fileName}`, imageFile);
                if (uploadData) {
                    const { data: { publicUrl } } = supabase.storage.from('profile-images').getPublicUrl(`profile-images/${fileName}`);
                    profileImageUrl = publicUrl;
                }
            }

            // 1. Insert User Comment
            await supabase.from('portfolio_comments').insert([{
                content: newComment,
                user_name: userName,
                profile_image: profileImageUrl,
                is_pinned: false,
            }]);

            // 2. Trigger AI Response (Fire and Forget or await if you want to show loading)
            // We await it here so isSubmitting stays true until AI processes, to prevent spam.
            // Or we can let it run in background. Let's await for better UX feedback flow.
            await handleAIResponse(newComment, userName);

        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const diff = Math.floor((new Date() - date) / 1000);
        if (diff < 60) return 'JUST NOW';
        if (diff < 3600) return `${Math.floor(diff / 60)} MINUTES AGO`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} HOURS AGO`;
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }).toUpperCase();
    };

    return (
        <div className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-8 md:p-12 shadow-sm relative overflow-hidden group h-full" id="Commentar">
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h3 className="text-3xl font-oswald font-bold uppercase text-black dark:text-white mb-1">
                        {t('discussion.title')}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium">{t('discussion.subtitle')} ({comments.length + (pinnedComment ? 1 : 0)})</p>
                </div>
                <div className="p-3 bg-black dark:bg-white rounded-full">
                    <MessageCircle className="w-5 h-5 text-white dark:text-black" />
                </div>
            </div>

            <div>
                <CommentForm onSubmit={handleCommentSubmit} isSubmitting={isSubmitting} t={t} />

                <div className="mt-16 space-y-0 max-h-[600px] overflow-y-auto custom-scrollbar border-t-2 border-gray-100 dark:border-zinc-800">
                    {pinnedComment && <Comment comment={pinnedComment} formatDate={formatDate} isPinned={true} t={t} />}
                    {comments.map((comment) => (
                        <Comment key={comment.id} comment={comment} formatDate={formatDate} t={t} />
                    ))}
                    {comments.length === 0 && !pinnedComment && (
                        <div className="text-center py-20">
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-lg">{t('discussion.noComments')}</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: #d1d5db; 
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: #3f3f46; 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
            `}</style>
        </div>
    );
};

export default Komentar;
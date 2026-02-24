import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { MessageCircle, UserCircle2, Loader2, Send, ImagePlus, X, Pin, Sparkles, Trash2 } from 'lucide-react';
import AOS from "aos";
import "aos/dist/aos.css";
import { supabase } from '../supabase';
import { useLanguage } from "../context/LanguageContext";
import MagneticButton from './MagneticButton';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Swal from 'sweetalert2';

const Comment = memo(({
    comment,
    formatDate,
    isPinned = false,
    t,
    onReply,
    activeReplyId,
    onCancelReply,
    onSubmitReply,
    isSubmitting,
    replies = [],
    onDelete
}) => {
    const viewerName = localStorage.getItem('commenter_name')?.toLowerCase() || '';
    const isOwnerName = (name) => {
        const n = name?.toLowerCase() || '';
        return n.includes('wardhani') || n.includes('ekizr') || n.includes('putra') || n.includes('rahmad');
    };

    const isCommentOwner = isOwnerName(comment.user_name);
    const isViewerAdmin = isOwnerName(viewerName);

    // Can delete if: Viewer is Admin, OR Viewer is the one who wrote the comment
    const canDelete = isViewerAdmin || (viewerName && viewerName === comment.user_name?.toLowerCase());

    // Display as Admin if: Comment was written by Owner, or it's pinned
    const isAdmin = isCommentOwner || isPinned;

    const isReplying = activeReplyId === comment.id;

    const handleDelete = async (e) => {
        e.stopPropagation();
        onDelete(comment.id);
    };

    return (
        <div className="border-b border-gray-100 dark:border-zinc-800 last:border-0">
            <div
                className={`px-6 py-6 transition-all duration-300 group ${isPinned
                    ? 'bg-black text-white dark:bg-white dark:text-black border-l-4 border-white dark:border-black'
                    : 'bg-transparent hover:bg-gray-50 dark:hover:bg-zinc-900/50'
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
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-black dark:border-white"
                                loading="lazy"
                            />
                        ) : (
                            <div className={`p-2 md:p-3 rounded-full ${isAdmin
                                ? 'bg-black text-white dark:bg-white dark:text-black'
                                : comment.user_name === 'Gemini AI'
                                    ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black'
                                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400'
                                }`}>
                                {comment.user_name === 'Gemini AI' ? <Sparkles className="w-5 h-5 md:w-6 md:h-6" /> : <UserCircle2 className="w-5 h-5 md:w-6 md:h-6" />}
                            </div>
                        )}
                    </div>

                    <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-3">
                                <h4 className={`font-bold font-oswald uppercase text-base md:text-lg ${isAdmin ? 'text-black dark:text-white' : (isPinned ? 'text-white dark:text-black' : 'text-black dark:text-white')}`}>
                                    {comment.user_name}
                                </h4>
                                {isAdmin && (
                                    <span className="px-2 py-0.5 text-[8px] md:text-[10px] bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider rounded">
                                        OWNER
                                    </span>
                                )}
                                {comment.user_name === 'Gemini AI' && (
                                    <span className="px-2 py-0.5 text-[8px] md:text-[10px] bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> AI
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] md:text-xs font-medium uppercase tracking-wider ${isPinned ? 'text-gray-300 dark:text-gray-600' : 'text-gray-400'}`}>
                                {formatDate(comment.created_at)}
                            </span>
                        </div>
                        <p className={`text-sm leading-relaxed mb-3 ${isPinned ? 'text-gray-200 dark:text-gray-800' : 'text-gray-700 dark:text-gray-300'}`}>
                            {comment.content}
                        </p>

                        <div className="flex items-center gap-4">
                            {!isPinned && onReply && (
                                <button
                                    onClick={() => onReply(comment)}
                                    className={`flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors ${isPinned ? 'text-white/70 hover:text-white' : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'}`}
                                >
                                    <Send className="w-3 h-3 rotate-45" />
                                    {isReplying ? 'CANCEL' : 'REPLY'}
                                </button>
                            )}

                            {canDelete && (
                                <button
                                    onClick={handleDelete}
                                    className={`flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors ${isPinned ? 'text-white/70 hover:text-red-400' : 'text-black/60 hover:text-red-500 dark:text-white/60 dark:hover:text-red-400'}`}
                                >
                                    <Trash2 className="w-3 h-3" />
                                    DELETE
                                </button>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Inline Reply Form - Positioned directly underneath parent for immediate feedback */}
            {isReplying && (
                <div className="mt-4 ml-6 md:ml-12 pl-4 md:pl-6 border-l-2 border-black dark:border-white animate-in fade-in slide-in-from-top-4 duration-300">
                    <CommentForm
                        onSubmit={onSubmitReply}
                        isSubmitting={isSubmitting}
                        t={t}
                        replyTo={comment}
                        onCancelReply={onCancelReply}
                    />
                </div>
            )}

            {/* Nested Replies */}
            {replies && replies.length > 0 && (
                <div className="ml-6 md:ml-12 border-l-2 border-black/10 dark:border-white/10 pl-4 md:pl-6 my-2">
                    {replies.map(reply => (
                        <Comment
                            key={reply.id}
                            comment={reply}
                            formatDate={formatDate}
                            t={t}
                            onReply={onReply}
                            activeReplyId={activeReplyId}
                            onCancelReply={onCancelReply}
                            onSubmitReply={onSubmitReply}
                            isSubmitting={isSubmitting}
                            replies={reply.replies}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
});

const CommentForm = memo(({ onSubmit, isSubmitting, t, replyTo, onCancelReply }) => {
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState(() => localStorage.getItem('commenter_name') || '');
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
        localStorage.setItem('commenter_name', userName);
        onSubmit({ newComment, userName, imageFile, parentId: replyTo?.id });
        setNewComment('');
        setImagePreview(null);
        setImageFile(null);
        if (onCancelReply) onCancelReply();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {replyTo && (
                <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-zinc-800 border-l-4 border-black dark:border-white">
                    <span className="text-xs font-bold text-black dark:text-white uppercase tracking-widest">
                        Replying to <span className="underline">{replyTo.user_name}</span>
                    </span>
                    <button onClick={onCancelReply} className="text-gray-400 hover:text-black dark:hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="relative group">
                    <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        placeholder={t('discussion.placeholderName')}
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full py-3 md:py-4 pl-12 pr-4 bg-gray-50 dark:bg-zinc-800/30 rounded-none border-b-2 border-transparent focus:border-black dark:focus:border-white outline-none text-black dark:text-white font-bold uppercase tracking-wider placeholder:text-gray-400 transition-all text-xs md:text-sm"
                        required
                    />
                </div>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-3 md:py-4 px-4 bg-gray-50 dark:bg-zinc-800/30 border-b-2 border-transparent hover:border-black dark:hover:border-white text-gray-400 hover:text-black dark:hover:text-white font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-xs md:text-sm rounded-none"
                    >
                        <ImagePlus className="w-4 h-4 md:w-5 md:h-5" />
                        {imagePreview ? t('discussion.changePhoto') : t('discussion.profilePhoto')}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                </div>
            </div>

            {imagePreview && (
                <div className="relative inline-block">
                    <img src={imagePreview} className="w-16 h-16 md:w-20 md:h-20 object-cover border-2 border-black dark:border-white" alt="preview" />
                    <button
                        type="button"
                        onClick={() => { setImagePreview(null); setImageFile(null); }}
                        className="absolute -top-2 -right-2 bg-black text-white p-1 hover:scale-110 transition-transform rounded-full"
                    >
                        <X className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                </div>
            )}

            <div className="relative">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={t('discussion.placeholderComment')}
                    className="w-full min-h-[100px] md:min-h-[120px] p-4 md:p-6 bg-gray-50 dark:bg-zinc-800/30 rounded-none border-b-2 border-transparent focus:border-black dark:focus:border-white outline-none text-black dark:text-white text-sm md:text-base font-medium resize-none transition-all placeholder:text-gray-400 placeholder:font-bold placeholder:uppercase placeholder:tracking-wider"
                    required
                />
            </div>

            <MagneticButton
                as="button"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 md:py-4 bg-black dark:bg-white text-white dark:text-black font-oswald font-bold uppercase tracking-widest text-base md:text-lg rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-black/10"
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
    const [replyTo, setReplyTo] = useState(null);
    const formRef = useRef(null);

    // Initialize Gemini AI safely
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

    useEffect(() => {
        AOS.init({ once: false });
        fetchData();

        // Polling for pseudo-realtime interaction every 5 seconds
        const pollInterval = setInterval(() => {
            fetchData();
        }, 5000);

        return () => {
            clearInterval(pollInterval);
        };
    }, []);

    const fetchData = async () => {
        try {
            const { data, error } = await supabase.from('portfolio_comments').select('*');
            if (error) {
                console.error("Fetch Failed", error);
                return;
            }
            if (data && Array.isArray(data)) {
                const pinned = data.find(c => String(c.is_pinned) === "1" || c.is_pinned === true);
                const regular = data.filter(c => String(c.is_pinned) !== "1" && c.is_pinned !== true);
                setPinnedComment(pinned);
                setComments(regular);
            }
        } catch (error) {
            console.error("Fetch exception:", error);
            console.warn("Discussion data currently unavailable");
        }
    };

    const handleReply = useCallback((comment) => {
        setReplyTo(prev => (prev?.id === comment.id ? null : comment));
    }, []);

    const handleCancelReply = useCallback(() => {
        setReplyTo(null);
    }, []);

    const handleCommentSubmit = async ({ newComment, userName, imageFile, parentId }) => {
        setIsSubmitting(true);

        // Optimistic Update for "Instant" feel
        const tempId = "temp-" + Date.now();
        const tempComment = {
            id: tempId,
            content: newComment,
            user_name: userName,
            created_at: new Date().toISOString(),
            is_pinned: false,
            parent_id: parentId || null,
            replies: []
        };

        // Add to state immediately
        setComments(prev => [...prev, tempComment]);

        // Close reply form instantly if it was a reply
        if (parentId) setReplyTo(null);

        try {
            let profileImageUrl = null;

            if (imageFile) {
                // Compress and convert image to Base64
                profileImageUrl = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = new Image();
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            let width = img.width;
                            let height = img.height;

                            // Max dimensions 800px
                            const MAX_WIDTH = 800;
                            const MAX_HEIGHT = 800;

                            if (width > height) {
                                if (width > MAX_WIDTH) {
                                    height *= MAX_WIDTH / width;
                                    width = MAX_WIDTH;
                                }
                            } else {
                                if (height > MAX_HEIGHT) {
                                    width *= MAX_HEIGHT / height;
                                    height = MAX_HEIGHT;
                                }
                            }

                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, width, height);

                            // High compression for profile shots
                            resolve(canvas.toDataURL('image/jpeg', 0.6));
                        };
                        img.onerror = () => resolve(null);
                        img.src = e.target.result;
                    };
                    reader.onerror = () => resolve(null);
                    reader.readAsDataURL(imageFile);

                    // Fail-safe: resolve after 5 seconds anyway
                    setTimeout(() => resolve(null), 5000);
                });
            }

            const { data, error } = await supabase.from('portfolio_comments').insert([{
                content: newComment,
                user_name: userName,
                profile_image: profileImageUrl,
                is_pinned: false,
                parent_id: parentId || null
            }]);

            if (error) throw error;

            await fetchData();

            if (!parentId) {
                setTimeout(() => {
                    const scrollContainer = document.querySelector('.custom-scrollbar');
                    if (scrollContainer) {
                        scrollContainer.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            }

            const isOwner = userName.toLowerCase().includes('wardhani') || userName.toLowerCase().includes('ekizr');
            if (!parentId && !isOwner && genAI) {
                try {
                    await handleAIResponse(newComment, userName);
                    await fetchData();
                } catch (aiErr) {
                    console.error("AI Response Error:", aiErr);
                }
            }

        } catch (error) {
            console.error("Submission error:", error);
            // Revert optimistic update on error
            setComments(prev => prev.filter(c => c.id !== tempId));

            Swal.fire({
                title: "Error!",
                text: "Failed to post comment. " + (error.message || "Please check your connection."),
                icon: "error",
                confirmButtonColor: "#000"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async (id) => {
        try {
            const { error } = await supabase.from('portfolio_comments').delete().eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleAIResponse = async (userComment, userName) => {
        if (!genAI) return;
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `
                You are an AI Assistant for Rahmad Eka Putra Wardhani's Portfolio Website.
                A user named "${userName}" just commented: "${userComment}".
                Please reply to them politely, professionally, and briefly (max 2-3 sentences).
                Answer that Rahmad is a Fullstack Developer student at Amikom University Yogyakarta.
                Keep it friendly.
            `;
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            if (text) {
                await supabase.from('portfolio_comments').insert([{
                    content: text,
                    user_name: 'Gemini AI',
                    profile_image: null,
                    is_pinned: false,
                }]);
            }
        } catch (error) {
            console.error("AI Error:", error);
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

    const commentTree = useMemo(() => {
        if (!Array.isArray(comments) || comments.length === 0) {
            return pinnedComment ? [{ ...pinnedComment, replies: [] }] : [];
        }

        const allComments = pinnedComment ? [pinnedComment, ...comments] : comments;

        const buildTree = (parentId = null) => {
            return allComments
                .filter(c => {
                    const pid = String(c.parent_id || "0");
                    const targetId = String(parentId || "0");
                    return pid === targetId;
                })
                .map(comment => ({
                    ...comment,
                    replies: buildTree(comment.id)
                }))
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Set everything to DESC (Newest First)
        };

        const tree = buildTree(null);

        // Ensure pinned comment stays at the very top of the list
        if (pinnedComment) {
            const pinnedIdx = tree.findIndex(c => String(c.id) === String(pinnedComment.id));
            if (pinnedIdx > -1) {
                const [pinnedNode] = tree.splice(pinnedIdx, 1);
                return [pinnedNode, ...tree];
            }
        }

        return tree;
    }, [comments, pinnedComment]);

    return (
        <div className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 md:p-12 shadow-2xl relative overflow-hidden group h-full transition-all duration-500 hover:border-black/50 dark:hover:border-white/50" id="Commentar">
            <div className="flex justify-between items-start mb-8 md:mb-12">
                <div data-aos="fade-right">
                    <h3 className="text-2xl md:text-4xl font-oswald font-bold uppercase text-black dark:text-white mb-2 tracking-tighter">
                        {t('discussion.title')}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-black dark:bg-white"></span>
                        <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                            {t('discussion.subtitle')} ({comments.length + (pinnedComment ? 1 : 0)})
                        </p>
                    </div>
                </div>
                <div className="p-3 md:p-4 bg-black dark:bg-white rounded-2xl shadow-lg shadow-black/20 dark:shadow-white/20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white dark:text-black" />
                </div>
            </div>

            <div className="relative z-10">
                {/* Main Input at the Top */}
                <div ref={formRef} className="mb-12 border-b-2 border-gray-100 dark:border-zinc-800 pb-12">
                    <CommentForm
                        onSubmit={handleCommentSubmit}
                        isSubmitting={isSubmitting}
                        t={t}
                        replyTo={null}
                        onCancelReply={null}
                    />
                </div>

                <div className="space-y-0 max-h-[800px] overflow-y-auto custom-scrollbar pr-2 md:pr-4">
                    {commentTree.length > 0 ? (
                        commentTree.map((commentNode) => (
                            <Comment
                                key={commentNode.id}
                                comment={commentNode}
                                formatDate={formatDate}
                                t={t}
                                onReply={handleReply}
                                activeReplyId={replyTo?.id}
                                onCancelReply={handleCancelReply}
                                onSubmitReply={handleCommentSubmit}
                                isSubmitting={isSubmitting}
                                replies={commentNode.replies}
                                isPinned={String(commentNode.is_pinned) === "1" || commentNode.is_pinned === true}
                                onDelete={handleDeleteComment}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-3xl" data-aos="zoom-in">
                            <div className="inline-block p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-full mb-4">
                                <MessageCircle className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">{t('discussion.noComments')}</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: #3f3f46; 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #000; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #fff; }
            `}</style>
        </div>
    );
};

export default Komentar;
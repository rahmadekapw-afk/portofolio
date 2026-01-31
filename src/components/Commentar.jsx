import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { MessageCircle, UserCircle2, Loader2, AlertCircle, Send, ImagePlus, X, Pin } from 'lucide-react';
import AOS from "aos";
import "aos/dist/aos.css";
import { supabase } from '../supabase';

const Comment = memo(({ comment, formatDate, isPinned = false }) => (
    <div
        className={`px-5 py-4 rounded-2xl border transition-all duration-300 group ${isPinned
            ? 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
            : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
            }`}
    >
        {isPinned && (
            <div className="flex items-center gap-2 mb-3 text-indigo-400">
                <Pin className="w-3.5 h-3.5 fill-current" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Pesan Tersemat</span>
            </div>
        )}
        <div className="flex items-start gap-4">
            <div className="relative inline-block flex-shrink-0">
                {comment.profile_image ? (
                    <img
                        src={comment.profile_image}
                        alt={comment.user_name}
                        className={`w-11 h-11 rounded-full object-cover border-2 ${isPinned ? 'border-indigo-500' : 'border-white/10'
                            }`}
                        loading="lazy"
                    />
                ) : (
                    <div className={`p-2.5 rounded-full ${isPinned ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-slate-400'}`}>
                        <UserCircle2 className="w-6 h-6" />
                    </div>
                )}
            </div>

            <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white text-sm md:text-base truncate">
                            {comment.user_name}
                        </h4>
                        {isPinned && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-indigo-500 text-white font-bold rounded">
                                ADMIN
                            </span>
                        )}
                    </div>
                    <span className="text-[11px] text-slate-500 whitespace-nowrap">
                        {formatDate(comment.created_at)}
                    </span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed break-words">
                    {comment.content}
                </p>
            </div>
        </div>
    </div>
));

const CommentForm = memo(({ onSubmit, isSubmitting }) => {
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const textareaRef = useRef(null);
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
        setUserName('');
        setImagePreview(null);
        setImageFile(null);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group">
                    <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Nama"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full py-2.5 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500/50 outline-none text-white text-sm transition-all"
                        required
                    />
                </div>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2.5 px-4 bg-white/5 border border-white/10 border-dashed rounded-xl text-slate-400 text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                        <ImagePlus className="w-4 h-4" />
                        {imagePreview ? 'Ganti Foto' : 'Foto Profil (Opsional)'}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                </div>
            </div>

            {imagePreview && (
                <div className="relative inline-block">
                    <img src={imagePreview} className="w-16 h-16 rounded-full border-2 border-indigo-500 object-cover" alt="preview" />
                    <button
                        onClick={() => { setImagePreview(null); setImageFile(null); }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-lg"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            )}

            <div className="relative">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tulis komentar..."
                    className="w-full min-h-[100px] p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-indigo-500/50 outline-none text-white text-sm transition-all resize-none"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {isSubmitting ? 'Mengirim...' : 'Kirim Komentar'}
            </button>
        </form>
    );
});

const Komentar = () => {
    const [comments, setComments] = useState([]);
    const [pinnedComment, setPinnedComment] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

            await supabase.from('portfolio_comments').insert([{
                content: newComment,
                user_name: userName,
                profile_image: profileImageUrl,
                is_pinned: false,
            }]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const diff = Math.floor((new Date() - date) / 1000);
        if (diff < 60) return 'Baru saja';
        if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="w-full bg-white/[0.02] backdrop-blur-3xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-500/20 rounded-xl">
                        <MessageCircle className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                        Diskusi <span className="text-indigo-400">({comments.length + (pinnedComment ? 1 : 0)})</span>
                    </h3>
                </div>
            </div>

            <div className="p-6">
                <CommentForm onSubmit={handleCommentSubmit} isSubmitting={isSubmitting} />

                <div className="mt-8 space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                    {pinnedComment && <Comment comment={pinnedComment} formatDate={formatDate} isPinned={true} />}
                    {comments.map((comment) => (
                        <Comment key={comment.id} comment={comment} formatDate={formatDate} />
                    ))}
                    {comments.length === 0 && !pinnedComment && (
                        <div className="text-center py-10">
                            <p className="text-slate-500 text-sm">Belum ada komentar. Jadilah yang pertama!</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: rgba(99, 102, 241, 0.2); 
                    border-radius: 10px; 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.4); }
            `}</style>
        </div>
    );
};

export default Komentar;
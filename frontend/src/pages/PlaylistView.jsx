import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Trash2, Pencil, Heart, AlertCircle, ListVideo } from 'lucide-react';

import VideoPlayer from '@/components/custom/Video/VideoPlayer';
import VideoMeta from '@/components/custom/Video/VideoMeta';
import AddComment from '@/components/custom/Video/AddComment';
import VideosSuggestion from '@/components/custom/Video/VideosSuggestion';
import PlaylistSidebar from '@/components/custom/Video/PlaylistSidebar';
import LoadingSpinner from '@/components/custom/LoadingSpinner';

function PlaylistView() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { playlistId, videoIndex } = useParams();
    const userData = useSelector((state) => state.auth.userData);
    const currentIndex = parseInt(videoIndex) || 0;
    console.log("PlaylistView Render:", { playlistId, videoIndex, currentIndex });

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [deleteModalId, setDeleteModalId] = useState(null);

    useEffect(() => {
        const handleGlobalClick = () => setActiveMenuId(null);
        window.addEventListener('click', handleGlobalClick);
        return () => window.removeEventListener('click', handleGlobalClick);
    }, []);

    const { data: playlist, isLoading: playlistLoading, isError: playlistError } = useQuery({
        queryKey: ['playlist', playlistId],
        queryFn: async () => {
            const playlistRes = await axios.get(
                `http://localhost:8000/api/v1/playlist/${playlistId}`,
                { withCredentials: true }
            );
            return playlistRes.data.data;
        },
        retry: false,
    });

    const currentVideo = playlist?.videos?.[currentIndex];
    const videoId = currentVideo?._id;
    const channelId = currentVideo?.owner?._id;

    console.log("currentvideo is ::", currentVideo);

    const { data: videoDetails, isLoading: videoLoading } = useQuery({
        queryKey: ['video', videoId, channelId],
        queryFn: async () => {
            const res = await axios.get(
                `http://localhost:8000/api/v1/videos/${videoId}/${channelId}`,
                { withCredentials: true }
            );
            return res.data.data;
        },
        enabled: !!videoId && !!channelId,
        retry: false,
    });

    const { data: comments, isLoading: commentsLoading } = useQuery({
        queryKey: ['comment', videoId],
        queryFn: async () => {
            const res = await axios.get(
                `http://localhost:8000/api/v1/comments/${videoId}`,
                { withCredentials: true }
            );
            return res.data.data.docs;
        },
        enabled: !!videoId,
    });

    const { mutate: toggleLike } = useMutation({
        mutationFn: async (commentId) => {
            const res = await axios.post(
                `http://localhost:8000/api/v1/likes/toggle/c/${commentId}`,
                {},
                { withCredentials: true }
            );
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries(['comment', videoId]),
    });

    const { mutate: deleteUserComment } = useMutation({
        mutationFn: async (commentId) => {
            await axios.delete(
                `http://localhost:8000/api/v1/comments/c/${commentId}`,
                { withCredentials: true }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['comment', videoId]);
            setDeleteModalId(null);
        },
    });

    const { mutate: updateUserComment } = useMutation({
        mutationFn: async ({ commentId, content }) => {
            await axios.patch(
                `http://localhost:8000/api/v1/comments/c/${commentId}`,
                { newContent: content },
                { withCredentials: true }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['comment', videoId]);
            setEditingCommentId(null);
            setEditingContent('');
        },
    });

    const handleVideoSelect = (index) => {
        navigate(`/playlist/${playlistId}/${index}`);
    };

    const handleStartEdit = (comment, e) => {
        e.stopPropagation();
        setEditingCommentId(comment._id);
        setEditingContent(comment.content);
        setActiveMenuId(null);
    };

    const submitEdit = () => {
        if (!editingContent.trim()) return;
        updateUserComment({ commentId: editingCommentId, content: editingContent });
    };

    const toggleMenu = (e, commentId) => {
        e.stopPropagation();
        setActiveMenuId(activeMenuId === commentId ? null : commentId);
    };

    const requestDelete = (e, commentId) => {
        e.stopPropagation();
        setActiveMenuId(null);
        setDeleteModalId(commentId);
    };

    const confirmDelete = () => {
        if (deleteModalId) deleteUserComment(deleteModalId);
    };

    if (playlistLoading) {
        return <LoadingSpinner />;
    }

    if (playlistError || !playlist) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#050508] text-white p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center">
                        <AlertCircle className="w-10 h-10 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-semibold">Playlist Not Found</h1>
                    <p className="text-zinc-400 text-center max-w-sm">
                        This playlist doesn't exist or has been deleted.
                    </p>
                </motion.div>
            </div>
        );
    }

    if (!playlist.videos || playlist.videos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#050508] text-white p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                        <ListVideo className="w-10 h-10 text-violet-400" />
                    </div>
                    <h1 className="text-2xl font-semibold">Empty Playlist</h1>
                    <p className="text-zinc-400 text-center max-w-sm">
                        This playlist doesn't have any videos yet.
                    </p>
                </motion.div>
            </div>
        );
    }

    const video = videoDetails?.video?.[0] || currentVideo;

    return (
        <div className="w-full bg-[#050508] min-h-screen text-white">
            <AnimatePresence>
                {deleteModalId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card w-full max-w-sm rounded-2xl p-6 mx-4"
                        >
                            <h3 className="text-lg font-bold text-white mb-2">Delete comment?</h3>
                            <p className="text-zinc-400 text-sm mb-6">
                                This will permanently delete your comment.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setDeleteModalId(null)}
                                    className="px-4 py-2 text-sm font-medium rounded-xl text-white hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 text-sm font-medium rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px] gap-4 sm:gap-6 px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
                <div className="flex flex-col gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="aspect-video bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/5"
                    >
                        {videoLoading ? (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                                    <span className="text-zinc-400 text-sm">Loading video...</span>
                                </div>
                            </div>
                        ) : video ? (
                            <VideoPlayer {...video} videoId={videoId} />
                        ) : null}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="pb-4 border-b border-white/5"
                    >
                        {videoLoading ? (
                            <div className="space-y-3 animate-pulse">
                                <div className="h-6 bg-zinc-800 rounded-lg w-3/4" />
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800" />
                                    <div className="h-4 bg-zinc-800 rounded w-24" />
                                </div>
                            </div>
                        ) : videoDetails ? (
                            <VideoMeta
                                isSubscribed={videoDetails.isSubscribed}
                                isLiked={videoDetails.isLiked}
                                {...video}
                            />
                        ) : video ? (
                            <div className="space-y-2">
                                <h1 className="text-lg sm:text-xl font-bold text-white">{video.title}</h1>
                                <p className="text-sm text-zinc-400">{video.views} views</p>
                            </div>
                        ) : null}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col gap-6 mt-2"
                    >
                        <h2 className="text-lg font-semibold text-white">
                            {comments?.length || 0} Comments
                        </h2>

                        <AddComment videoId={videoId} />

                        <div className="flex flex-col gap-4">
                            {comments && comments.length > 0 ? (
                                comments.map((comment, index) => {
                                    const isOwner = comment.owner._id === userData?._id;

                                    return (
                                        <motion.div
                                            key={comment._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group relative"
                                        >
                                            {editingCommentId === comment._id ? (
                                                <div className="flex gap-3 py-2">
                                                    <img
                                                        src={comment.owner?.avatar || 'https://ui-avatars.com/api/?rounded=true&size=64'}
                                                        alt={comment.owner?.username}
                                                        className="w-10 h-10 rounded-full object-cover opacity-50"
                                                    />
                                                    <div className="flex flex-col gap-3 flex-1">
                                                        <textarea
                                                            value={editingContent}
                                                            onChange={(e) => setEditingContent(e.target.value)}
                                                            className="w-full bg-white/5 text-white text-sm border border-white/10 rounded-xl p-3 focus:border-violet-500/50 focus:outline-none resize-none min-h-[80px]"
                                                            autoFocus
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setEditingCommentId(null); }}
                                                                className="px-4 py-2 text-sm font-medium rounded-xl text-zinc-400 hover:bg-white/5 transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); submitEdit(); }}
                                                                disabled={!editingContent.trim()}
                                                                className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${editingContent.trim() ? 'bg-violet-600 hover:bg-violet-500 text-white' : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'}`}
                                                            >
                                                                Save
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                                                    <img
                                                        src={comment.owner?.avatar || 'https://ui-avatars.com/api/?rounded=true&size=64'}
                                                        alt={comment.owner?.username}
                                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-violet-500/30 transition-all cursor-pointer"
                                                    />

                                                    <div className="flex flex-col gap-1.5 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-white hover:text-violet-400 cursor-pointer transition-colors">
                                                                @{comment.owner?.username}
                                                            </span>
                                                            <span className="text-xs text-zinc-500">
                                                                {new Date(comment.createdAt).toLocaleDateString(undefined, {
                                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>

                                                        <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                                                            {comment.content}
                                                        </p>

                                                        <div className="flex items-center gap-3 mt-1">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); toggleLike(comment._id); }}
                                                                className="flex items-center gap-1.5 group/like"
                                                            >
                                                                <Heart
                                                                    size={16}
                                                                    className={`transition-all duration-200 ${comment.isLiked ? 'fill-red-500 text-red-500' : 'text-zinc-500 group-hover/like:text-red-400'}`}
                                                                />
                                                                <span className={`text-xs ${comment.isLiked ? 'text-white' : 'text-zinc-500'}`}>
                                                                    {comment.likeCount}
                                                                </span>
                                                            </button>
                                                        </div>

                                                        {isOwner && (
                                                            <div className="absolute top-3 right-3">
                                                                <button
                                                                    onClick={(e) => toggleMenu(e, comment._id)}
                                                                    className={`p-1.5 rounded-lg transition-colors ${activeMenuId === comment._id ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100'}`}
                                                                >
                                                                    <MoreVertical size={18} />
                                                                </button>

                                                                <AnimatePresence>
                                                                    {activeMenuId === comment._id && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                                            animate={{ opacity: 1, scale: 1 }}
                                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                                            className="absolute right-0 top-full mt-1 z-10 w-32 glass-card rounded-xl py-1 shadow-xl"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            <button
                                                                                onClick={(e) => handleStartEdit(comment, e)}
                                                                                className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-3 text-sm transition-colors"
                                                                            >
                                                                                <Pencil size={14} /> Edit
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) => requestDelete(e, comment._id)}
                                                                                className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-3 text-red-400 text-sm transition-colors"
                                                                            >
                                                                                <Trash2 size={14} /> Delete
                                                                            </button>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12 text-zinc-500">
                                    No comments yet. Be the first to comment!
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:hidden mt-6"
                    >
                        <PlaylistSidebar
                            playlist={playlist}
                            currentVideoIndex={currentIndex}
                            onVideoSelect={handleVideoSelect}
                        />
                        <VideosSuggestion videoId={videoId} />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="hidden lg:block sticky top-20 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar"
                >
                    <PlaylistSidebar
                        playlist={playlist}
                        currentVideoIndex={currentIndex}
                        onVideoSelect={handleVideoSelect}
                    />
                    <VideosSuggestion />
                </motion.div>
            </div>
        </div>
    );
}

export default PlaylistView;

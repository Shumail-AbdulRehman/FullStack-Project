import VideoMeta from '@/components/custom/Video/VideoMeta';
import VideoPlayer from '@/components/custom/Video/VideoPlayer';
import VideosSuggestion from '@/components/custom/Video/VideosSuggestion';
import AddComment from '@/components/custom/Video/AddComment';
import LoadingSpinner from '@/components/custom/LoadingSpinner';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { MoreVertical, Trash2, Pencil, Heart } from 'lucide-react';

function Video() {
  const queryClient = useQueryClient();
  const { videoId, channelId } = useParams();
  const userData = useSelector((state) => state.auth.userData);
  
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);

  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveMenuId(null);
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const { data: video, isLoading: videoLoading, isError } = useQuery({
    queryKey: ['video', videoId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/videos/${videoId}/${channelId}`,
        { withCredentials: true }
      );
      return res.data.data;
    },
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
    onSuccess: () => {
      queryClient.invalidateQueries(['comment', videoId]); 
    }
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
    if (deleteModalId) {
      deleteUserComment(deleteModalId);
    }
  };

  if (videoLoading || commentsLoading) {
    return (
      <div className="h-screen w-full bg-[#0f0f0f] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f0f] text-white p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold">Video Unavailable</h1>
          <p className="text-zinc-400">
            This video is private, deleted, or does not exist.
          </p>
        </div>
      </div>
    );
  }

  if (!video || !video.video || !video.video[0]) {
    return <div className="text-white p-10 bg-zinc-950 min-h-screen">No video data found</div>;
  }

  return (
    <div className="w-full bg-zinc-950 min-h-screen text-white">
      
      {deleteModalId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-[#212121] w-full max-w-sm rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/5 flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Delete comment?</h3>
              <p className="text-zinc-400 text-sm">
                This will permanently delete your comment and cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setDeleteModalId(null)}
                className="px-4 py-2 text-sm font-medium rounded-full text-white hover:bg-[#3f3f3f] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium rounded-full bg-[#3ea6ff] hover:bg-[#65b8ff] text-black transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1800px]  grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-0 px-4 py-6">
        
        <div className="flex flex-col pl-5  gap-4 w-full min-w-0">
          <div className="w-6xl aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-white/10">
            <VideoPlayer {...video.video[0]} videoId={videoId} />
          </div>

          <div className="pb-4  border-b border-zinc-800">
            <VideoMeta
              isSubscribed={video.isSubscribed}
              isLiked={video.isLiked}
              {...video.video[0]}
            />
          </div>

          <div className="flex  flex-col gap-6 mt-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {comments?.length || 0} Comments
              </h2>
              <AddComment videoId={videoId} />
            </div>

            <div className="flex flex-col gap-5">
              {comments && comments.length > 0 ? (
                comments.map((comment) => {
                  const isOwner = comment.owner._id === userData?._id;

                  return (
                    <div key={comment._id} className="w-full group relative">
                      {editingCommentId === comment._id ? (
                        <div className="flex gap-4 py-2 w-full pl-2">
                           <img
                            src={comment.owner?.avatar || 'https://ui-avatars.com/api/?rounded=true&size=64'}
                            alt={comment.owner?.username}
                            className="w-10 h-10 rounded-full object-cover opacity-50"
                          />
                          <div className="flex flex-col gap-3 w-full">
                            <textarea
                              value={editingContent}
                              onChange={(e) => setEditingContent(e.target.value)}
                              className="w-full bg-transparent text-white text-[15px] border-b border-zinc-500 focus:border-[#3ea6ff] focus:border-b-2 focus:outline-none pb-2 resize-y min-h-[40px] transition-all"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); setEditingCommentId(null); }}
                                className="px-4 py-2 text-sm font-medium rounded-full text-white hover:bg-zinc-700 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); submitEdit(); }}
                                disabled={!editingContent.trim()}
                                className={`px-4 py-2 text-sm font-medium rounded-full text-black transition-colors ${
                                  editingContent.trim() 
                                    ? 'bg-[#3ea6ff] hover:bg-[#65b8ff]' 
                                    : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                                }`}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-4 items-start w-full">
                          <img
                            src={comment.owner?.avatar || 'https://ui-avatars.com/api/?rounded=true&size=64'}
                            alt={comment.owner?.username}
                            className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-90 mt-1"
                          />
                          
                          <div className="flex flex-col gap-1 w-full relative">
                            <div className="flex items-baseline gap-2">
                              <span className="text-[13px] font-bold text-white cursor-pointer hover:underline">
                                @{comment.owner?.username}
                              </span>
                              <span className="text-[12px] text-zinc-400">
                                {new Date(comment.createdAt).toLocaleDateString(undefined, {
                                  year: 'numeric', month: 'short', day: 'numeric' 
                                })}
                              </span>
                            </div>

                            <p className="text-[15px] text-[#f1f1f1] leading-relaxed whitespace-pre-wrap pr-8">
                              {comment.content}
                            </p>

                            <div className="flex items-center gap-2 mt-1.5">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLike(comment._id);
                                  }}
                                  className="group flex items-center gap-1.5"
                                >
                                  <Heart 
                                    size={16} 
                                    className={`transition-all duration-200 ease-in-out active:scale-75 ${
                                      comment.isLiked 
                                        ? "fill-red-600 text-red-600" 
                                        : "text-zinc-400 group-hover:text-white"
                                    }`} 
                                  />
                                  <span className={`text-xs ${comment.isLiked ? "text-white" : "text-zinc-400"}`}>
                                      {comment.likeCount}
                                  </span>
                                </button>
                            </div>

                            {isOwner && (
                              <div className="absolute top-0 right-0">
                                <button
                                  onClick={(e) => toggleMenu(e, comment._id)}
                                  className={`p-1.5 rounded-full transition-colors ${
                                    activeMenuId === comment._id 
                                      ? 'bg-zinc-800 text-white' 
                                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                                  }`}
                                >
                                  <MoreVertical size={18} />
                                </button>

                                {activeMenuId === comment._id && (
                                  <div 
                                    className="absolute right-0 top-full mt-1 z-10 w-32 bg-[#282828] rounded-xl shadow-xl border border-zinc-700 py-2 overflow-hidden"
                                    onClick={(e) => e.stopPropagation()} 
                                  >
                                    <div className="flex flex-col">
                                      <button
                                        onClick={(e) => handleStartEdit(comment, e)}
                                        className="w-full text-left px-4 py-2 hover:bg-zinc-700 flex items-center gap-3 text-zinc-200 text-sm transition-colors"
                                      >
                                        <Pencil size={16} /> Edit
                                      </button>
                                      <button
                                        onClick={(e) => requestDelete(e, comment._id)}
                                        className="w-full text-left px-4 py-2 hover:bg-zinc-700 flex items-center gap-3 text-zinc-200 text-sm transition-colors"
                                      >
                                        <Trash2 size={16} /> Delete
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-white text-lg">
                  No comments yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full   ">
          <VideosSuggestion {...video} />
        </div>

      </div>
    </div>
  );
}

export default Video;
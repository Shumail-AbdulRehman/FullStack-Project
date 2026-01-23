import React, { useState } from 'react';
import CreatePlaylist from './CreatePlaylist';
import VideoCard from '../VideoCard';
import { useSelector } from 'react-redux';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  ListVideo,
  Plus,
  MoreVertical,
  Trash2,
  X,
  AlertTriangle,
} from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';

import { motion, AnimatePresence } from 'framer-motion';

function Playlist({ channelId }) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [activeMenu, setActiveMenu] = useState(null);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const queryClient = useQueryClient();


  const { data: userVideos, isLoading } = useQuery({
    queryKey: ['userVidoes', userData?._id],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/videos/c/${userData?._id}`,
        { withCredentials: true }
      );
      return res.data.data;
    },
  });

  const { data: playlists = [] } = useQuery({

    queryKey: ['playlists', channelId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/playlist/user/${channelId}`,
        { withCredentials: true }
      );
      return res.data.data;
    },

    enabled: !!channelId,
  });

  const handleDeletePlaylist = async () => {
    if (!playlistToDelete) return;
    try {

      await axios.delete(
        `http://localhost:8000/api/v1/playlist/${playlistToDelete._id}`,
        { withCredentials: true }
      );
      queryClient.invalidateQueries(['playlists', userData?._id]);
    } catch (error) {
    } finally {
      setPlaylistToDelete(null);
      setActiveMenu(null);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (

    <div className="min-h-screen bg-[#050508] text-white relative">
      {userData?._id == channelId && (
        <div className="border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                  <ListVideo className="w-7 h-7 text-violet-400" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">
                    My Playlists
                  </h1>
                  <p className="text-zinc-400 text-sm mt-1">
                    Organize your videos into collections
                  </p>
                </div>
              </div>
              {userData?._id == channelId && (
                <CreatePlaylist userVideos={userVideos} channelId={userData?._id} />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                <ListVideo className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Total Playlists</p>
                <p className="text-2xl font-bold text-white">{playlists?.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <Plus className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Available Videos</p>
                <p className="text-2xl font-bold text-white">{userVideos?.length || 0}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {playlists?.length > 0 ? (
          <div>

            <h2 className="text-xl font-semibold mb-6 text-white">Your Playlists</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {playlists?.map((playlist, index) => (
                <motion.div
                  key={playlist?._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/playlist/${playlist._id}/0`)}
                  className="group relative cursor-pointer glass-card rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
                >
                  <div className="absolute top-3 right-3 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === playlist._id ? null : playlist._id);
                      }}
                      className="p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white transition-colors backdrop-blur-sm"
                    >
                      <MoreVertical size={16} />
                    </button>

                    <AnimatePresence>
                      {activeMenu === playlist._id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-40 glass-card rounded-xl overflow-hidden z-30"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPlaylistToDelete(playlist);
                              setActiveMenu(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-white/5 flex items-center gap-2 transition-colors"
                          >
                            <Trash2 size={14} />
                            Delete Playlist
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={playlist.videos[0]?.thumbnail || 'https://placehold.co/600x400'}
                      alt={playlist.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center gap-2">
                      <ListVideo size={14} className="text-violet-400" />
                      <span className="text-xs font-medium text-white">
                        {playlist.videoCount} videos
                      </span>
                    </div>
                  </div>

                  <div className="p-4">

                    <h3 className="text-base font-semibold text-white group-hover:text-violet-400 transition-colors line-clamp-2 mb-1">
                      {playlist.name}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Updated {new Date(playlist.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center mb-6">
              <ListVideo className="w-10 h-10 text-zinc-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No playlists yet</h2>
            {userData?._id == channelId && (
              <>
                <p className="text-zinc-400 mb-6 max-w-sm">
                  Create your first playlist to organize your videos
                </p>
                <CreatePlaylist userVideos={userVideos} channelId={userData._id} />
              </>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {playlistToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md glass-card rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <button
                  onClick={() => setPlaylistToDelete(null)}
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Delete Playlist?</h3>
              <p className="text-zinc-400 mb-6">
                Are you sure you want to delete{' '}
                <span className="text-white font-semibold">"{playlistToDelete.name}"</span>?
                This action cannot be undone.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setPlaylistToDelete(null)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePlaylist}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-500 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Playlist;

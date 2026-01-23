import React, { useState } from 'react';
import CreatePlaylist from './CreatePlaylist';
import VideoCard from '../VideoCard';
import { useSelector } from 'react-redux';
<<<<<<< HEAD
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import {
  ListVideo,
  Plus,
  FolderOpen,
=======
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  ListVideo,
  Plus,
>>>>>>> 4d1eafa (impoved frontend UI)
  MoreVertical,
  Trash2,
  X,
  AlertTriangle,
} from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';
<<<<<<< HEAD

function Playlist({channelId}) {
=======
import { motion, AnimatePresence } from 'framer-motion';

function Playlist({ channelId }) {
  const navigate = useNavigate();
>>>>>>> 4d1eafa (impoved frontend UI)
  const userData = useSelector((state) => state.auth.userData);
  const [activeMenu, setActiveMenu] = useState(null);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const queryClient = useQueryClient();

<<<<<<< HEAD
  
=======
>>>>>>> 4d1eafa (impoved frontend UI)
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
<<<<<<< HEAD
    queryKey: ['playlists', userData?._id],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/playlist/user/${userData?._id}`,
=======
    queryKey: ['playlists', channelId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/playlist/user/${channelId}`,
>>>>>>> 4d1eafa (impoved frontend UI)
        { withCredentials: true }
      );
      return res.data.data;
    },
<<<<<<< HEAD
=======
    enabled: !!channelId,
>>>>>>> 4d1eafa (impoved frontend UI)
  });

  const handleDeletePlaylist = async () => {
    if (!playlistToDelete) return;
    try {
<<<<<<< HEAD
      console.log('Deleting playlist with ID:', playlistToDelete._id);

      const res = await axios.delete(
        `http://localhost:8000/api/v1/playlist/${playlistToDelete._id}`,
        { withCredentials: true }
      );

      console.log('deleted playlist res is ::', res.data);

      queryClient.invalidateQueries(['playlists', userData?._id]);
    } catch (error) {
      console.error('Error deleting playlist', error);
=======
      await axios.delete(
        `http://localhost:8000/api/v1/playlist/${playlistToDelete._id}`,
        { withCredentials: true }
      );
      queryClient.invalidateQueries(['playlists', userData?._id]);
    } catch (error) {
>>>>>>> 4d1eafa (impoved frontend UI)
    } finally {
      setPlaylistToDelete(null);
      setActiveMenu(null);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-zinc-950 text-white relative">
      {userData?._id == channelId && (
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
                <ListVideo size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  My Playlists
                </h1>
                <p className="text-zinc-400 mt-1">
                  Organize your videos into collections
                </p>
              </div>
            </div>
            {userData?._id == channelId &&(             <CreatePlaylist userVideos={userVideos} channelId={userData?._id} />
)}
          </div>
        </div>
      </div>
      )}
      

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <ListVideo size={24} className="text-blue-500" />
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Total Playlists</p>
                <p className="text-2xl font-bold text-white">
                  {playlists?.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <Plus size={24} className="text-green-500" />
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Available Videos</p>
                <p className="text-2xl font-bold text-white">
                  {userVideos?.length || 0}
                </p>
              </div>
            </div>
          </div>
=======
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
>>>>>>> 4d1eafa (impoved frontend UI)
        </div>

        {playlists?.length > 0 ? (
          <div>
<<<<<<< HEAD
            <h2 className="text-2xl font-bold mb-6 text-white">
              Your Playlists
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {playlists?.map((playlist) => (
                <div
                  key={playlist?._id}
                  className="group relative cursor-pointer bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20 transform hover:scale-[1.02]"
                >
                  <div className="absolute top-2 right-2 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(
                          activeMenu === playlist._id ? null : playlist._id
                        );
                      }}
                      className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeMenu === playlist._id && (
                      <div className="absolute right-0 mt-2 w-40 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden z-30">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlaylistToDelete(playlist);
                            setActiveMenu(null);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-zinc-800 hover:text-red-300 flex items-center gap-2 transition-colors"
                        >
                          <Trash2 size={16} />
                          Delete Playlist
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="relative aspect-video overflow-hidden bg-zinc-800">
                    <img
                      src={
                        playlist.videos[0]?.thumbnail ||
                        'https://placehold.co/600x400'
                      }
                      alt={playlist.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                      <ListVideo size={14} className="text-white" />
                      <span className="text-sm font-semibold text-white">
=======
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
>>>>>>> 4d1eafa (impoved frontend UI)
                        {playlist.videoCount} videos
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
<<<<<<< HEAD
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                      {playlist.name}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      Updated{' '}
                      {new Date(playlist.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
=======
                    <h3 className="text-base font-semibold text-white group-hover:text-violet-400 transition-colors line-clamp-2 mb-1">
                      {playlist.name}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Updated {new Date(playlist.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
>>>>>>> 4d1eafa (impoved frontend UI)
              ))}
            </div>
          </div>
        ) : (
<<<<<<< HEAD
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-6 bg-zinc-900 rounded-full mb-6">
              <ListVideo size={64} className="text-zinc-700" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              No playlists yet
            </h2>
           {userData?._id == channelId && (
            <p className="text-zinc-400 text-lg mb-8 max-w-md">
              Create your first playlist to organize your videos and share
              collections with others
            </p>
           )}
            
             {userData?._id == channelId && (             <CreatePlaylist userVideos={userVideos} channelId={userData._id} />
)}
          </div>
        )}
      </div>

      {playlistToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl transform transition-all scale-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/10 rounded-full">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
              <button
                onClick={() => setPlaylistToDelete(null)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Delete Playlist?
            </h3>
            <p className="text-zinc-400 mb-6">
              Are you sure you want to delete{' '}
              <span className="text-white font-semibold">
                "{playlistToDelete.name}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setPlaylistToDelete(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePlaylist}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
=======
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
>>>>>>> 4d1eafa (impoved frontend UI)
    </div>
  );
}

export default Playlist;

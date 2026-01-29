import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Trash2, Pencil, Loader2, Video, Heart, Eye, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import SideBar from '@/components/custom/SideBar';
import LoadingSpinner from '@/components/custom/LoadingSpinner';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const userData = useSelector((state) => state.auth.userData);
  const queryClient = useQueryClient();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: dashboardData, isPending: dashboardPending } = useQuery({
    queryKey: ['DashboardData', userData?._id],
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/api/v1/dashboard/stats`,
        { withCredentials: true }
      );
      return res.data.data;
    },
  });

  const { mutate: toggelPublishVideo, isPending: publishVideoPending } = useMutation({
    mutationFn: async (id) => {
      const res = await axios.patch(
        `${API_URL}/api/v1/videos/toggle/publish/${id}`,
        {},
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      if (userData?._id)
        queryClient.invalidateQueries(['DashboardData', userData._id]);
    },
  });

  const { mutate: deleteVideo, isPending: deleteVideoPending } = useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(
        `${API_URL}/api/v1/videos/${id}/${userData?._id}`,
        { withCredentials: true }
      );
      return res.data.data;
    },
    onSuccess: () => {
      if (userData?._id)
        queryClient.invalidateQueries(['DashboardData', userData._id]);
    },
  });

  const handleDelete = (id) => deleteVideo(id);
  const handleTogglePublish = (id) => toggelPublishVideo(id);

  const handleEdit = (video) => {
    setSelectedVideo(video);
    setThumbnailPreview(video.thumbnail);
    reset({
      title: video.title,
      description: video.description
    });
    setIsModalOpen(true);
  };

  const { register, handleSubmit, reset } = useForm();

  const { mutate: updateVideo, isPending: updateVideoPending } = useMutation({
    mutationFn: async ({ formData, videoId }) => {
      const res = await axios.patch(
        `${API_URL}/api/v1/videos/${videoId}/${userData?._id}`,
        formData,
        { withCredentials: true }
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['DashboardData', userData._id]);
      setIsModalOpen(false);
      setSelectedVideo(null);
      setThumbnailPreview(null);
      reset();
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    if (data.thumbnail?.[0]) {
      formData.append('thumbnail', data.thumbnail[0]);
    }
    formData.append('title', data.title);
    formData.append('description', data.description);
    updateVideo({ formData, videoId: selectedVideo._id });
  };

  useEffect(() => {
    if (selectedVideo) {
      reset({
        title: selectedVideo.title,
        description: selectedVideo.description,
      });
      setThumbnailPreview(selectedVideo.thumbnail);
    }
  }, [selectedVideo, reset]);

  if (deleteVideoPending || dashboardPending || publishVideoPending) {
    return <LoadingSpinner />;
  }

  const stats = [
    { label: 'Total Videos', value: dashboardData?.userVideosCount || 0, icon: Video, color: 'violet' },
    { label: 'Total Likes', value: dashboardData?.totalLikesOnVideos || 0, icon: Heart, color: 'pink' },
    { label: 'Total Views', value: dashboardData?.totalVideoViews || 0, icon: Eye, color: 'blue' },
    { label: 'Subscribers', value: dashboardData?.totalChannelSubscribers || 0, icon: Users, color: 'green' },
  ];

  const colorClasses = {
    violet: 'from-violet-500/20 to-purple-500/20 text-violet-400',
    pink: 'from-pink-500/20 to-rose-500/20 text-pink-400',
    blue: 'from-blue-500/20 to-cyan-500/20 text-blue-400',
    green: 'from-green-500/20 to-emerald-500/20 text-green-400',
  };

  return (
    <div className="flex min-h-screen bg-[#050508]">
      <aside className="w-64 hidden lg:block">
        <SideBar />
      </aside>

      <main className="flex-1 text-white p-3 sm:p-4 lg:p-8 min-w-0">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">Your channel analytics</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8 lg:mb-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-zinc-400 text-xs sm:text-sm mb-1 truncate">{stat.label}</p>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">{stat.value.toLocaleString()}</h2>
                  </div>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-gradient-to-br ${colorClasses[stat.color]} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6"
        >
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
            <Video className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />
            Your Uploaded Videos
          </h2>

          <div className="md:hidden space-y-3">
            {dashboardData?.userVideosAndLikeCountOfEachVideo?.length ? (
              dashboardData.userVideosAndLikeCountOfEachVideo.map((video) => (
                <motion.div
                  key={video._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/5 rounded-xl p-3 border border-white/5"
                >
                  <div className="flex gap-3 mb-3">
                    <img
                      src={video.thumbnail}
                      alt="thumb"
                      className="w-20 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm line-clamp-2 leading-tight">
                        {video.title}
                      </p>
                      <p className="text-zinc-500 text-xs mt-1">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleTogglePublish(video._id)}
                        className={`w-10 h-6 rounded-full flex items-center transition-all duration-300 p-0.5 ${video.isPublished ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-zinc-700'}`}
                      >
                        <motion.div
                          animate={{ x: video.isPublished ? 16 : 0 }}
                          className="w-5 h-5 bg-white rounded-full shadow-lg"
                        />
                      </button>
                      <span className={`text-xs font-medium ${video.isPublished ? 'text-green-400' : 'text-zinc-500'}`}>
                        {video.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-green-400 text-xs font-medium mr-2">
                        ♥ {video.likeCount || 0}
                      </span>
                      <button
                        onClick={() => handleEdit(video)}
                        className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-yellow-400 transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(video._id)}
                        className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-zinc-500">
                No videos uploaded yet.
              </div>
            )}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-4 text-zinc-400 text-sm font-medium">Status</th>
                  <th className="pb-4 text-zinc-400 text-sm font-medium">Video</th>
                  <th className="pb-4 text-zinc-400 text-sm font-medium">Likes</th>
                  <th className="pb-4 text-zinc-400 text-sm font-medium">Uploaded</th>
                  <th className="pb-4 text-zinc-400 text-sm font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.userVideosAndLikeCountOfEachVideo?.length ? (
                  dashboardData.userVideosAndLikeCountOfEachVideo.map((video) => (
                    <motion.tr
                      key={video._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4">
                        <button
                          onClick={() => handleTogglePublish(video._id)}
                          className={`w-12 h-7 rounded-full flex items-center transition-all duration-300 p-1 ${video.isPublished ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-zinc-700'}`}
                        >
                          <motion.div
                            animate={{ x: video.isPublished ? 20 : 0 }}
                            className="w-5 h-5 bg-white rounded-full shadow-lg"
                          />
                        </button>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img src={video.thumbnail} alt="thumb" className="w-20 h-12 rounded-lg object-cover" />
                          <span className="font-medium line-clamp-2 max-w-[300px]">{video.title}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-green-400 font-medium">{video.likeCount || 0}</span>
                      </td>
                      <td className="py-4 text-zinc-400">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleEdit(video)} className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-yellow-400 transition-colors">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => handleDelete(video._id)} className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-red-400 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-zinc-500">
                      No videos uploaded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg glass-card border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold gradient-text">Edit Video</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Update your video details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div>
              <label className="block text-zinc-300 text-sm mb-2">Thumbnail</label>
              {thumbnailPreview && (
                <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-36 object-cover rounded-xl border border-white/10 mb-3" />
              )}
              <input
                type="file"
                accept="image/*"
                {...register('thumbnail')}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setThumbnailPreview(URL.createObjectURL(file));
                }}
                className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-violet-500/20 file:text-violet-400 hover:file:bg-violet-500/30 file:cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-zinc-300 text-sm mb-2">Title</label>
              <Input {...register('title', { required: true })} className="bg-white/5 border-white/10 text-white focus:border-violet-500/50" />
            </div>
            <div>
              <label className="block text-zinc-300 text-sm mb-2">Description</label>
              <textarea {...register('description', { required: true })} className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500/50 focus:outline-none resize-none" rows={4} />
            </div>
            <Button type="submit" className="w-full h-11 gradient-primary text-white font-medium rounded-xl hover:opacity-90 transition-opacity" disabled={updateVideoPending}>
              {updateVideoPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Video'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Dashboard;
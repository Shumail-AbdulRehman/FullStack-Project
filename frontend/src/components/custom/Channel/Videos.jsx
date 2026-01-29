import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import VideoCard from '../VideoCard';
import LoadingSpinner from '../LoadingSpinner';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Upload,
  Plus,
  FileVideo,
  Image,
  FileText,
  Type,
  Loader2,
  AlertCircle,
  Tag,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const categories = [
  "programming",
  "fitness",
  "tech",
  "education",
  "entertainment",
  "gaming",
  "vlog",
];

import { motion } from 'framer-motion';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const FileInput = ({
  label,
  icon,
  accept,
  preview,
  setPreview,
  register,
  name,
  color,
  errors,
  validationRules = {},
}) => (
  <div className="space-y-2">

    <label className="flex items-center gap-2 text-zinc-300 font-medium text-sm">
      {icon}
      {label} <span className="text-red-400">*</span>
    </label>

    <div
      className={`
        relative border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer
        ${errors[name] ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-white/5 hover:border-violet-500/30 hover:bg-white/10'}
      `}
    >
      <input
        type="file"
        accept={accept}
        {...register(name, {
          required: `${label} is required`,
          ...validationRules,
        })}
        onChange={(e) => {
          if (e.target.files[0]) {
            setPreview(URL.createObjectURL(e.target.files[0]));
          }
        }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="text-center">
        {preview ? (
          accept.includes('video') ? (
            <video
              src={preview}
              controls
              className="w-full h-32 rounded-lg object-cover bg-black"
            />
          ) : (
            <img
              src={preview}
              className="w-full h-32 rounded-lg object-cover"
            />
          )
        ) : (
          <div className="py-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-2">
              {icon}
            </div>
            <p className="text-zinc-400 text-sm">Click to upload</p>
          </div>
        )}
      </div>
    </div>

    {errors[name] && (
      <p className="text-red-400 text-xs flex items-center gap-1">
        <AlertCircle size={12} /> {errors[name].message}
      </p>
    )}
  </div>
);

function Videos({ channelId }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const userData = useSelector((state) => state.auth.userData);

  const {
    data: userVideos = [],
    isLoading: fetchingUserVideos,
    refetch: refetchUserVideos,
  } = useQuery({
    queryKey: ['channelVideos', channelId],
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/api/v1/videos/c/${channelId}`,
        { withCredentials: true }
      );
      return res.data.data;
    },
  });

  const uploadToCloudinary = async (file, type) => {
    const { data } = await axios.get(
      `${API_URL}/api/v1/videos/get-signature`,
      { withCredentials: true }
    );
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', data.apiKey);
    formData.append('timestamp', data.timestamp);
    formData.append('signature', data.signature);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${data.cloudName}/${type}/upload`,
      formData
    );
    return res;
  };

  const onSubmit = async (d) => {
    setLoading(true);
    try {
      const videoResult = await uploadToCloudinary(d.video[0], 'video');

      const formData = new FormData();
      formData.append('thumbnail', d.thumbnail[0]);
      formData.append('videoLink', videoResult.data.secure_url);
      formData.append('videoDuration', videoResult.data.duration);
      formData.append('title', d.title);
      formData.append('description', d.description);
      formData.append('category', d.category);

      await axios.post(`${API_URL}/api/v1/videos/`, formData, {
        withCredentials: true,
      });

      reset();
      setVideoPreview(null);
      setThumbnailPreview(null);
      setIsDialogOpen(false);
      refetchUserVideos();
    } catch (e) {

    }
    setLoading(false);
  };


  if (fetchingUserVideos) {
    return <LoadingSpinner />;
  }

  return (

    <div className="relative min-h-[400px] bg-[#050508] p-4">
      {userVideos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 px-4 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center mb-6">
            <Upload className="w-10 h-10 text-zinc-600" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">No videos found</h1>
          {userData && userData._id === channelId && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsDialogOpen(true)}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-full shadow-lg shadow-violet-500/25 flex items-center gap-2"
            >
              <Plus size={18} />
              Upload Your First Video
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {userVideos.map((video, index) => (
              <motion.div
                key={video._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/video/${video._id}/${video.owner._id}`}>
                  <VideoCard {...video} />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {userData && userData._id === channelId && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDialogOpen(true)}
              className="fixed bottom-6 right-6 px-5 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-full shadow-xl shadow-violet-500/30 flex items-center gap-2 z-50"
            >
              <Upload size={18} />
              <span className="hidden sm:inline">Upload Video</span>
            </motion.button>
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-w-lg sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              Upload New Video
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Upload your video to share with your audience. (Max 100MB)
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <FileInput
                label="Video File (Max 100MB)"
                icon={<FileVideo size={18} className="text-blue-400" />}
                accept="video/*"
                preview={videoPreview}
                setPreview={setVideoPreview}
                register={register}
                name="video"
                color="blue"
                errors={errors}
                validationRules={{
                  validate: (fileList) => {
                    if (fileList?.[0]?.size > 100 * 1024 * 1024) {
                      return 'Video size must be less than 100MB';
                    }
                    return true;
                  },
                }}
              />

              <FileInput
                label="Thumbnail Image"
                icon={<Image size={18} className="text-green-400" />}
                accept="image/*"
                preview={thumbnailPreview}
                setPreview={setThumbnailPreview}
                register={register}
                name="thumbnail"
                color="green"
                errors={errors}
              />

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-zinc-300 font-medium text-sm">
                  <Type size={18} className="text-purple-400" />
                  Video Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter an engaging title..."
                  {...register('title', {
                    required: 'Title is required',
                    maxLength: { value: 100, message: 'Title cannot exceed 100 characters' },
                  })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
                {errors.title && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-zinc-300 font-medium text-sm">
                  <FileText size={18} className="text-yellow-400" />
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  placeholder="Tell viewers about your video..."
                  {...register('description', { required: 'Description is required' })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 h-24 text-white placeholder:text-zinc-500 resize-none focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
                {errors.description && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-zinc-300 font-medium text-sm">
                  <Tag size={18} className="text-pink-400" />
                  Category <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register('category', { required: 'Category is required' })}
                    defaultValue=""
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-zinc-900 text-zinc-500">
                      Select a category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-zinc-900 text-white">
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                  </div>
                </div>
                {errors.category && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.category.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-medium bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Upload Video
                  </>
                )}
              </button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Videos;
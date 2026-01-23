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
} from 'lucide-react';
<<<<<<< HEAD
=======
import { motion } from 'framer-motion';
>>>>>>> 4d1eafa (impoved frontend UI)

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
<<<<<<< HEAD
    <label className="flex items-center gap-2 text-zinc-300 font-semibold text-sm sm:text-base">
      {icon}
      {label} <span className="text-red-500">*</span>
    </label>

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
      className={`block w-full text-xs sm:text-sm text-zinc-400 file:py-2 sm:file:py-3 file:px-4 sm:file:px-6 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-${color}-600 file:text-white hover:file:bg-${color}-700 cursor-pointer border-2 border-dashed ${errors[name] ? 'border-red-500' : 'border-zinc-700'} rounded-xl p-2 sm:p-4 hover:border-${color}-600 transition-all bg-zinc-800`}
    />

    {errors[name] && (
      <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1 mt-1">
        <AlertCircle size={14} /> {errors[name].message}
      </p>
    )}

    {preview &&
      (accept.includes('video') ? (
        <video
          src={preview}
          controls
          className="w-full h-32 sm:h-48 rounded-lg object-cover border border-zinc-700 bg-black mt-2"
        />
      ) : (
        <img
          src={preview}
          className="w-full h-32 sm:h-48 rounded-lg object-cover border border-zinc-700 mt-2"
        />
      ))}
=======
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
>>>>>>> 4d1eafa (impoved frontend UI)
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
        `http://localhost:8000/api/v1/videos/c/${channelId}`,
        { withCredentials: true }
      );
      return res.data.data;
    },
  });

  const uploadToCloudinary = async (file, type) => {
    const { data } = await axios.get(
      'http://localhost:8000/api/v1/videos/get-signature',
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

      await axios.post('http://localhost:8000/api/v1/videos/', formData, {
        withCredentials: true,
      });

      reset();
      setVideoPreview(null);
      setThumbnailPreview(null);
      setIsDialogOpen(false);
      refetchUserVideos();
    } catch (e) {
<<<<<<< HEAD
      console.error(e);
=======
>>>>>>> 4d1eafa (impoved frontend UI)
    }
    setLoading(false);
  };

<<<<<<< HEAD
  const UploadFormContent = (
    <div className="max-h-[70vh] sm:max-h-[80vh] overflow-y-auto px-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 mt-4">
        <FileInput
          label="Video File (Max 100MB)"
          icon={<FileVideo size={20} className="text-blue-500" />}
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
          icon={<Image size={20} className="text-green-500" />}
          accept="image/*"
          preview={thumbnailPreview}
          setPreview={setThumbnailPreview}
          register={register}
          name="thumbnail"
          color="green"
          errors={errors}
        />

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-zinc-300 font-semibold text-sm sm:text-base">
            <Type size={20} className="text-purple-500" />
            Video Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter an engaging title..."
            {...register('title', {
              required: 'Title is required',
              maxLength: {
                value: 100,
                message: 'Title cannot exceed 100 characters',
              },
            })}
            className={`w-full bg-zinc-800 border ${errors.title ? 'border-red-500' : 'border-zinc-700'} rounded-lg p-2 sm:p-3 text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all hover:border-zinc-600`}
          />
          {errors.title && (
            <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
              <AlertCircle size={14} /> {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-zinc-300 font-semibold text-sm sm:text-base">
            <FileText size={20} className="text-yellow-500" />
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Tell viewers about your video..."
            {...register('description', {
              required: 'Description is required',
            })}
            className={`w-full bg-zinc-800 border ${errors.description ? 'border-red-500' : 'border-zinc-700'} rounded-lg p-2 sm:p-3 h-20 sm:h-24 text-sm sm:text-base text-white placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all hover:border-zinc-600`}
          />
          {errors.description && (
            <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
              <AlertCircle size={14} /> {errors.description.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-lg font-bold text-base sm:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-900/50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={20} />
              Upload Video
            </>
          )}
        </button>
      </form>
    </div>
  );

=======
>>>>>>> 4d1eafa (impoved frontend UI)
  if (fetchingUserVideos) {
    return <LoadingSpinner />;
  }

  return (
<<<<<<< HEAD
    <>
      <div className="relative min-h-[400px]">
        {userVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 mt-10 sm:mt-20 px-4 text-center">
            <Upload size={60} className="mb-4 text-gray-600 sm:w-20 sm:h-20" />
            <h1 className="text-xl sm:text-2xl font-semibold mb-2">No videos found</h1>
            {userData && userData._id === channelId && (
              <button
                onClick={() => setIsDialogOpen(true)}
                className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-sm sm:text-base"
              >
                <Plus size={18} />
                Upload Your First Video
              </button>
            )}
          </div>
        ) : (
          <div className="relative px-2 sm:px-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userVideos.map((video) => (
                <Link
                  key={video._id}
                  to={`/video/${video._id}/${video.owner._id}`}
                  className="w-full"
                >
                  <VideoCard {...video} />
                </Link>
              ))}
            </div>

            {userData && userData._id === channelId && (
              <button
                onClick={() => setIsDialogOpen(true)}
                className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center gap-2 z-50 text-sm sm:text-base"
              >
                <Upload size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Upload Video</span>
                <span className="sm:hidden">Upload</span>
              </button>
            )}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-zinc-900 border-zinc-800 w-[95vw] max-w-lg sm:max-w-2xl p-4 sm:p-6 rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <div className="p-1 bg-blue-600 rounded-lg inline-flex">
                  <Upload className="text-white" size={18} />
                </div>
                Upload New Video
              </DialogTitle>
              <DialogDescription className="text-zinc-400 text-sm sm:text-base">
                Upload your video to share with your audience. (Max 100MB)
              </DialogDescription>
            </DialogHeader>

            {UploadFormContent}
          </DialogContent>
        </Dialog>
      </div>
    </>
=======
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
>>>>>>> 4d1eafa (impoved frontend UI)
  );
}

export default Videos;
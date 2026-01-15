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
  AlertCircle 
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const FileInput = ({ label, icon, accept, preview, setPreview, register, name, color, errors, validationRules = {} }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-zinc-300 font-semibold">
      {icon}{label} <span className="text-red-500">*</span>
    </label>
    
    <input 
      type="file" 
      accept={accept} 
      {...register(name, { 
        required: `${label} is required`,
        ...validationRules 
      })} 
      onChange={e => {
        
        if(e.target.files[0]) {
            setPreview(URL.createObjectURL(e.target.files[0]));
        }
      }} 
      className={`block w-full text-sm text-zinc-400 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-${color}-600 file:text-white hover:file:bg-${color}-700 cursor-pointer border-2 border-dashed ${errors[name] ? 'border-red-500' : 'border-zinc-700'} rounded-xl p-4 hover:border-${color}-600 transition-all bg-zinc-800`} 
    />

    {errors[name] && (
      <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
        <AlertCircle size={14} /> {errors[name].message}
      </p>
    )}

    {preview && (accept.includes('video') ? 
      <video src={preview} controls className="w-full h-48 rounded-lg object-cover border border-zinc-700 bg-black mt-2"/> : 
      <img src={preview} className="w-full h-48 rounded-lg object-cover border border-zinc-700 mt-2"/>
    )}
  </div>
);

function Videos({ channelId }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
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
    const { data } = await axios.get('http://localhost:8000/api/v1/videos/get-signature', { withCredentials: true });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', data.apiKey);
    formData.append('timestamp', data.timestamp);
    formData.append('signature', data.signature);
    const res = await axios.post(`https://api.cloudinary.com/v1_1/${data.cloudName}/${type}/upload`, formData);
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
      
      await axios.post('http://localhost:8000/api/v1/videos/', formData, { withCredentials: true });
      
      reset(); 
      setVideoPreview(null); 
      setThumbnailPreview(null);
      setIsDialogOpen(false); 
      refetchUserVideos();   
    } catch (e) { 
      console.error(e); 
    }
    setLoading(false);
  };

  const UploadFormContent = (
    <div className="max-h-[80vh] overflow-y-auto px-1">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
        
        <FileInput 
          label="Video File (Max 100MB)" 
          icon={<FileVideo size={20} className="text-blue-500"/>} 
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
                return "Video size must be less than 100MB";
              }
              return true;
            }
          }}
        />
        
        <FileInput 
          label="Thumbnail Image" 
          icon={<Image size={20} className="text-green-500"/>} 
          accept="image/*" 
          preview={thumbnailPreview} 
          setPreview={setThumbnailPreview} 
          register={register}
          name="thumbnail" 
          color="green"
          errors={errors}
        />

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-zinc-300 font-semibold">
            <Type size={20} className="text-purple-500"/>Video Title <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter an engaging title..." 
            {...register('title', { 
              required: "Title is required", 
              maxLength: { value: 100, message: "Title cannot exceed 100 characters" } 
            })} 
            className={`w-full bg-zinc-800 border ${errors.title ? 'border-red-500' : 'border-zinc-700'} rounded-lg p-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all hover:border-zinc-600`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={14} /> {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-zinc-300 font-semibold">
            <FileText size={20} className="text-yellow-500"/>Description <span className="text-red-500">*</span>
          </label>
          <textarea 
            placeholder="Tell viewers about your video..." 
            {...register('description', { required: "Description is required" })} 
            className={`w-full bg-zinc-800 border ${errors.description ? 'border-red-500' : 'border-zinc-700'} rounded-lg p-3 h-24 text-white placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all hover:border-zinc-600`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={14} /> {errors.description.message}
            </p>
          )}
        </div>

        <button type="submit" disabled={loading} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-900/50">
          {loading ? <><Loader2 className="animate-spin" size={24}/>Uploading...</> : <><Upload size={24}/>Upload Video</>}
        </button>
      </form>
    </div>
  );

  if (fetchingUserVideos) {
    return <LoadingSpinner />;
  }
  
  return (
    <>
      <div className="relative min-h-[400px]">
        {userVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 mt-20">
            <Upload size={80} className="mb-4 text-gray-600" />
            <h1 className="text-2xl font-semibold mb-2">No videos found</h1>
            {userData && userData._id === channelId && (
              <button 
                onClick={() => setIsDialogOpen(true)}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <Plus size={20} />
                Upload Your First Video
              </button>
            )}
          </div>
        ) : (
          <div className="relative">
            <div className='flex gap-2 flex-wrap'>
              {userVideos.map((video) => (
                <Link key={video._id} to={`/video/${video._id}/${video.owner._id}`}>
                  <VideoCard {...video} />
                </Link>
              ))}
            </div>
            
            {userData && userData._id === channelId && (
              <button 
                onClick={() => setIsDialogOpen(true)}
                className="fixed bottom-8 right-8 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center gap-2 z-50"
              >
                <Upload size={20} />
                Upload Video
              </button>
            )}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <div className="p-1 bg-blue-600 rounded-lg inline-flex">
                  <Upload className="text-white" size={20} />
                </div>
                Upload New Video
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                Upload your video to share with your audience. (Max 100MB)
              </DialogDescription>
            </DialogHeader>
            
            {UploadFormContent}
            
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default Videos;
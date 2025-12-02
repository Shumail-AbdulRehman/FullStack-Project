import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Upload, FileVideo, Image, FileText, Type, Loader2 } from 'lucide-react';

function VideoUploadPage() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const uploadToCloudinary = async (file, resourceType) => {
    const sigRes = await axios.get(
      'http://localhost:8000/api/v1/videos/get-signature',
      { withCredentials: true }
    );
    const { timestamp, signature, api_key, cloud_name } = sigRes.data;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', api_key);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`,
      formData
    );
    console.log(
      'res from cloudinary is:',
      res.data,
      'vido duration is',
      res.data.duration
    );
    return res;
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const videoFile = data.video[0];
      const videoResult = await uploadToCloudinary(videoFile, 'video');
      const formData = new FormData();

      formData.append('thumbnail', data.thumbnail[0]);
      formData.append('videoLink', videoResult.data.secure_url);
      formData.append('videoDuration', videoResult.data.duration);
      formData.append('title', data.title);
      formData.append('description', data.description);

      const response = await axios.post(
        'http://localhost:8000/api/v1/videos/',
        formData,
        { withCredentials: true }
      );

      console.log(response);
      reset();
      setVideoPreview(null);
      setThumbnailPreview(null);
    } catch (error) {
      console.error('Upload failed', error);
    }
    setLoading(false);
  };

  return (
    <div className=" bg-zinc-950 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-zinc-900 shadow-2xl rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="bg-zinc-800 border-b border-zinc-700 p-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Upload className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                Upload Your Video
              </h2>
              <p className="text-zinc-400 mt-1">Share your content with the world</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 space-y-6"
        >
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-zinc-300 font-semibold">
              <FileVideo size={20} className="text-blue-500" />
              Video File
            </label>
            <div className="relative">
              <input
                type="file"
                accept="video/*"
                {...register('video', { required: true })}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setVideoPreview(URL.createObjectURL(file));
                  }
                }}
                className="block w-full text-sm text-zinc-400
                  file:mr-4 file:py-3 file:px-6 
                  file:rounded-lg file:border-0 
                  file:text-sm file:font-semibold 
                  file:bg-blue-600 file:text-white 
                  hover:file:bg-blue-700 file:cursor-pointer
                  cursor-pointer border-2 border-dashed border-zinc-700 
                  rounded-xl p-4 hover:border-blue-600 transition-all
                  bg-zinc-800"
              />
            </div>
            {videoPreview && (
              <div className="mt-3">
                <video 
                  src={videoPreview} 
                  controls 
                  className="w-full h-48 rounded-lg object-cover border border-zinc-700 bg-black"
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-zinc-300 font-semibold">
              <Image size={20} className="text-green-500" />
              Thumbnail Image
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                {...register('thumbnail', { required: true })}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setThumbnailPreview(URL.createObjectURL(file));
                  }
                }}
                className="block w-full text-sm text-zinc-400
                  file:mr-4 file:py-3 file:px-6 
                  file:rounded-lg file:border-0 
                  file:text-sm file:font-semibold 
                  file:bg-green-600 file:text-white 
                  hover:file:bg-green-700 file:cursor-pointer
                  cursor-pointer border-2 border-dashed border-zinc-700 
                  rounded-xl p-4 hover:border-green-600 transition-all
                  bg-zinc-800"
              />
            </div>
            {thumbnailPreview && (
              <div className="mt-3">
                <img 
                  src={thumbnailPreview} 
                  alt="Thumbnail preview" 
                  className="w-full h-48 rounded-lg object-cover border border-zinc-700"
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-zinc-300 font-semibold">
              <Type size={20} className="text-purple-500" />
              Video Title
            </label>
            <input
              type="text"
              placeholder="Enter an engaging title..."
              {...register('title', { required: true, maxLength: 100 })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white 
                placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-600 
                focus:border-transparent transition-all hover:border-zinc-600"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-zinc-300 font-semibold">
              <FileText size={20} className="text-yellow-500" />
              Description
            </label>
            <textarea
              placeholder="Tell viewers about your video..."
              {...register('description', { required: true })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-4 h-32 
                text-white placeholder-zinc-500 resize-none focus:outline-none 
                focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all
                hover:border-zinc-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 
              rounded-lg font-bold text-lg 
              transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-900/50
              transform hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={24} />
                Upload Video
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VideoUploadPage;
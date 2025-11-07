import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

function VideoUploadPage() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const uploadToCloudinary = async (file, resourceType) => {
    const sigRes = await axios.get(
      "http://localhost:8000/api/v1/videos/get-signature",
      { withCredentials: true }
    );
    const { timestamp, signature, api_key, cloud_name } = sigRes.data;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", api_key);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`,
      formData
    );
    console.log("res from cloudinary is:",res.data,"vido duration is",res.data.duration);
    // setVideoDuration(res.data   )
    return res
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {

      const videoFile = data.video[0];
      const videoResult = await uploadToCloudinary(videoFile, "video");
      const formData=new FormData();

      formData.append("thumbnail",data.thumbnail[0])
      formData.append("videoLink",videoResult.data.secure_url)
      formData.append("videoDuration",videoResult.data.duration)
      formData.append("title",data.title)
      formData.append("description",data.description)

      
      const response=await axios.post("http://localhost:8000/api/v1/videos/",formData,{withCredentials:true})
        
        console.log(response);
      reset();
    } catch (error) {
      console.error("Upload failed", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🎬 Upload Video with Thumbnail
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 flex flex-col"
      >
        <label className="block">
          <span className="text-gray-700 font-medium">Video File</span>
          <input
            type="file"
            accept="video/*"
            {...register("video", { required: true })}
            className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
              file:rounded-lg file:border-0 file:text-sm file:font-semibold 
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium">Thumbnail Image</span>
          <input
            type="file"
            accept="image/*"
            {...register("thumbnail", { required: true })}
            className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
              file:rounded-lg file:border-0 file:text-sm file:font-semibold 
              file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
        </label>
        <textarea
        name="description"
        placeholder="Enter detailed video description..."
        {...register("description", { required: true })}
        className="w-full border rounded p-2 h-24 resize-none"
        />

        <input
        type="text"
        name="title"
        placeholder="Enter video title"
        {...register("title", { required: true, maxLength: 100 })}
        className="w-full border rounded p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />


        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold 
            hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      
    </div>
  );
}

export default VideoUploadPage;

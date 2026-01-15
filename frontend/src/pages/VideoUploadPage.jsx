// import React, { useState } from 'react';
// import axios from 'axios';
// import { useForm } from 'react-hook-form';
// import { Upload, FileVideo, Image, FileText, Type, Loader2 } from 'lucide-react';
// import SideBar from '@/components/custom/SideBar';

// function VideoUploadPage() {
//   const [videoPreview, setVideoPreview] = useState(null);
//   const [thumbnailPreview, setThumbnailPreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const { register, handleSubmit, reset } = useForm();

//   const uploadToCloudinary = async (file, type) => {
//     const { data } = await axios.get('http://localhost:8000/api/v1/videos/get-signature', { withCredentials: true });
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('api_key', data.apiKey);
//     formData.append('timestamp', data.timestamp);
//     formData.append('signature', data.signature);
//     const res = await axios.post(`https://api.cloudinary.com/v1_1/${data.cloudName}/${type}/upload`, formData);
//     return res;
//   };

//   const onSubmit = async (d) => {
//     setLoading(true);
//     try {
//       const videoResult = await uploadToCloudinary(d.video[0], 'video');
//       const formData = new FormData();
//       formData.append('thumbnail', d.thumbnail[0]);
//       formData.append('videoLink', videoResult.data.secure_url);
//       formData.append('videoDuration', videoResult.data.duration);
//       formData.append('title', d.title);
//       formData.append('description', d.description);
//       await axios.post('http://localhost:8000/api/v1/videos/', formData, { withCredentials: true });
//       reset(); setVideoPreview(null); setThumbnailPreview(null);
//     } catch (e) { console.error(e); }
//     setLoading(false);
//   };

//   const FileInput = ({ label, icon, accept, preview, setPreview, name, color }) => (
//     <div className="space-y-2">
//       <label className="flex items-center gap-2 text-zinc-300 font-semibold">{icon}{label}</label>
//       <input type="file" accept={accept} {...register(name, { required: true })} 
//         onChange={e => e.target.files[0] && setPreview(URL.createObjectURL(e.target.files[0]))} 
//         className={`block w-full text-sm text-zinc-400 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-${color}-600 file:text-white hover:file:bg-${color}-700 cursor-pointer border-2 border-dashed border-zinc-700 rounded-xl p-4 hover:border-${color}-600 transition-all bg-zinc-800`} />
//       {preview && (accept.includes('video') ? <video src={preview} controls className="w-full h-48 rounded-lg object-cover border border-zinc-700 bg-black"/> : <img src={preview} className="w-full h-48 rounded-lg object-cover border border-zinc-700"/>)}
//     </div>
//   );

//   return (
//     <div className="bg-zinc-950 flex items-center pt-3 justify-evenly">
//       <div className="max-w-3xl w-full bg-zinc-900 shadow-2xl rounded-2xl border border-zinc-800 overflow-hidden">
//         <div className="bg-zinc-800 border-b border-zinc-700 p-8 flex items-center gap-3">
//           <div className="p-2 bg-blue-600 rounded-lg"><Upload className="text-white" size={28} /></div>
//           <div>
//             <h2 className="text-3xl font-bold text-white">Upload Your Video</h2>
//             <p className="text-zinc-400 mt-1">Share your content with the world</p>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
//           <FileInput label="Video File" icon={<FileVideo size={20} className="text-blue-500"/>} accept="video/*" preview={videoPreview} setPreview={setVideoPreview} name="video" color="blue"/>
//           <FileInput label="Thumbnail Image" icon={<Image size={20} className="text-green-500"/>} accept="image/*" preview={thumbnailPreview} setPreview={setThumbnailPreview} name="thumbnail" color="green"/>

//           <div className="space-y-2">
//             <label className="flex items-center gap-2 text-zinc-300 font-semibold"><Type size={20} className="text-purple-500"/>Video Title</label>
//             <input type="text" placeholder="Enter an engaging title..." {...register('title', { required: true, maxLength: 100 })} 
//               className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all hover:border-zinc-600"/>
//           </div>

//           <div className="space-y-2">
//             <label className="flex items-center gap-2 text-zinc-300 font-semibold"><FileText size={20} className="text-yellow-500"/>Description</label>
//             <textarea placeholder="Tell viewers about your video..." {...register('description', { required: true })} 
//               className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-4 h-32 text-white placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all hover:border-zinc-600"/>
//           </div>

//           <button type="submit" disabled={loading} 
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-900/50 transform hover:scale-[1.01] active:scale-[0.99]">
//             {loading ? <><Loader2 className="animate-spin" size={24}/>Uploading...</> : <><Upload size={24}/>Upload Video</>}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default VideoUploadPage;

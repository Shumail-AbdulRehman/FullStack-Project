import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Trash2, Pencil, Loader2 } from 'lucide-react';
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

function Dashboard() {
  const userData = useSelector((state) => state.auth.userData);
  const queryClient = useQueryClient();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: dashboardData,isPending:dashboardPending } = useQuery({
    queryKey: ['DashboardData', userData?._id],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/dashboard/stats`,
        {
          withCredentials: true,
        }
      );
      console.log('dashboard :::', res.data.data);
      return res.data.data;
    },
  });

  const { mutate: toggelPublishVideo,isPending:publishVideoPending } = useMutation({
    mutationFn: async (id) => {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/videos/toggle/publish/${id}`,
        {},
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      if (userData?._id)
        queryClient.invalidateQueries(['DashboardData', userData._id]);
        queryClient.invalidateQueries([])
    },
  });

  const { mutate: deleteVideo, isPending: deleteVideoPending } = useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/videos/${id}/${userData?._id}`,
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
  const handleTogglePublish = (id, currentState) => toggelPublishVideo(id);
  
  const handleEdit = (video) => {
    setSelectedVideo(video);
    setThumbnailPreview(video.thumbnail);
    reset({ 
      title: video.title, 
      description: video.description 
    });
    setIsModalOpen(true); // ✅ Open modal manually
  };

  const { register, handleSubmit, reset } = useForm();

  const { mutate: updateVideo, isPending: updateVideoPending } = useMutation({
    mutationFn: async ({ formData, videoId }) => {
      const res = await axios.patch(
        `http://localhost:8000/api/v1/videos/${videoId}/${userData?._id}`,
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

  if (deleteVideoPending||dashboardPending|| publishVideoPending) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex bg-zinc-950 min-h-screen">
      <aside className="w-60 hidden md:block">
        <SideBar />
      </aside>

      <main className="flex-1 text-white p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="border border-gray-700 rounded-xl p-6 bg-gray-900 shadow-lg">
            <p className="text-gray-400 text-sm mb-1">Total Videos</p>
            <h2 className="text-3xl font-bold">
              {dashboardData?.userVideosCount || 0}
            </h2>
          </div>
          <div className="border border-gray-700 rounded-xl p-6 bg-gray-900 shadow-lg">
            <p className="text-gray-400 text-sm mb-1">Total Likes</p>
            <h2 className="text-3xl font-bold">
              {dashboardData?.totalLikesOnVideos || 0}
            </h2>
          </div>
          <div className="border border-gray-700 rounded-xl p-6 bg-gray-900 shadow-lg">
            <p className="text-gray-400 text-sm mb-1">Total Video Views</p>
            <h2 className="text-3xl font-bold">
              {dashboardData?.totalVideoViews || 0}
            </h2>
          </div>
          <div className="border border-gray-700 rounded-xl p-6 bg-gray-900 shadow-lg">
            <p className="text-gray-400 text-sm mb-1">Total Subscribers</p>
            <h2 className="text-3xl font-bold">
              {dashboardData?.totalChannelSubscribers || 0}
            </h2>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Your Uploaded Videos</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800 text-gray-300">
                  <th className="p-3">Status</th>
                  <th className="p-3">Thumbnail</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Likes</th>
                  <th className="p-3">Uploaded</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.userVideosAndLikeCountOfEachVideo?.length ? (
                  dashboardData.userVideosAndLikeCountOfEachVideo.map(
                    (video) => (
                      <tr
                        key={video._id}
                        className="border-b border-gray-700 hover:bg-gray-800/70 transition"
                      >
                        <td className="p-3">
                          <button
                            onClick={() =>
                              handleTogglePublish(video._id, video.isPublished)
                            }
                            className={`w-12 h-6 rounded-full flex items-center transition ${
                              video.isPublished ? 'bg-green-500' : 'bg-gray-600'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full transform transition ${
                                video.isPublished
                                  ? 'translate-x-6'
                                  : 'translate-x-1'
                              }`}
                            ></div>
                          </button>
                        </td>
                        <td className="p-3">
                          <img
                            src={video.thumbnail}
                            alt="thumb"
                            className="w-20 h-12 rounded-md object-cover"
                          />
                        </td>
                        <td className="p-3 font-medium">{video.title}</td>
                        <td className="p-3 text-green-400 font-semibold">
                          {video.likeCount || 0}
                        </td>
                        <td className="p-3">
                          {new Date(video.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-right flex items-center justify-end gap-4">
                          {/* ✅ Remove DialogTrigger, use regular button */}
                          <button
                            onClick={() => handleEdit(video)}
                            className="hover:text-yellow-400 transition"
                          >
                            <Pencil size={20} />
                          </button>
                          <button
                            onClick={() => handleDelete(video._id)}
                            className="hover:text-red-500 transition"
                          >
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-10 text-gray-400 text-lg"
                    >
                      No videos uploaded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ✅ Move Dialog outside the table */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
            <DialogDescription>
              Update your video details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Thumbnail</label>
              <div className="mb-2">
                {thumbnailPreview && (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="w-full h-40 object-cover rounded-md border border-gray-400"
                  />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                {...register('thumbnail')} // ✅ Removed required: true
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setThumbnailPreview(URL.createObjectURL(file));
                }}
                className="w-full text-black"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Title</label>
              <Input
                {...register('title', { required: true })}
                className="w-full text-black"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Description</label>
              <textarea
                {...register('description', { required: true })}
                className="w-full text-black p-2 rounded-md"
                rows={4}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={updateVideoPending}
            >
              {updateVideoPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Dashboard;
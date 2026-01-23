import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
import VideoCard from '@/components/custom/VideoCard';
import SideBar from '@/components/custom/SideBar';
import { Link } from 'react-router-dom';
import LoadingSpinner from '@/components/custom/LoadingSpinner';
<<<<<<< HEAD
=======
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
>>>>>>> 4d1eafa (impoved frontend UI)

function LikedVideos() {
  const userData = useSelector((state) => state.auth.userData);

  const { data: getUserLikedVideos, isPending: likeVideosPending } = useQuery({
    queryKey: ['likedVideos', userData?._id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:8000/api/v1/likes/videos`, {
        withCredentials: true,
      });
<<<<<<< HEAD
      console.log('liked videos are ::', res.data.data);
=======
>>>>>>> 4d1eafa (impoved frontend UI)
      return res.data.data;
    },
  });

  if (likeVideosPending) {
    return <LoadingSpinner />;
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-zinc-950 text-white flex">
      <aside className="w-60 flex-shrink-0 ">
        <SideBar />
      </aside>

      <main className="flex-1 px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Liked Videos</h1>
            <p className="text-gray-400">
              Videos you’ve Liked will appear here.
            </p>
          </div>
        </div>

        {getUserLikedVideos && getUserLikedVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getUserLikedVideos.map((item) => (
              <Link to={`/video/${item.video._id}/${item._id}`}>
                <VideoCard key={item._id} {...item.video} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 mt-10 text-center">
            You havent Liked any video.
          </p>
=======
    <div className="min-h-screen bg-[#050508] text-white flex">
      <aside className="w-64 flex-shrink-0 hidden lg:block">
        <SideBar />
      </aside>

      <main className="flex-1 px-4 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center">
              <Heart className="w-7 h-7 text-pink-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Liked Videos</h1>
              <p className="text-zinc-400 text-sm">
                Videos you've liked will appear here
              </p>
            </div>
          </div>
        </motion.div>

        {getUserLikedVideos && getUserLikedVideos.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {getUserLikedVideos.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/video/${item.video._id}/${item._id}`}>
                  <VideoCard {...item.video} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-zinc-600" />
            </div>
            <p className="text-zinc-400 text-center">
              You haven't liked any videos yet
            </p>
          </motion.div>
>>>>>>> 4d1eafa (impoved frontend UI)
        )}
      </main>
    </div>
  );
}

export default LikedVideos;

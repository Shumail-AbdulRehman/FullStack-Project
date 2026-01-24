import React from 'react';
import VideoCard from '@/components/custom/VideoCard';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import axios from 'axios';
import SideBar from '@/components/custom/SideBar';
import { Link } from 'react-router-dom';
import LoadingSpinner from '@/components/custom/LoadingSpinner';
import { History, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

function WatchHistory() {
  const userData = useSelector((state) => state.auth.userData);
  const queryClient = useQueryClient();

  const { data: getWatchHistory, isPending: getHistoryPending } = useQuery({
    queryKey: ['watchHistory', userData?._id],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/users/watch-history`,
        { withCredentials: true }
      );
      return res.data.data;
    },
  });

  const { mutate: clearHistory, isPending: clearHistoryPending } = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/users/clear-watch-history`,
        { withCredentials: true }
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['watchHistory', userData?._id]);
      queryClient.invalidateQueries(["recommended-videos",videoId]);
    },
  });

  const handleClearAll = () => clearHistory();

  if (clearHistoryPending || getHistoryPending) {
    return <LoadingSpinner />;
  }

  return (
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
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <History className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Watch History</h1>
              <p className="text-zinc-400 text-sm">
                Videos you've watched recently
              </p>
            </div>
          </div>

          {getWatchHistory && getWatchHistory.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClearAll}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 font-medium hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </motion.button>
          )}
        </motion.div>

        {getWatchHistory && getWatchHistory.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {getWatchHistory.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/video/${item.video._id}/${item._id}`}>
                  <VideoCard {...item.user} {...item.video} />
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
              <History className="w-10 h-10 text-zinc-600" />
            </div>
            <p className="text-zinc-400 text-center">
              Your watch history is empty
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default WatchHistory;

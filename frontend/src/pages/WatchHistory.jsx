import React from 'react'
import VideoCard from '@/components/custom/VideoCard'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import axios from 'axios';
import SideBar from '@/components/custom/SideBar';
import { Link } from 'react-router-dom';
function WatchHistory() {
  const userData = useSelector((state) => state.auth.userData);
  const queryClient = useQueryClient();

  const { data: getWatchHistory } = useQuery({
    queryKey: ["watchHistory", userData?._id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:8000/api/v1/users/watch-history`, { withCredentials: true });
      console.log("watch history::",res.data.data);
      return res.data.data;
    },
   onError: (err) => {
    console.error("Dashboard query failed:", err);
  },
  });

  const { mutate: clearHistory } = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`http://localhost:8000/api/v1/users/clear-watch-history`, { withCredentials: true });
      return res.data.data;
    }
  });

  const handleClearAll = () => {
    clearHistory();
    queryClient.invalidateQueries(["watchHistory", userData?._id]);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex">
      
      <aside className="w-60 flex-shrink-0 border-r border-gray-800">
        <SideBar />
      </aside>

      <main className="flex-1 px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Watch History</h1>
            <p className="text-gray-400">Videos you’ve watched recently will appear here.</p>
          </div>
          <button
            onClick={handleClearAll}
            className="mt-4 sm:mt-0 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded transition-colors"
          >
            Clear All History
          </button>
        </div>

        {getWatchHistory && getWatchHistory.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getWatchHistory.map((item) => (

                 <Link to={`/video/${item.video._id}/${item._id}`}>
                    <VideoCard key={item._id} {...item.user } {...item.video} />

                </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 mt-10 text-center">Your watch history is empty.</p>
        )}
      </main>
    </div>
  );
}

export default WatchHistory;

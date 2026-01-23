import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from '@/components/custom/SideBar';
import LoadingSpinner from '@/components/custom/LoadingSpinner';
import SearchingHorizontalCard from '@/components/custom/SearchingHorizontalCard';
import { useSelector } from 'react-redux';
import { Search, VideoOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchResults() {
  const [videos, setVideos] = useState([]);
  const [params] = useSearchParams();
  const q = params.get('q');
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    axios
      .get(`http://localhost:8000/api/v1/videos/search?q=${q}`, {
        withCredentials: true,
      })
      .then((res) => {
        setVideos(res.data.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [q]);

  if (loading) return <LoadingSpinner />;

  if (videos.length === 0) {
    return (
      <div className="flex bg-[#050508] min-h-screen text-white">
        <aside className="hidden md:block w-64">
          <SideBar />
        </aside>

        <main className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
              <VideoOff className="w-10 h-10 text-zinc-600" />
            </div>
            <h1 className="text-2xl font-semibold">No results found</h1>
            <p className="text-zinc-400">
              Try different keywords or check your spelling
            </p>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-[#050508] min-h-screen text-white">
      <aside className="hidden md:block w-64 sticky top-0 h-screen">
        <SideBar />
      </aside>

      <main className="flex-1 px-4 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
            <Search className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <span className="text-zinc-400 text-sm">Search results for</span>
            <h2 className="text-lg font-semibold text-white">"{q}"</h2>
          </div>
        </motion.div>

        <div className="flex flex-col gap-2">
          {videos.map((video, index) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/video/${video._id}/${video.owner._id}`}
                className="block"
              >
                <div className="hover:bg-white/5 transition-colors rounded-xl p-2">
                  <SearchingHorizontalCard {...video} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

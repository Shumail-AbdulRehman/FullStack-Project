import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from '@/components/custom/SideBar';
import LoadingSpinner from '@/components/custom/LoadingSpinner';
import SearchingHorizontalCard from '@/components/custom/SearchingHorizontalCard';

export default function SearchResults() {
  const [videos, setVideos] = useState([]);
  const [params] = useSearchParams();
  const q = params.get('q');
  const [loading, setLoading] = useState(false);

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
      <div className="flex bg-zinc-950 min-h-screen text-white">
        <aside className="hidden md:block w-60 ">
          <SideBar />
        </aside>

        <main className="flex-1 flex items-center justify-center">
          <div className="pb-80 pr-40  space-y-2">
            <h1 className="text-2xl font-semibold">No results found</h1>
            <p className="text-zinc-400 text-lg">
              Try different keywords
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-zinc-950 min-h-screen text-white">
      <aside className="hidden md:block w-60  sticky top-0 h-screen">
        <SideBar />
      </aside>

      <main className="flex-1 px-4 py-6">
        <h2 className="text-base font-medium mb-4 text-zinc-200">
          Search results for{' '}
          <span className="font-semibold text-white">"{q}"</span>
        </h2>

        <div className="flex flex-col ">
          {videos.map((video) => (
            <Link
              key={video._id}
              to={`/video/${video._id}/${video.owner._id}`}
              className="block"
            >
              <div className="hover:bg-zinc-900 transition-colors rounded-lg p-2">
                <SearchingHorizontalCard {...video} />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

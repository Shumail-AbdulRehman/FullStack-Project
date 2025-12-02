import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import VideoCard from "@/components/custom/VideoCard";
import SideBar from "@/components/custom/SideBar";
import HorizontalVideoCard from "@/components/custom/HorizontalVideoCard";
export default function SearchResults() {
  const [videos, setVideos] = useState([]);
  const [params] = useSearchParams();
  const q = params.get("q");

  useEffect(() => {
    if (!q) return;

    axios
      .get(`http://localhost:8000/api/v1/videos/search?q=${q}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("search result is ::", res.data.data);
        setVideos(res.data.data);
      });
  }, [q]);

  return (
    <div className="flex bg-zinc-950 min-h-screen">
      
      <aside className="w-100 border-r h-screen sticky top-0">
        <SideBar />
      </aside>

     <main className="flex-1 px-6 py-6 overflow-y-auto">
  <h2 className="text-xl text-white font-semibold mb-5">
    Search results for:{" "}
    <span className="text-white font-bold">{q}</span>
  </h2>

  <div className="flex flex-col gap-4">
    {videos.map((video) => (
      <Link key={video._id} to={`/video/${video._id}/${video.owner._id}`} className="block w-full">
        <div className="flex hover:scale-[1.02] transition-transform duration-200">
          <HorizontalVideoCard {...video} />
        </div>
      </Link>
    ))}
  </div>
</main>

    </div>
  );
}

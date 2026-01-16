import React from 'react';
import CreatePlaylist from './CreatePlaylist';
import VideoCard from '../VideoCard';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ListVideo, Plus, FolderOpen } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';

function Playlist() {
  const userData = useSelector((state) => state.auth.userData);
  console.log('userdata::', userData);

  const { data: userVideos, isLoading } = useQuery({
    queryKey: ['userVidoes', userData?._id],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/videos/c/${userData?._id}`,
        { withCredentials: true }
      );
      // console.log('uservidoes::', res.data.data);
      return res.data.data;
    },
  });

 

  const {data:playlists=[]}=useQuery({
    queryKey:['playlists',userData?._id],
    queryFn:async()=>
    {
      const res=await axios.get(`http://localhost:8000/api/v1/playlist/user/${userData?._id}`,{withCredentials:true});
      console.log("playlist data is::",res.data.data);
      return res.data.data;
    }
  })

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
                <ListVideo size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  My Playlists
                </h1>
                <p className="text-zinc-400 mt-1">
                  Organize your videos into collections
                </p>
              </div>
            </div>
            <CreatePlaylist userVideos={userVideos} channelId={userData?._id} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <ListVideo size={24} className="text-blue-500" />
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Total Playlists</p>
                <p className="text-2xl font-bold text-white">{playlists?.length}</p>
              </div>
            </div>
          </div>
          
          {/* <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <FolderOpen size={24} className="text-purple-500" />
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Total Videos</p>
                <p className="text-2xl font-bold text-white">
                  {playlists?.reduce((acc, p) => acc + p.videoCount, 0)}
                </p>
              </div>
            </div>
          </div> */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <Plus size={24} className="text-green-500" />
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Available Videos</p>
                <p className="text-2xl font-bold text-white">{userVideos?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Playlists Grid */}
        {playlists?.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Your Playlists</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {playlists?.map((playlist) => (
                <div
                  key={playlist?._id}
                  className="group cursor-pointer bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20 transform hover:scale-[1.02]"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-zinc-800">
                    <img
                      src={playlist.videos[0].thumbnail}
                      alt={playlist.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Video Count Badge */}
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                      <ListVideo size={14} className="text-white" />
                      <span className="text-sm font-semibold text-white">
                        {playlist.videoCount} videos
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                      {playlist.name}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      Updated {new Date(playlist.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-6 bg-zinc-900 rounded-full mb-6">
              <ListVideo size={64} className="text-zinc-700" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              No playlists yet
            </h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-md">
              Create your first playlist to organize your videos and share collections with others
            </p>
            <CreatePlaylist userVideos={userVideos} channelId={userData._id} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Playlist;
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import VideoCard from '../VideoCard';

import { Plus, ListVideo, Check, AlignLeft, Type } from 'lucide-react';
import { useSelector } from 'react-redux';

function CreatePlaylist({ channelId, userVideos }) {
  const userData = useSelector((state) => state.auth.userData);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      playlistName: '',
      description: '',
      selectedVideos: [],
    },
  });

  const selectedVideos = watch('selectedVideos');
  const playlistName = watch('playlistName');
  const description = watch('description');

  const toggleVideoSelection = (videoId) => {
    if (selectedVideos.includes(videoId)) {
      setValue(
        'selectedVideos',
        selectedVideos.filter((id) => id !== videoId),
        { shouldValidate: true, shouldDirty: true }
      );
    } else {
      setValue('selectedVideos', [...selectedVideos, videoId], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const onSubmit = async (data) => {
    try {

      const res = await axios.post(
        `${API_URL}/api/v1/playlist/`,
        {
          name: data.playlistName,
          description: data.description,
          selectedVideos: data.selectedVideos,
        },
        { withCredentials: true }
      );
      queryClient.invalidateQueries(['playlists', userData?._id]);

      setOpen(false);
      reset();
    } catch (error) {
    }
  };

  return (

    <div className="flex justify-center items-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setOpen(true)}

            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium shadow-lg shadow-violet-500/25 flex items-center gap-2 text-sm sm:text-base"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Create Playlist</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[95vw] max-w-4xl rounded-2xl p-0 max-h-[90vh] flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-4 sm:p-6 shrink-0">
            <DialogHeader>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-white/10 rounded-xl backdrop-blur-md">
                  <ListVideo className="text-white w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <DialogTitle className="text-lg sm:text-2xl font-bold text-white">
                    Create New Playlist
                  </DialogTitle>
                  <DialogDescription className="text-violet-100 text-xs sm:text-sm mt-1">
                    Curate your content into a collection
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>


          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="glass-card rounded-xl p-4 sm:p-5 space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <label className="text-zinc-300 font-medium text-sm flex items-center gap-2">
                  <Type size={16} className="text-violet-400" />
                  Playlist Name <span className="text-red-400">*</span>
                </label>
                <Input
                  {...register('playlistName', { required: true })}
                  placeholder="e.g., Summer Vibes 2024"

                  className="h-10 sm:h-12 text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="text-zinc-300 font-medium text-sm flex items-center gap-2">
                  <AlignLeft size={16} className="text-purple-400" />
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  {...register('description', { required: true })}
                  placeholder="Tell your viewers what this playlist is about..."

                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 rounded-xl p-3 min-h-[80px] sm:min-h-[100px] text-sm sm:text-base resize-none transition-all"
                />
              </div>
            </div>


            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-zinc-300 font-semibold text-sm sm:text-base">
                  Select Videos
                </label>

                {selectedVideos.length > 0 && (

                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm text-zinc-400">
                      {selectedVideos.length} selected
                    </span>
                    <button
                      onClick={() => setValue('selectedVideos', [])}

                      className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2 sm:px-3 py-1 rounded-full font-medium"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-h-[300px] sm:max-h-[400px] overflow-y-auto glass-card rounded-xl p-3 sm:p-4 custom-scrollbar">
                {userVideos && userVideos.length > 0 ? (
                  userVideos.map((video) => (
                    <div
                      key={video._id}
                      onClick={() => toggleVideoSelection(video._id)}

                      className={`relative rounded-xl cursor-pointer transition-all duration-200 overflow-hidden group ${selectedVideos.includes(video._id)
                        ? 'ring-2 ring-violet-500 shadow-lg shadow-violet-500/10'
                        : 'ring-1 ring-white/10 hover:ring-white/20'
                        }`}
                    >
                      <div className="pointer-events-none">
                        <VideoCard {...video} />
                      </div>


                      <div
                        className={`absolute inset-0 transition-all duration-200 ${selectedVideos.includes(video._id)
                          ? 'bg-violet-600/10'
                          : 'bg-transparent group-hover:bg-black/20'
                          }`}
                      />

                      <div
                        className={`absolute top-2 right-2 transition-all duration-200 ${selectedVideos.includes(video._id)
                          ? 'scale-100 opacity-100'
                          : 'scale-90 opacity-0 group-hover:opacity-100'
                          }`}
                      >
                        <div
                          className={`${selectedVideos.includes(video._id)
                            ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/40'
                            : 'bg-zinc-800/90 text-zinc-400'
                            } w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center`}
                        >
                          {selectedVideos.includes(video._id) ? (
                            <Check size={14} strokeWidth={3} />
                          ) : (
                            <Plus size={16} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (

                  <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-16 text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center mb-3">
                      <ListVideo className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-600" />
                    </div>
                    <p className="text-zinc-400 font-medium">No videos found</p>
                    <p className="text-zinc-500 text-sm mt-1">Upload videos to add them to a playlist</p>
                  </div>
                )}
              </div>
            </div>
          </div>


          <div className="border-t border-white/5 p-3 sm:p-4 flex gap-2 sm:gap-3 shrink-0">
            <Button
              onClick={() => { setOpen(false); reset(); }}
              variant="outline"
              className="flex-1 h-10 sm:h-12 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}

              disabled={!selectedVideos.length || !playlistName || !description}
              variant="gradient"
              className="flex-1 h-10 sm:h-12 text-sm sm:text-base"
            >
              Create Playlist
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreatePlaylist;

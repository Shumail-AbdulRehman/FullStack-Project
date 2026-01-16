import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
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
import { Plus, ListVideo, Check, X, AlignLeft, Type } from 'lucide-react';
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
      console.log('Submitting playlist...', data);

      const res = await axios.post(
        `http://localhost:8000/api/v1/playlist/`,
        {
          name: data.playlistName,
          description: data.description,
          selectedVideos: data.selectedVideos,
        },
        { withCredentials: true }
      );
      queryClient.invalidateQueries(['playlists', userData?._id]);
      console.log('Playlist created successfully:', res.data);

      setOpen(false);
      reset();
    } catch (error) {
      console.error('Error creating playlist:', error);
      // Optional: Add toast notification here
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
          >
            <Plus size={20} />
            Create Playlist
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl w-full rounded-2xl p-0 bg-zinc-950 border border-zinc-800 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 p-6 shrink-0">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md shadow-inner border border-white/20">
                  <ListVideo className="text-white" size={28} />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white tracking-tight">
                    Create New Playlist
                  </DialogTitle>
                  <DialogDescription className="text-blue-100 text-sm mt-1 font-medium">
                    Curate your content into a collection
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-zinc-950">
            {/* Metadata Section */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-5">
              {/* Playlist Name */}
              <div className="space-y-2">
                <label className="text-zinc-300 font-medium text-sm flex items-center gap-2">
                  <Type size={16} className="text-blue-500" />
                  Playlist Name <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('playlistName', { required: true })}
                  placeholder="e.g., Summer Vibes 2024"
                  className="bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent rounded-lg p-3 h-12 text-base transition-all"
                />
              </div>

              {/* Description (New Field) */}
              <div className="space-y-2">
                <label className="text-zinc-300 font-medium text-sm flex items-center gap-2">
                  <AlignLeft size={16} className="text-purple-500" />
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('description', { required: true })}
                  placeholder="Tell your viewers what this playlist is about..."
                  className="w-full bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent rounded-lg p-3 min-h-[100px] text-base resize-none transition-all outline-none"
                />
              </div>
            </div>

            {/* Video Selection Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-zinc-300 font-semibold flex items-center gap-2">
                  Select Videos
                </label>

                {selectedVideos.length > 0 && (
                  <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-5 duration-300">
                    <span className="text-sm text-zinc-400">
                      {selectedVideos.length} selected
                    </span>
                    <button
                      onClick={() => setValue('selectedVideos', [])}
                      className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1.5 rounded-full transition-colors font-medium"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto border border-zinc-800 rounded-xl p-4 bg-zinc-900/30 custom-scrollbar">
                {userVideos && userVideos.length > 0 ? (
                  userVideos.map((video) => (
                    <div
                      key={video._id}
                      onClick={() => toggleVideoSelection(video._id)}
                      className={`relative rounded-xl cursor-pointer transition-all duration-200 overflow-hidden group ${
                        selectedVideos.includes(video._id)
                          ? 'ring-2 ring-blue-500 bg-zinc-800 shadow-lg shadow-blue-500/10'
                          : 'ring-1 ring-zinc-800 hover:ring-zinc-600 hover:bg-zinc-800/50'
                      }`}
                    >
                      <div className="pointer-events-none">
                        <VideoCard {...video} />
                      </div>

                      {/* Selection Overlay */}
                      <div
                        className={`absolute inset-0 transition-all duration-200 ${
                          selectedVideos.includes(video._id)
                            ? 'bg-blue-600/10 backdrop-blur-[1px]'
                            : 'bg-transparent group-hover:bg-black/20'
                        }`}
                      />

                      {/* Checkmark Indicator */}
                      <div
                        className={`absolute top-2 right-2 transition-all duration-200 transform ${
                          selectedVideos.includes(video._id)
                            ? 'scale-100 opacity-100'
                            : 'scale-90 opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <div
                          className={`${
                            selectedVideos.includes(video._id)
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40'
                              : 'bg-zinc-800/90 text-zinc-400 backdrop-blur-sm'
                          } w-8 h-8 rounded-full flex items-center justify-center`}
                        >
                          {selectedVideos.includes(video._id) ? (
                            <Check size={16} strokeWidth={3} />
                          ) : (
                            <Plus size={18} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                    <div className="p-4 bg-zinc-900 rounded-full mb-3">
                      <ListVideo size={32} className="text-zinc-700" />
                    </div>
                    <p className="text-lg font-medium text-zinc-400">
                      No videos found
                    </p>
                    <p className="text-sm text-zinc-600 mt-1">
                      Upload videos to add them to a playlist
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-zinc-900 border-t border-zinc-800 p-4 flex gap-3 shrink-0">
            <Button
              onClick={() => {
                setOpen(false);
                reset();
              }}
              variant="outline"
              className="flex-1 bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg py-6 h-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              // Button disabled if Name, Desc, or Videos are missing
              disabled={!selectedVideos.length || !playlistName || !description}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg py-6 h-auto font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2"
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

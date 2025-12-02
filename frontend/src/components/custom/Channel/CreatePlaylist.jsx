import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { Plus, ListVideo, Check, X } from 'lucide-react';

function CreatePlaylist({ channelId, userVideos }) {
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      playlistName: '',
      selectedVideos: [],
    },
  });

  const selectedVideos = watch('selectedVideos');

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

  const onSubmit = (data) => {
    console.log('Playlist Name:', data.playlistName);
    console.log('Selected Video IDs:', data.selectedVideos);

    setOpen(false);

    // Reset form
    reset();
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

        <DialogContent className="max-w-4xl w-full rounded-2xl p-0 bg-zinc-900 border border-zinc-800 shadow-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <ListVideo className="text-white" size={24} />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white">
                    Create New Playlist
                  </DialogTitle>
                  <DialogDescription className="text-blue-100 text-sm mt-1">
                    Select videos and give your playlist a memorable name
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)] custom-scrollbar">
            {/* Playlist Name */}
            <div className="space-y-2">
              <label className="text-zinc-300 font-semibold flex items-center gap-2">
                <ListVideo size={18} className="text-purple-500" />
                Playlist Name
              </label>
              <Input
                {...register('playlistName', { required: true })}
                placeholder="My Awesome Playlist"
                className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:ring-2 focus:ring-purple-600 focus:border-transparent rounded-lg p-3 text-base"
              />
            </div>

            {/* Selection Counter */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Check size={16} className="text-white" />
                </div>
                <span className="text-zinc-300 font-medium">
                  {selectedVideos.length} video{selectedVideos.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              {selectedVideos.length > 0 && (
                <button
                  onClick={() => setValue('selectedVideos', [])}
                  className="text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm"
                >
                  <X size={16} />
                  Clear all
                </button>
              )}
            </div>

            {/* Video Selection */}
            <div className="space-y-3">
              <label className="text-zinc-300 font-semibold">
                Select Videos to Add
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto border-2 border-dashed border-zinc-800 rounded-xl p-4 bg-zinc-800/30 custom-scrollbar">
                {userVideos && userVideos.length > 0 ? (
                  userVideos.map((video) => (
                    <div
                      key={video._id}
                      onClick={() => toggleVideoSelection(video._id)}
                      className={`relative rounded-xl cursor-pointer transition-all duration-200 overflow-hidden group ${
                        selectedVideos.includes(video._id)
                          ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20 scale-[0.98]'
                          : 'ring-2 ring-transparent hover:ring-zinc-700 hover:shadow-lg'
                      }`}
                    >
                      <VideoCard {...video} />

                      {/* Selection Overlay */}
                      <div
                        className={`absolute inset-0 transition-all duration-200 ${
                          selectedVideos.includes(video._id)
                            ? 'bg-blue-600/20 backdrop-blur-[2px]'
                            : 'bg-transparent group-hover:bg-zinc-900/20'
                        }`}
                      />

                      {/* Checkmark */}
                      {selectedVideos.includes(video._id) && (
                        <div className="absolute top-3 right-3 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg animate-in zoom-in duration-200">
                          <Check size={20} strokeWidth={3} />
                        </div>
                      )}

                      {/* Hover Indicator */}
                      {!selectedVideos.includes(video._id) && (
                        <div className="absolute top-3 right-3 bg-zinc-800/80 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                          <Plus size={20} />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-zinc-500">
                    <ListVideo size={48} className="mb-3 text-zinc-700" />
                    <p className="text-lg font-medium">No videos available</p>
                    <p className="text-sm text-zinc-600 mt-1">Upload some videos first to create a playlist</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-zinc-800 border-t border-zinc-700 p-4 flex gap-3">
            <Button
              onClick={() => {
                setOpen(false);
                reset();
              }}
              variant="outline"
              className="flex-1 bg-transparent border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white rounded-lg py-3"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={!selectedVideos.length || !watch('playlistName')}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Create Playlist
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreatePlaylist;
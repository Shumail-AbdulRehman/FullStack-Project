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
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md"
          >
            Create Playlist
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-3xl w-full rounded-lg p-6 bg-white shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Create Playlist
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-sm mt-1">
              Click on videos to select them and give your playlist a name.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex flex-col gap-4">
            {/* Playlist Name */}
            <div className="flex flex-col">
              <label className="mb-1 text-gray-700 font-medium">
                Playlist Name
              </label>
              <Input
                {...register('playlistName', { required: true })}
                placeholder="Enter playlist name"
                className="border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Video Selection */}
            <div className="flex flex-col gap-2">
              <label className="mb-1 text-gray-700 font-medium">
                Select Videos ({selectedVideos.length} selected)
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto border border-gray-200 rounded-md p-3">
                {userVideos && userVideos.length > 0 ? (
                  userVideos.map((video) => (
                    <div
                      key={video._id}
                      onClick={() => toggleVideoSelection(video._id)}
                      className={`border-2 rounded-lg cursor-pointer transition-all relative ${
                        selectedVideos.includes(video._id)
                          ? 'border-blue-600 bg-blue-50 shadow-md'
                          : 'border-gray-300 hover:border-blue-400 hover:shadow-sm'
                      }`}
                    >
                      <VideoCard {...video} />

                      {selectedVideos.includes(video._id) && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 py-8">
                    No videos available
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={!selectedVideos.length || !watch('playlistName')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
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

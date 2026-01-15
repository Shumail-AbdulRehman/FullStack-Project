import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Image as ImageIcon } from 'lucide-react'; // Visual only

function PostTweetCard({ channelId }) {
  const queryClient = useQueryClient();
  const userData = useSelector((state) => state.auth.userData);

  const { mutate: tweetMutate } = useMutation({
    mutationFn: async (content) => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/tweets/${channelId}`,
        { content },
        { withCredentials: true }
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tweets', channelId]);
    },
    onError: (error) => {
      console.log('Error while tweeting:', error.response?.data?.message);
    },
  });

  const { handleSubmit, register, reset, watch } = useForm();
  const contentValue = watch('content');

  const onSubmit = (data) => {
    tweetMutate(data.content);
    reset();
  };

  return (
    <div className="w-full bg-[#0f0f0f] border border-zinc-800 rounded-xl p-4 mb-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800">
             {userData?.avatar ? (
                <img src={userData.avatar} alt="User" className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold">
                  {userData?.username?.[0]?.toUpperCase() || 'U'}
                </div>
             )}
          </div>
        </div>

        <div className="flex-1">
          <div className="relative mb-2">
            <textarea
              {...register('content', { required: true })}
              placeholder="Post an update to your fans..."
              rows={2}
              className="w-full bg-transparent text-white text-base placeholder-zinc-500 resize-none outline-none border-b border-zinc-700 focus:border-blue-500 focus:border-b-2 transition-all p-2"
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
          </div>

          <div className={`flex items-center justify-between transition-all duration-200 ${contentValue ? 'opacity-100' : 'opacity-100'}`}>
            {/* <button type="button" className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors">
               <ImageIcon size={20} />
            </button> */}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => reset()}
                className="px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!contentValue}
                className="px-5 py-2 bg-[#3ea6ff] hover:bg-[#65b8ff] disabled:bg-zinc-700 disabled:text-zinc-500 text-black text-sm font-semibold rounded-full transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PostTweetCard;
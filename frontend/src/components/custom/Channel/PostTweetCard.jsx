import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

function PostTweetCard({ channelId }) {
  const queryClient = useQueryClient();

  const { mutate: tweetMutate } = useMutation({
    mutationFn: async (content) => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/tweets/${channelId}`,
        { content },
        { withCredentials: true }
      );
      return res.data.data;
    },
    onSuccess: (newTweet) => {
      // queryClient.setQueryData(['tweets', channelId], (old) => [
      //   newTweet,
      //   ...(old || []),
      // ]);

      queryClient.invalidateQueries(['tweets', channelId]);
    },
    onError: (error) => {
      console.log('Error while tweeting:', error.response?.data?.message);
    },
  });

  const { handleSubmit, register, reset } = useForm();

  const onSubmit = (data) => {
    tweetMutate(data.content);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-zinc-950 border-b border-zinc-800 p-4"
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          {/* <div className="w-10 h-10 rounded-full bg-zinc-950 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">U</span>
          </div> */}
        </div>

        <div className="flex-1">
          <textarea
            {...register('content', { required: true })}
            placeholder="What's happening?"
            rows={3}
            className="w-full  bg-white text-black text-2xl  border-6 p-10 rounded-xl  resize-none outline-none mb-3"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-full transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PostTweetCard;

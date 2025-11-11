import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

function PostTweetCard({ channelId }) {
  const queryClient = useQueryClient();

  const { mutate: tweetMutate } = useMutation({
    mutationFn: async (content) => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/tweets/${channelId}`,
        { content },
        { withCredentials: true }
      );
      console.log("tweet mutateFn valeu of resposne is:::", res.data.data.content);
      return res.data.data;
    },
    onSuccess: (tweetMutate) => {
      console.log("tweet Mutate is :", tweetMutate);
      queryClient.setQueryData(["tweets", channelId], (old) => [
        tweetMutate,
        ...(old || []),
      ]);
    },
    onError: (error) => {
      console.log("error while tweeting is:::", error.response.data.message);
    },
  });

  const { handleSubmit, register, reset } = useForm();

  const onSubmit = async (data) => {
    tweetMutate(data.content);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto border rounded-lg p-4 bg-white"
    >
      <div className="flex gap-3">
        <div className="flex-1">
          <textarea
            {...register("content", { required: true })}
            placeholder="What's happening?"
            className="w-full border rounded-md p-2 text-sm resize-none focus:outline-none focus:border-blue-400"
            rows={3}
          />

          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-2 text-gray-500">
              <svg
                className="w-5 h-5 cursor-pointer hover:text-blue-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14l4-4 3 3 6-6 6 6z" />
              </svg>

              <svg
                className="w-5 h-5 cursor-pointer hover:text-blue-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 3h18v18H3V3zm4 4v10h2V7H7zm4 0v6h4V7h-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ moved button here so it doesn't overlap textarea */}
      <button
        type="submit"
        className="bg-blue-500 text-red px-4 py-1 rounded-full text-sm mt-3"
      >
        Post
      </button>
    </form>
  );
}

export default PostTweetCard;

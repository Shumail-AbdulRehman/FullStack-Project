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
      return res.data.data;
    },
    onSuccess: (newTweet) => {
      queryClient.setQueryData(["tweets", channelId], (old) => [
        newTweet,
        ...(old || []),
      ]);
    },
    onError: (error) => {
      console.log("Error while tweeting:", error.response?.data?.message);
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
      className="max-w-md mx-auto bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <textarea
        {...register("content", { required: true })}
        placeholder="What's happening?"
        rows={3}
        className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      />

      <div className="flex justify-end mt-3">
        <button
          type="submit"
          className="bg-blue-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Post
        </button>
      </div>
    </form>
  );
}

export default PostTweetCard;

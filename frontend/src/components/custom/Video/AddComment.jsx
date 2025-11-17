import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function AddComment({ videoId }) {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (newComment) => {
      const res = await axios.post(
        `http://localhost:8000/api/v1/comments/${videoId}`,
        { content: newComment },
        { withCredentials: true }
      );
      return res.data.data;
    },
    onSuccess: (newComment) => {
      queryClient.setQueryData(["comment", videoId], (old) => [newComment, ...(old || [])]);
    },
  });

  const onSubmit = (data) => {
    mutate(data.comment);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 p-4 border-t border-gray-700 bg-[#0f0f0f] rounded-lg"
    >
      <h2 className="font-bold text-white text-lg sm:text-xl">Add a Comment</h2>
      <textarea
        {...register('comment', { required: true })}
        placeholder="Write your comment..."
        rows="4"
        className="w-full p-3 text-white text-sm resize-none rounded-md border border-gray-600 bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
      />
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 transition-colors duration-200"
        >
          Comment
        </button>
      </div>
    </form>
  );
}

export default AddComment;

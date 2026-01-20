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

      console.log('new commnet is::', res.data.data);
      return res.data.data;
    },
    onSuccess: (newComment) => {
      queryClient.invalidateQueries(['comment', videoId]);
    },
  });

  const onSubmit = (data) => {
    mutate(data.comment);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 w-full py-4"
    >
      <h2 className="text-xl font-bold text-white mb-2">Add a Comment</h2>
      <div className="relative w-full">
        <textarea
          {...register('comment', { required: true })}
          placeholder="Add a comment..."
          rows="2"
          className="w-full bg-transparent text-white text-[14px] border-b border-zinc-700 focus:border-white focus:border-b-2 outline-none pb-2 resize-none placeholder-zinc-400 transition-all duration-200"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-full transition-colors duration-200"
        >
          Comment
        </button>
      </div>
    </form>
  );
}

export default AddComment;
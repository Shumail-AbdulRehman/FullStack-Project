import axios from 'axios';
import React from 'react'
import { useForm } from 'react-hook-form';
import {useMutation,useQueryClient } from '@tanstack/react-query';


function AddComment({videoId}) {

  const {register,handleSubmit,reset}=useForm();
  console.log("video id is: ",videoId);

  const queryClient=useQueryClient();
  
  const {mutate}= useMutation({
      mutationFn: async (newComment)=>
      {
      
       const res = await axios.post(
        `http://localhost:8000/api/v1/comments/${videoId}`,
        { content: newComment },
        { withCredentials: true }
      );

      console.log("adding comment is: ",res.data.data, " and video id is=>",videoId);
      return res.data.data;   
          
      },
      onSuccess: (newComment)=>
      {
        queryClient.setQueryData(["comment",videoId],(old)=> [newComment, ...(old || [])])
      }
    })

  const onSubmit = async(data)=>
  {
    mutate(data.comment)
   console.log("data is=>",data);
   reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}  className="flex items-start gap-3 p-3 border-t border-gray-200">
      
      <div className="flex-1">
        <h1 className="font-bold text-white text-2xl">Comment:</h1>
        <textarea
        {
          ...register('comment',{required:true})
        }
          placeholder="Add a public comment..."
          rows="3"
          className="w-full resize-none p-2 border text-white rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-300"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            className="px-3 py-1.5 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Comment
          </button>
        </div>
      </div>
    </form>
  );
}

export default AddComment;


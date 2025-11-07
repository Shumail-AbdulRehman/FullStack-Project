import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner";
import { ThumbsUp, Eye } from "lucide-react";
import { useQuery,useQueryClient,useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";


function VideoMeta({ owner, title, views, _id, description }) {
  const videoId = _id;
  const channelId = owner?._id;
  const queryClient=useQueryClient();

  // const [subscribers, setSubscribers] = useState(0);
  // const [likes, setLikes] = useState(0);
  // const [loading, setLoading] = useState(true);


  const {data:subscribers=0,isLoading:loadingSubscribers,isError:fetchingSubscriberError,refetch:refetchSubscribers}=useQuery({
    queryKey:["subscriber",channelId],
    queryFn:async()=>{
      const res = await axios.get(
         `http://localhost:8000/api/v1/subscriptions/c/${channelId}`,
         { withCredentials: true }
       );

       return res.data.data.length
    }
  })

  // const fetchSubscribers = async () => {
  //   try {
  //     const res = await axios.get(
  //       `http://localhost:8000/api/v1/subscriptions/c/${channelId}`,
  //       { withCredentials: true }
  //     );
  //     setSubscribers(res.data.data.length);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const {data:likes=0,isLoading:loadingLikes,isError:fetchingLikesError,refetch:refetchLikes}=useQuery(
    {
      queryKey:["likes",channelId],
      queryFn:async ()=>
      {
        const res= await axios.get(
        `http://localhost:8000/api/v1/likes/v/${videoId}`,
        { withCredentials: true }
      );

      return res.data.data;

      }
    }
  )

  // const fetchLikes = async () => {
  //   try {
  //     const res = await axios.get(
  //       `http://localhost:8000/api/v1/likes/v/${videoId}`,
  //       { withCredentials: true }
  //     );
  //     setLikes(res.data.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };


  
  const {mutate:likeMutate}=useMutation({
    mutationFn: async ()=>{
      const res=await axios.post(
        `http://localhost:8000/api/v1/likes/toggle/v/${videoId}`,
        {},
        { withCredentials: true }
      );

      res.data;
    },
    onSuccess: ()=>
    {
      queryClient.invalidateQueries(["likes",channelId])
    }
  });




  const handleLikeClick = async () => {
    likeMutate();
  };


  const {mutate:subscriberMutate}=useMutation({
    mutationFn:async()=>{
      const res=await axios.post(
        `http://localhost:8000/api/v1/subscriptions/c/${channelId}`,
        {},
        { withCredentials: true }
      );
    },
    onSuccess:async()=>
    {
      queryClient.invalidateQueries(["subscriber",channelId]);
    }
  })

  const handleSubscriberClick = async () => {
    subscriberMutate();
  };

  // useEffect(() => {
  //   fetchSubscribers();
  // }, [channelId]);

  // useEffect(() => {
  //   fetchLikes();
  // }, [videoId]);

  if (loadingLikes || loadingSubscribers) return <LoadingSpinner />;

  return (
    <div className="w-full bg-[#0f0f0f] text-white rounded-xl mt-6 p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-3 leading-snug">
        {title}
      </h2>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#272727] pb-4 mb-4">
        <Link to={`/channel/${owner._id}`} className="flex items-center gap-3">
          <img
            src={owner.avatar || "/default-avatar.png"}
            alt={owner.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-medium text-white">{owner.fullName}</h3>
            <p className="text-sm text-gray-400">
              {subscribers.toLocaleString()} subscribers
            </p>
          </div>
        </Link>

        <button
          onClick={handleSubscriberClick}
          className="px-5 py-2.5 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-200 transition"
        >
          Subscribe
        </button>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-gray-300" />
            <span>{views?.toLocaleString()} views</span>
          </div>
          <div className="flex items-center gap-2">
            <ThumbsUp
              onClick={handleLikeClick}
              className="w-5 h-5 text-gray-300 cursor-pointer hover:text-blue-400 transition"
            />
            <span>{likes}</span>
          </div>
        </div>
      </div>

      <p className="text-sm sm:text-base text-gray-200 leading-relaxed whitespace-pre-line">
        {description}
      </p>
    </div>
  );
}

export default VideoMeta;

import SideBar from '@/components/custom/SideBar';
import VideoMeta from '@/components/custom/Video/VideoMeta';
import VideoPlayer from '@/components/custom/Video/VideoPlayer';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import VideosSuggestion from '@/components/custom/Video/VideosSuggestion';
import VideoComment from '@/components/custom/Video/VideoComment';
import AddComment from '@/components/custom/Video/AddComment';
import { useQuery } from '@tanstack/react-query';

function Video() {

    const {videoId}=useParams();
    // console.log("videoID is",videoId)
    // const [video,setVideo]=useState(null);
    // const [loading,setLoading]=useState(true);
    // const [videoComments,setVideoComments]=useState([]);

    // useEffect(()=>
    // {   
    //     setLoading(true);

    //     // http://localhost:8000/api/v1/subscriptions/c/${channelId}

    //     const getVideoAndComments=async()=>
    //     {try {
            
    //             const video=await axios.get(`http://localhost:8000/api/v1/videos/${videoId}`,{withCredentials:true});
    //             // console.log("videoInfo is =>",video.data.data);
    //             setVideo(video.data.data[0]);
    //             const comments=await axios.get(`http://localhost:8000/api/v1/comments/${videoId}`,{withCredentials:true});
    //             console.log("video comments respone is=> ",comments.data.data.docs)
    //             setVideoComments(comments.data.data.docs);
    //     } catch (error) {
    //             console.log("erro is video page",error);
    //     }finally
    //     {
    //         setLoading(false)
    //     }
    //     }
    //     getVideoAndComments();

       

        
    // },[videoId])

    console.log("videoId is =>",videoId); 

    const {data:video,isLoading:videoLoading,isError:videoError}=useQuery({
      queryKey:["video",videoId],
      queryFn:async ()=> {

        const res=await axios.get(`http://localhost:8000/api/v1/videos/${videoId}`,{withCredentials:true});
        return res.data.data[0];
      },
    });

    const {data:comments,isLoading:commentsLoading,isError:commentError}=useQuery({
      queryKey:["comment",videoId],
      queryFn:async ()=>
      {
        const res=await axios.get(`http://localhost:8000/api/v1/comments/${videoId}`,{withCredentials:true});
        return res.data.data.docs;
      }
    })

    console.log("comments are these =>:::: ",comments);

    if(videoLoading || commentsLoading)
    {
        return(
            <h1>loading....</h1>
        )
    }

  return (
    <div className='grid grid-cols-6 gap-4  '>
        <div className='col-span-1'>
            <SideBar/>
        </div>
        <div className='col-span-4 flex flex-col'>
            <div className=''>
                <VideoPlayer {...video} videoId={videoId}/>
            </div>
            <div>
                <VideoMeta {...video}/>
            </div>
            <div>
                <AddComment videoId={videoId}/>
            </div>

<div>
  {comments.length > 0 ? 
    comments.map((comment) => (
      <div key={comment._id}>
        <VideoComment 
            content={comment.content}
        createdAt={comment.createdAt}
        owner={comment.owner?.username}   
        avatar={comment.owner?.avatar} 
         />
      </div>
    ))
    :
    <div className='h-auto w-auto text-gray-500 text-sm'>
      No comments to show
    </div>
  }
</div>

        </div>
        <div className='col-span-1'>
            <VideosSuggestion {...video}/>
        </div>

    </div>

  )
}

export default Video

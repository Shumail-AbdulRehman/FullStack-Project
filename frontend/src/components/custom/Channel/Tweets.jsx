import React, { useEffect } from 'react'
import PostTweetCard from './PostTweetCard'
import { useSelector } from 'react-redux'
import TweetCard from './TweetCard';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
function Tweets({channelId}) {

  const userData=useSelector((state)=> state.auth.userData);
  // console.log("channelId is ::",channelId);
  
  const {data:tweetData=[],isLoading:fetchingTweetsData,isError:fetchingTweetsError}=useQuery({
    queryKey:["tweets",channelId],
    queryFn:async()=>
    {
      const res=await axios.get(`http://localhost:8000/api/v1/tweets/user/${channelId}`,{withCredentials:true});
      console.log("tweets are :",res.data.data);
      return res.data.data;
    },
    enabled: !!channelId,
    staleTime: 1000*60,
  });




  console.log("tweetData value is:",tweetData);



 





  return (
    <div>

       <div>
        {userData?._id == channelId && (
              <PostTweetCard channelId={channelId}/>
      )}
      </div>

      <div>
        {tweetData.length>0 && (
          tweetData.map((tweet)=>(
            <TweetCard {...tweet}/>
          ))
        )}
        <TweetCard  />
      </div>


        <div>

          {tweetData.length == 0 && (
        <div className='h-auto w-full text-xl  text-orange-600 bg-black'>
          No Tweets found !!.
        </div>
      )}
        </div>
      

     

      
      
    </div>
  )
}

export default Tweets

import React, { useState } from 'react'
import Videos from '@/components/custom/Channel/Videos'
import { useParams } from 'react-router-dom'
import ChannelNavbar from '@/components/custom/Channel/ChannelNavbar';
import Playlist from '@/components/custom/Channel/Playlist';
import Subscribed from '@/components/custom/Channel/Subscribed';
import Tweets from '@/components/custom/Channel/Tweets';


function UserChannel() {
    const {channelId}=useParams();
    const [selectedOption,setSelectedOption]=useState("Videos");
    console.log("channel ID is :::",channelId)
  return (
    <div>

        <div>
            <ChannelNavbar
  selectedOption={selectedOption}
  setSelectedOption={setSelectedOption}
/>

        </div>



        <div>

            {selectedOption === "Videos" && <Videos channelId={channelId}/>}

        </div>

        <div>
{selectedOption === "Playlist" && <Playlist />}
        </div>

        <div>
{selectedOption === "Subscribed" && <Subscribed />}
        </div>

        <div>
{selectedOption === "Tweets" && <Tweets />}
        </div>

    </div>
  )
}

export default UserChannel

import React, { useState } from 'react'
import Videos from '@/components/custom/Channel/Videos'
import { useParams } from 'react-router-dom'
import ChannelNavbar from '@/components/custom/Channel/ChannelNavbar';
import Playlist from '@/components/custom/Channel/Playlist';
import Subscribed from '@/components/custom/Channel/Subscribed';
import Tweets from '@/components/custom/Channel/Tweets';
import SideBar from '@/components/custom/SideBar';
import ChannelMeta from '@/components/custom/Channel/ChannelMeta';

function UserChannel() {
  const { channelId } = useParams();
  const [selectedOption, setSelectedOption] = useState("Videos");

  return (
    <div className="flex bg-black min-h-screen">
      <aside className="w-64 hidden md:block">
        <SideBar />
      </aside>
      
      <main className="flex-1">
        <ChannelMeta channelId={channelId} />
        
        <ChannelNavbar
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        
        <div className="px-4 md:px-8 py-6">
          {selectedOption === "Videos" && <Videos channelId={channelId} />}
          {selectedOption === "Playlist" && <Playlist channelId={channelId} />}
          {selectedOption === "Subscribed" && <Subscribed channelId={channelId} />}
          {selectedOption === "Tweets" && <Tweets channelId={channelId} />}
        </div>
      </main>
    </div>
  );
}

export default UserChannel;
import React, { useState } from 'react';
import Videos from '@/components/custom/Channel/Videos';
import { useParams } from 'react-router-dom';
import ChannelNavbar from '@/components/custom/Channel/ChannelNavbar';
import Playlist from '@/components/custom/Channel/Playlist';
import Subscribed from '@/components/custom/Channel/Subscribed';
import Tweets from '@/components/custom/Channel/Tweets';
import SideBar from '@/components/custom/SideBar';
import ChannelMeta from '@/components/custom/Channel/ChannelMeta';

function UserChannel() {
  const { channelId } = useParams();
  const [selectedOption, setSelectedOption] = useState('Videos');

  return (
    <div className="flex bg-[#050508] min-h-screen">
      <aside className="w-64 flex-shrink-0 hidden lg:block">
        <SideBar />
      </aside>

      <main className="flex-1 min-w-0">
        <ChannelMeta channelId={channelId} />

        <ChannelNavbar
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />

        <div className="px-2 sm:px-4 lg:px-6 py-4 lg:py-6">
          {selectedOption === 'Videos' && <Videos channelId={channelId} />}
          {selectedOption === 'Playlist' && <Playlist channelId={channelId} />}
          {selectedOption === 'Subscribed' && <Subscribed channelId={channelId} />}
          {selectedOption === 'Tweets' && <Tweets channelId={channelId} />}
        </div>
      </main>
    </div>
  );
}

export default UserChannel;

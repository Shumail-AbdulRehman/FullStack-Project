import React, { useState } from 'react'
import ChangePassword from '@/components/custom/Settings/ChangePassword';
import ChannelInfo from '@/components/custom/Settings/ChannelInfo';
import SettingNavbar from '@/components/custom/Settings/SettingNavbar';
import PersonalInfo from '@/components/custom/Settings/PersonalInfo';
import { useSelector } from 'react-redux';
import SideBar from '@/components/custom/SideBar';
import ChannelMeta from '@/components/custom/Channel/ChannelMeta';



function Setting() {
    const [selectedOption, setSelectedOption] = useState("Personal Information");
    const userData = useSelector((state) => state.auth.userData);
    console.log("userData is :::",userData)

    return (
        <div className="flex gap-4 min-h-screen bg-gray-100">
            <div className="w-64 hidden md:block">
                <SideBar />
            </div>

            <div className="flex-1 flex-col gap-3 p-4 md:p-8">
                <div>
                    <ChannelMeta channelId={userData?._id} />
                </div>
                <div className="mb-6">
                    <SettingNavbar 
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                    />
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    {selectedOption === "Personal Information" && <PersonalInfo  />}
                    {selectedOption === "Channel Information" && <ChannelInfo userData={userData} />}
                    {selectedOption === "Change Password" && <ChangePassword channelId={userData?._id} />}
                </div>
            </div>
        </div>
    )
}

export default Setting;

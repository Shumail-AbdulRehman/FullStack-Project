import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axios from "axios";
import { Trash2, Pencil } from "lucide-react";

function Dashboard() {
  const userData = useSelector((state) => state.auth.userData);
  const queryClient=useQueryClient();
  // ===== FETCH TOTAL STATS =====
  const { data: dashboardData } = useQuery({
    queryKey: ["DashboardData", userData?._id],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:8000/api/v1/dashboard/stats`,
        { withCredentials: true }
      );
      console.log("dashboard data ::",res.data.data);
      return res.data.data;
    },
  });


  const {mutate:toggelPublishVideo}=useMutation({
    mutationFn:async(id)=>
    {
      const res=await axios.patch(`http://localhost:8000/api/v1/videos/toggle/publish/${id}`,{},{withCredentials:true});
      console.log("toggle publish res:::",res.data);
      return res.data;
    },
    onSuccess: () => {
  if (userData?._id) {
    console.log('pyblish on success ran')
    queryClient.invalidateQueries(["DashboardData", userData._id]);
  }
}

  })




// /toggle/publish/:videoId
  // // ===== FETCH USER VIDEOS =====
  // const { data: getUserVideos } = useQuery({
  //   queryKey: ["userVideos", userData?._id],
  //   queryFn: async () => {
  //     const res = await axios.get(
  //       `http://localhost:8000/api/v1/dashboard/videos`,
  //       { withCredentials: true }
  //     );
  //     console.log("uservidoes",res.data.data)
  //     return res.data.data;
  //   },
  // });


  const {mutate:deleteVideo}=useMutation({
    mutationFn:async(data)=>
    {
const res = await axios.delete(
        `http://localhost:8000/api/v1/videos/${data}/${userData?._id}`,
        { withCredentials: true }
      );  
      return res.data.data;  
    },
    onSuccess:(res)=>
    {
      console.log("delete res is::",res);
          queryClient.invalidateQueries(["DashboardData", userData?._id]);

    }
  })

  const handleDelete = (id) => {
    console.log("DELETE VIDEO:", id);
    deleteVideo(id);

    
  };

  const handleTogglePublish = (id, currentState) => {
    console.log("TOGGLE PUBLISH:", id, "→", !currentState);
    toggelPublishVideo(id)
  };

  const handleEdit = (id) => {
    console.log("EDIT VIDEO:", id);
  };

  return (
    <div className="w-full min-h-screen bg-black text-white p-6">
      {/* ===== TOP STATS BOXES ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Total Views */}
        <div className="border border-gray-700 rounded-xl p-6 bg-gray-900 shadow-lg">
          <p className="text-gray-400 text-sm mb-1">Total Videos</p>
          <h2 className="text-3xl font-bold">
            {dashboardData?.userVideosCount || 0}
          </h2>

          {/* totalVideoViews */}
        </div>

        <div className="border border-gray-700 rounded-xl p-6 bg-gray-900 shadow-lg">
          <p className="text-gray-400 text-sm mb-1">Total Videos</p>
          <h2 className="text-3xl font-bold">
            {dashboardData?.totalVideoViews || 0}
          </h2>

          {/* totalVideoViews */}
        </div>

        <div className="border border-gray-700 rounded-xl p-6 bg-gray-900 shadow-lg">
          <p className="text-gray-400 text-sm mb-1">Total Subscribers</p>
          <h2 className="text-3xl font-bold">
            {dashboardData?.totalChannelSubscribers || 0}
          </h2>
        </div>

        {/* Total Likes */}
        <div className="border border-gray-700 rounded-xl p-6 bg-gray-900 shadow-lg">
          <p className="text-gray-400 text-sm mb-1">Total Likes</p>
          <h2 className="text-3xl font-bold">
            {dashboardData?.totalLikesOnVideos || 0}
          </h2>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Your Uploaded Videos</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800 text-gray-300">
                <th className="p-3">Status</th>
                <th className="p-3">Thumbnail</th>
                <th className="p-3">Title</th>
                <th className="p-3">Likes</th>
                {/* <th className="p-3">Dislikes</th> */}
                <th className="p-3">Uploaded</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {dashboardData?.userVideosAndLikeCountOfEachVideo?.length ? (
                dashboardData?.userVideosAndLikeCountOfEachVideo.map((video) => (
                  <tr
                    key={video._id}
                    className="border-b border-gray-700 hover:bg-gray-800/70 transition"
                  >
                    {/* Publish Switch */}
                    <td className="p-3">
                      <button
                        onClick={() =>
                          handleTogglePublish(video._id, video.isPublished)
                        }
                        className={`w-12 h-6 rounded-full flex items-center transition ${
                          video.isPublished
                            ? "bg-green-500"
                            : "bg-gray-600"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full transform transition ${
                            video.isPublished ? "translate-x-6" : "translate-x-1"
                          }`}
                        ></div>
                      </button>
                    </td>

                    {/* Thumbnail */}
                    <td className="p-3">
                      <img
                        src={video.thumbnail}
                        alt="thumb"
                        className="w-20 h-12 rounded-md object-cover"
                      />
                    </td>

                    {/* Title */}
                    <td className="p-3 font-medium">{video.title}</td>

                    {/* Likes */}
                    <td className="p-3 text-green-400 font-semibold">
                      {video.likeCount || 0}
                    </td>

                    {/* Dislikes */}
                    {/* <td className="p-3 text-red-400 font-semibold">
                      {video.dislikes || 0}
                    </td> */}

                    {/* Upload Date */}
                    <td className="p-3">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right flex items-center justify-end gap-4">
                      {/* Edit */}
                      <button
                        onClick={() => handleEdit(video._id)}
                        className="hover:text-yellow-400 transition"
                      >
                        <Pencil size={20} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(video._id)}
                        className="hover:text-red-500 transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-10 text-gray-400 text-lg"
                  >
                    No videos uploaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

// import VideoCard from '@/components/custom/VideoCard';
// import { getVideos } from '@/store/videoSlice';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import LoadingSpinner from '@/components/custom/LoadingSpinner';
// import SideBar from '@/components/custom/SideBar';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { VideoOff } from 'lucide-react';

// function VideoListing() {
//   const videos = useSelector((state) => state.videos.allVideos);
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         const fetchVideos = await axios.get(
//           `${import.meta.env.VITE_API_URL}/api/v1/videos/`,
//           { withCredentials: true }
//         );
//         dispatch(getVideos(fetchVideos.data.data.docs));
//       } catch (error) {
//         console.log("error while fetching videos is::",error);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   if (loading) return <LoadingSpinner />;

//   if (videos?.length === 0)
//     return (
//       <div className="flex min-h-screen bg-[#050508]">
//         <aside className="hidden lg:block lg:w-64">
//           <SideBar />
//         </aside>
//         <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="flex flex-col items-center gap-4"
//           >
//             <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
//               <VideoOff className="w-10 h-10 text-violet-400" />
//             </div>
//             <h2 className="text-xl font-semibold text-white">No videos yet</h2>
//             <p className="text-zinc-400 max-w-sm">Videos uploaded to the platform will appear here</p>
//           </motion.div>
//         </div>
//       </div>
//     );

//   return (
//     <div className="flex w-full min-h-screen bg-[#050508] relative">
//       <div className="fixed inset-0 pointer-events-none overflow-hidden">
//         <div
//           className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-30"
//           style={{
//             background: 'radial-gradient(circle, oklch(0.25 0.15 285 / 0.15) 0%, transparent 70%)',
//             filter: 'blur(80px)',
//           }}
//         />
//         <div
//           className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-20"
//           style={{
//             background: 'radial-gradient(circle, oklch(0.20 0.12 320 / 0.15) 0%, transparent 70%)',
//             filter: 'blur(80px)',
//           }}
//         />
//       </div>

//       <aside className="hidden lg:block lg:w-64 sticky top-0 h-screen z-20">
//         <SideBar />
//       </aside>

//       <main className="flex-1 px-4 lg:px-8 pb-12 pt-6 z-10">
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.3 }}
//           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8"
//         >
//           {videos?.map((video, index) => (
//             <motion.div
//               key={video._id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{
//                 duration: 0.4,
//                 delay: Math.min(index * 0.05, 0.3),
//                 ease: 'easeOut'
//               }}
//             >
//               <Link
//                 to={`/video/${video._id}/${video.owner._id}`}
//                 className="block"
//               >
//                 <VideoCard {...video} />
//               </Link>
//             </motion.div>
//           ))}
//         </motion.div>
//       </main>
//     </div>
//   );
// }

// export default VideoListing;











// import { useInView } from 'react-intersection-observer';
// import { useEffect } from 'react';
// import { useInfiniteQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import VideoCard from '@/components/custom/VideoCard';
// import LoadingSpinner from '@/components/custom/LoadingSpinner';

// // Fetcher Function
// const fetchVideos = async ({ pageParam = 1 }) => {
//   const res = await axios.get(
//     `${import.meta.env.VITE_API_URL}/api/v1/videos/?page=${pageParam}&limit=4`,
//     { withCredentials: true }
//   );
//   // Returns the Mongoose Aggregate Paginate object:
//   // { docs: [], totalDocs: 100, hasNextPage: true, nextPage: 2, ... }
//   return res.data.data; 
// };

// function VideoListing() {
//   const { ref, inView } = useInView();

//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     status,
//   } = useInfiniteQuery({
//     queryKey: ['videos'],
//     queryFn: fetchVideos,
//     getNextPageParam: (lastPage) => {
//       // ✅ UPDATED LOGIC:
//       // Your backend (aggregatePaginate) explicitly sends "nextPage".
//       // We use that value instead of guessing with "allPages.length + 1".
//       return lastPage.hasNextPage ? lastPage.nextPage : undefined;
//     },
//   });

//   // Sensor Logic
//   useEffect(() => {
//     if (inView && hasNextPage) {
//       fetchNextPage();
//     }
//   }, [inView, hasNextPage, fetchNextPage]);

//   // Flatten Pages
//   const allVideos = data?.pages.flatMap((page) => page.docs) || [];

//   if (status === 'pending') return <LoadingSpinner />;
//   if (status === 'error') return <p className="text-red-500 text-center">Error loading videos</p>;

//   return (
//     <div className="flex flex-col min-h-screen bg-[#050508]">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
//         {allVideos.map((video) => (
//           <VideoCard key={video._id} {...video} />
//         ))}
//       </div>

//       {/* Sensor Div */}
//       {hasNextPage && (
//         <div ref={ref} className="w-full flex justify-center p-8">
//           {isFetchingNextPage && <LoadingSpinner />}
//         </div>
//       )}
//     </div>
//   );
// }

// export default VideoListing;


import { Link } from 'react-router-dom';

import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion'; 
import VideoCard from '@/components/custom/VideoCard';
import LoadingSpinner from '@/components/custom/LoadingSpinner';
import SideBar from '@/components/custom/SideBar'; 

const fetchVideos = async ({ pageParam = 1 }) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/v1/videos/?page=${pageParam}&limit=6`,
    { withCredentials: true }
  );
  return res.data.data;
};

function VideoListing() {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status, 
  } = useInfiniteQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
    getNextPageParam: (lastPage) => {

      console.log("last page::",lastPage);

      return lastPage.hasNextPage ? lastPage.nextPage : undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const allVideos = data?.pages.flatMap((page) => page.docs) || [];

  return (
    <div className="flex w-full min-h-screen bg-[#050508]">
      
      <aside className="hidden lg:block lg:w-64 sticky top-0 h-screen z-20 border-r border-white/5">
        <SideBar />
      </aside>

      <main className="flex-1 px-4 lg:px-8 pb-12 pt-6 z-10">
        
        {status === 'pending' ? (
          <div className="w-full h-[50vh] flex justify-center items-center">
             <LoadingSpinner />
          </div>
        ) : status === 'error' ? (
          <p className="text-red-500 text-center mt-10">Error loading videos</p>
        ) : (
          
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {allVideos.map((video) => (
                <motion.div
                  key={video._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                to={`/video/${video._id}/${video.owner._id}`}
                className="block"
              >
                <VideoCard {...video} />
              </Link>
                </motion.div>
              ))}
            </div>

            {hasNextPage && (
              <div ref={ref} className="w-full flex justify-center py-8">
  {isFetchingNextPage && (
  <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
)}              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default VideoListing;
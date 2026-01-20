// import React from 'react';

// function timeAgo(date) {
//   const diff = Math.floor((Date.now() - new Date(date)) / 1000);
//   if (diff < 60) return `${diff}s`;
//   if (diff < 3600) return `${Math.floor(diff / 60)}m`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
//   return `${Math.floor(diff / 86400)}d`;
// }

// export default function NotificationItem({
//   notification,
//   onMarkRead = () => {},
//   onClick = () => {},
// }) {
//   const { message, createdAt, read, type, data } = notification;

//   return (
//     <div
//       className={`group flex gap-4 px-4 py-3 cursor-pointer transition-colors duration-200 items-start border-b border-zinc-800/50 ${
//         read ? 'bg-transparent opacity-70' : 'bg-[#1F1F1F]'
//       } hover:bg-[#272727]`}
//       onClick={() => {
//         if (!read) onMarkRead(notification);
//         onClick(notification);
//       }}
//     >
//       {/* Avatar / Icon Section */}
//       <div className="w-10 h-10 rounded-full bg-[#121212] border border-zinc-800 flex-shrink-0 overflow-hidden flex items-center justify-center">
//         <div className="text-zinc-400 text-xs font-bold tracking-wider">
//           {(type || '').slice(0, 2).toUpperCase()}
//         </div>
//       </div>

//       {/* Content Section */}
//       <div className="flex-1 min-w-0">
//         <div className="text-sm leading-snug">
//           <span className={`block ${read ? 'text-zinc-300' : 'text-white font-medium'}`}>
//             {message}
//           </span>
//         </div>
//         <div className="text-xs text-[#AAAAAA] mt-1 font-medium">
//           {timeAgo(createdAt)}
//         </div>
//       </div>

//       {/* Unread Indicator & Thumbnail Placeholder Position */}
//       <div className="flex items-center self-center pl-2">
//         {!read && (
//           <span className="w-2.5 h-2.5 bg-[#3EA6FF] rounded-full shadow-sm" />
//         )}
//       </div>
//     </div>
//   );
// }
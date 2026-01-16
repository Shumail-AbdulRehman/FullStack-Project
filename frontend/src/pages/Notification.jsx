// import { Bell, CheckCircle } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import React, { useEffect } from "react";
// import axios from "axios";

// function Notification() {
//   const [notifications, setNotifications] = React.useState([]);

//   useEffect(() => {
//     const fetchNotifcations = async () => {
//       const res = await axios.get(
//         `http://localhost:8000/api/v1/videos/get-notifications`,
//         { withCredentials: true }
//       );
//       console.log("notifications::", res.data.data);
//       setNotifications(res.data.data);
//     };

//     fetchNotifcations();
//   }, []);

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger className="relative">
//         <Bell className="h-6 w-6 cursor-pointer" />

//         {/* red dot badge */}
//         {notifications.length > 0 && (
//           <span className="absolute top-0 right-0 bg-red-600 w-3 h-3 rounded-full"></span>
//         )}
//       </DropdownMenuTrigger>

//       <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto">
//         <DropdownMenuLabel className="text-lg font-semibold">
//           Notifications
//         </DropdownMenuLabel>

//         <DropdownMenuSeparator />

//         {notifications.length === 0 && (
//           <div className="p-4 text-center text-sm text-muted-foreground">
//             No notifications
//           </div>
//         )}

//         {notifications.map((item, index) => (
//           <DropdownMenuItem
//             key={index}
//             className="flex gap-3 items-center p-3 hover:bg-accent rounded-md cursor-pointer"
//           >
//             {/* Thumbnail */}
//             <img
//               src={item.video.thumbnail}
//               alt="thumb"
//               className="w-12 h-12 rounded-md object-cover"
//             />

//             <div className="flex flex-col">
//               <p className="font-medium">{item.video.title}</p>
//               <p className="text-xs text-muted-foreground">
//                 {item.video.owner.username}
//               </p>
//             </div>
//           </DropdownMenuItem>
//         ))}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

// export default Notification;

// import NotificationBell from "@/components/custom/Notification/NotificationBell";
// import NotificationList from "@/components/custom/Notification/NotificationList";
// import NotificationItem from "@/components/custom/Notification/NotificationItem";

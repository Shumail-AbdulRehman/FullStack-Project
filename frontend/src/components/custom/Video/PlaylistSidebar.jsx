import React, { useEffect, useRef } from 'react';
import { ListVideo, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

function formatDuration(duration) {
    if (!duration) return '0:00';
    const totalSeconds = Math.floor(duration);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function PlaylistSidebar({ playlist, currentVideoIndex, onVideoSelect }) {
    const listRef = useRef(null);
    const activeRef = useRef(null);

    useEffect(() => {
        if (activeRef.current && listRef.current) {
            const container = listRef.current;
            const activeItem = activeRef.current;
            const containerTop = container.scrollTop;
            const containerBottom = containerTop + container.clientHeight;
            const itemTop = activeItem.offsetTop;
            const itemBottom = itemTop + activeItem.clientHeight;

            if (itemTop < containerTop || itemBottom > containerBottom) {
                activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentVideoIndex]);

    if (!playlist || !playlist.videos) return null;

    return (
        <div className="glass-card rounded-xl sm:rounded-2xl overflow-hidden mb-4">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg sm:rounded-xl backdrop-blur-sm">
                        <ListVideo className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-xs sm:text-sm truncate">
                            {playlist.name}
                        </h3>
                        <p className="text-violet-100 text-[10px] sm:text-xs">
                            {currentVideoIndex + 1} / {playlist.videos.length} videos
                        </p>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => currentVideoIndex > 0 && onVideoSelect(currentVideoIndex - 1)}
                            disabled={currentVideoIndex === 0}
                            className={`p-1.5 rounded-lg transition-colors ${currentVideoIndex === 0 ? 'text-white/30 cursor-not-allowed' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                        >
                            <ChevronUp size={16} />
                        </button>
                        <button
                            onClick={() => currentVideoIndex < playlist.videos.length - 1 && onVideoSelect(currentVideoIndex + 1)}
                            disabled={currentVideoIndex === playlist.videos.length - 1}
                            className={`p-1.5 rounded-lg transition-colors ${currentVideoIndex === playlist.videos.length - 1 ? 'text-white/30 cursor-not-allowed' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                        >
                            <ChevronDown size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div
                ref={listRef}
                className="max-h-[300px] sm:max-h-[400px] overflow-y-auto custom-scrollbar"
            >
                {playlist.videos.map((video, index) => {
                    const isActive = index === currentVideoIndex;
                    return (
                        <motion.div
                            key={video._id}
                            ref={isActive ? activeRef : null}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            onClick={() => onVideoSelect(index)}
                            className={`
                flex gap-2 sm:gap-3 p-2 sm:p-3 cursor-pointer transition-all duration-200
                ${isActive
                                    ? 'bg-violet-500/20 border-l-2 border-violet-500'
                                    : 'hover:bg-white/5 border-l-2 border-transparent'
                                }
              `}
                        >
                            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                <span className={`text-[10px] sm:text-xs w-4 sm:w-5 text-center ${isActive ? 'text-violet-400' : 'text-zinc-500'}`}>
                                    {isActive ? <Play size={10} className="fill-current sm:w-3 sm:h-3" /> : index + 1}
                                </span>
                            </div>

                            <div className="relative w-16 sm:w-24 aspect-video rounded-md sm:rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 bg-black/80 text-white text-[8px] sm:text-[10px] px-0.5 sm:px-1 rounded">
                                    {formatDuration(video.duration)}
                                </div>
                                {isActive && (
                                    <div className="absolute inset-0 bg-violet-500/20 flex items-center justify-center">
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-violet-500 flex items-center justify-center">
                                            <Play size={8} className="text-white fill-current ml-0.5 sm:w-2.5 sm:h-2.5" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className={`text-[11px] sm:text-sm font-medium line-clamp-2 leading-tight ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                                    {video.title}
                                </h4>
                                <p className="text-[10px] sm:text-xs text-zinc-500 mt-0.5 sm:mt-1 truncate">
                                    {video.owner?.username}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

export default PlaylistSidebar;

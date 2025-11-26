import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const userVideosAndLikeCountOfEachVideo = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "videoLikeCount",
            },
        },
        {
            $addFields: {
                likeCount: { $size: "$videoLikeCount" },
            },
        },
    ]);

    const userVideos = await Video.find({ owner: userId });

    const userVideosCount = userVideos.length;

    const videoIds = userVideos.map((v) => v._id);

    const totalLikesOnVideos = await Like.countDocuments({
        likedBy: { $ne: null },
        video: { $in: videoIds },
    });

    const totalChannelSubscribers = await Subscription.countDocuments({
        channel: userId,
    });

    const userVideoViews = await Video.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);
    const totalVideoViews = userVideoViews[0]?.totalViews || 0;

    console.log("totalVideoViews", totalVideoViews);

    res.status(200).json(
        new ApiResponse(
            200,
            {
                userVideosCount,
                totalLikesOnVideos,
                totalChannelSubscribers,
                totalVideoViews,
                userVideosAndLikeCountOfEachVideo,
            },
            "data fetched successfully"
        )
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const userVideos = await Video.find({
        owner: userId,
    });

    if (userVideos.length == 0)
        return res
            .status(200)
            .json(new ApiResponse(200, userVideos, "no videos found"));

    res.status(200).json(
        new ApiResponse(200, userVideos, "videis fetched successfully")
    );
});

export { getChannelStats, getChannelVideos };

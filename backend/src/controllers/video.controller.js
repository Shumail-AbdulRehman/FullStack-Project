import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteImageByUrl } from "../utils/deleteImageFromCloudinary.js";
import { Like } from "../models/like.model.js";
import { Subscription } from "../models/subscription.model.js";
import { client } from "../index.js";
import { Notification } from "../models/notification.model.js";
import { generateTags } from "../utils/tagGenerator.js";
import { WatchHistory } from "../models/watchHistory.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    };

    const pipeline = [
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
            },
        },
        {
            $unwind: "$owner",
        },
        {
            $match: {
                isPublished: true,
            },
        },
        {
            $project: {
                title: 1,
                description: 1,
                videoFile: 1,
                "owner.username": 1,
                views: 1,
                duration: 1,
                thumbnail: 1,
                createdAt: 1,
                "owner.avatar": 1,
                "owner._id": 1,
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
    ];
    const aggregate = Video.aggregate(pipeline);

    const result = await Video.aggregatePaginate(aggregate, options);

    res.status(200).json(
        new ApiResponse(200, result, "videos sent successfullt")
    );
});

const getRecommendedVideos = asyncHandler(async (req, res) => {
     const { page = 1, limit = 10 } = req.query;

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    };
    const userId = req.user._id;
    const {currentVideoId}=req.params;
    console.log("current video id is ::",currentVideoId);

    const watchedVideos = await WatchHistory.find({ user: userId }).select("video");
    const watchedVideoIds = watchedVideos.map(v => v.video.toString());

    const likedVideos = await Like.find({ likedBy: userId, video: { $ne: null } }).select("video");
    const likedVideoIds = likedVideos.map(v => v.video.toString());

    const videoIdsToConsider = [...new Set([...watchedVideoIds, ...likedVideoIds])];

    const videos = await Video.find({ _id: { $in: videoIdsToConsider } });
    const userTags = videos.flatMap(v => v.tags);
    const userCategories = [...new Set(videos.map(v => v.category))];


    
    const pipeline = [
        {
            $match: {
                isPublished: true,
                _id: { 
                    $ne: new mongoose.Types.ObjectId(currentVideoId), 
                    $nin: watchedVideoIds.map(id => new mongoose.Types.ObjectId(id)) },
                $or: [
                    { tags: { $in: userTags } },
                    { category: { $in: userCategories } }
                ]
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        { $unwind: "$owner" },
        {
            $project: {
                title: 1,
                description: 1,
                videoFile: 1,
                "owner.username": 1,
                "owner.avatar": 1,
                "owner._id": 1,
                views: 1,
                duration: 1,
                thumbnail: 1,
                createdAt: 1
            }
        },
        { $sort: { createdAt: -1 } }
    ];

    const aggregate = Video.aggregate(pipeline);

    const recommendedResult = await Video.aggregatePaginate(aggregate, options);

    res.status(200).json(
        new ApiResponse(200, recommendedResult, "recommended videos fetched successfully")
    );
});



const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, videoLink, videoDuration,category } = req.body;

    console.log("catgory is::::",category);

    if (
        !(
            title.trim() &&
            description.trim() &&
            videoLink.trim() &&
            videoDuration.trim()&&
            category
        )
    )
        throw new ApiError(
            400,
            "title , description , video link and video duration and category is required"
        );
    console.log(videoDuration);
    const userId = req.user._id;
    const uploadThumbnail = await uploadOnCloudinary(req.file?.path);
    const thumbnailUrl = uploadThumbnail?.secure_url || null;

    if (!thumbnailUrl) throw new ApiError(404, "thumbnail not found");

    const tags = generateTags(title, description, category);
    // console.log("tags are::",tags);
    const publishUserVideo = await Video.create({
        title,
        description,
        category,
        tags,
        owner: userId,
        videoFile: videoLink,
        thumbnail: thumbnailUrl,
        duration: videoDuration,
        
    });

    // console.log("publishUserVideo:::",publishUserVideo);


    if (!publishUserVideo)
    {
         throw new ApiError(
            500,
            "something went wrong while publishing user video"
        );
    }
       

        // console.log("publishUserVideo:::",publishUserVideo);
    const subscribersList = await Subscription.find({
        channel: userId,
    });

    // console.log("subscription::", subscribersList);

    const firstJob = JSON.stringify({
        video: publishUserVideo,
        user: req.user,
        subscribersList: subscribersList,
    });
    const job = JSON.stringify({
        videoId: publishUserVideo._id,
        channelId: userId,
        videoTitle: publishUserVideo.title,
    });

    await client.lPush("liveNotificationQueue", firstJob);
    await client.lPush("videoQueue", job);


    res.status(201).json(
        new ApiResponse(
            201,
            publishUserVideo,
            "published user video successfully"
        )
    );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId, channelId } = req.params;

    if (!videoId || !channelId)
        throw new ApiError(400, "video id and channelId is required");

    // const video=await Video.findById(videoId)

    //after this :=>

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId),
                isPublished: true,
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
            },
        },
        {
            $project: {
                title: 1,
                description: 1,
                videoFile: 1,
                "owner.username": 1,
                views: 1,
                duration: 1,
                thumbnail: 1,
                createdAt: 1,
                "owner.avatar": 1,
                "owner._id": 1,
                isPublished: 1,
            },
        },
        {
            $unwind: "$owner",
        },
    ]);

    console.log("Video by ID info :::", video);

    if (!video || video.length === 0)
        throw new ApiError(404, "video not found");

    const isLiked = (await Like.findOne({
        video: videoId,
        likedBy: req.user._id,
    }))
        ? true
        : false;
    const isSubscribed = (await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId,
    }))
        ? true
        : false;

    res.status(200).json(
        new ApiResponse(
            200,
            { video, isSubscribed, isLiked },
            "video fetched successfully"
        )
    );
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    const userVideo = await Video.findById(videoId);
    if (!userVideo) throw new ApiError(404, "video not found");

    if (req.user._id.toString() !== userVideo.owner.toString()) {
        throw new ApiError(401, "unauthorized access");
    }

    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;

    if (req.file?.path) {
        const uploadThumbnail = await uploadOnCloudinary(req.file.path);
        if (!uploadThumbnail?.secure_url) {
            throw new ApiError(500, "error while updating thumbnail");
        }

        updateData.thumbnail = uploadThumbnail.secure_url;

        await deleteImageByUrl(userVideo.thumbnail, "image");
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, updateData, {
        new: true,
    });

    if (!updatedVideo)
        throw new ApiError(
            500,
            "something went wrong while updating the video"
        );

    res.status(200).json(
        new ApiResponse(200, updatedVideo, "video updated successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) throw new ApiError(400, "video id is required");

    const video = await Video.findById(videoId);

    if (!video) throw new ApiError(404, "video not found");
    const oldVideoUrl = video?.videoFile;
    const oldThumbnailUrl = video?.thumbnail;
    if (req.user._id.toString() !== video.owner.toString())
        throw new ApiError(401, "unauthorize access");

    const deleteVideo = await Video.findByIdAndDelete(videoId);

    if (!deleteVideo)
        throw new ApiError(500, "soemthing wnet wrong while deleting video");
    const videoDeletedFromCloudinary = await deleteImageByUrl(
        oldVideoUrl,
        "video"
    );

    if (videoDeletedFromCloudinary?.result !== "ok")
        console.log(
            videoDeletedFromCloudinary,
            "something went wrong while deleting videoFile"
        );
    const thumbnailDeletedFromCloudinary = await deleteImageByUrl(
        oldThumbnailUrl,
        "image"
    );

    if (thumbnailDeletedFromCloudinary?.result !== "ok")
        console.log(
            thumbnailDeletedFromCloudinary,
            "something wnet wring while deleting thumbnail in deleteVideo controller"
        );
    res.status(200).json(
        new ApiResponse(200, true, "video deleted successfully")
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) throw new ApiError(400, "video id is required");

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "video not found");

    if (video.owner.toString() !== req.user._id.toString())
        throw new ApiError(401, "unauthorize access");

    const updatePublishStatus = await Video.findByIdAndUpdate(
        videoId,
        {
            isPublished: !video.isPublished,
        },
        {
            new: true,
        }
    );

    res.status(200).json(
        new ApiResponse(
            200,
            updatePublishStatus,
            "publish status updated successfully"
        )
    );
});

const incrementViewCount = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) throw new ApiError(400, "video id is required");

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $inc: { views: 1 } },
        { new: true }
    );

    if (!updatedVideo)
        throw new ApiError(404, "video not found while updating");

    res.status(200).json(
        new ApiResponse(
            200,
            updatedVideo,
            "video view count incremented by one"
        )
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    console.log("channelId is:=> ", channelId);
    if (!channelId) throw new ApiError(400, "channelId is required");

    // const channelVideos= await Video.find({ owner: channelId });
    // console.log("channel Videos are these => :::: ",channelVideos);

    const channelVideos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId),
                isPublished: true,
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
            },
        },
        {
            $unwind: "$owner",
        },
    ]);

    res.status(200).json(
        new ApiResponse(200, channelVideos, "channel Vidoes sent successfully")
    );
});

const getUserNotification = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    };

    console.log("userId is ::", userId);

    const result = Notification.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                        },
                    },
                    {
                        $unwind: "$owner",
                    },
                ],
            },
        },
        {
            $unwind: "$video",
        },
       {
           $sort: {
                "video.createdAt": -1,
            },
        },
    ]);
    // console.log("notiifcations are:::", notifications);

    const notifications=await Notification.aggregatePaginate(result,options)

    res.status(200).json(
        new ApiResponse(
            200,
            notifications,
            "fetched notiifcations successfully"
        )
    );
});

const searchVideos = asyncHandler(async (req, res) => {
    const query = req.query.q;

    const videos = await Video.find({
        $text: {
            $search: query,
        },
    }).sort({
        score: {
            $meta: "textScore",
        },
    });

    const searchVideos = await Video.aggregate([
  {
    $match: {
      $text: { $search: query },
      isPublished: true
    }
  },
  {
    $addFields: {
      score: { $meta: "textScore" }
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "owner",
      foreignField: "_id",
      as: "owner"
    }
  },
  {
    $unwind: "$owner"
  },
  {
    $sort: {
      score: -1
    }
  }
]);


    res.status(200).json(new ApiResponse(200, searchVideos, "search result"));
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    incrementViewCount,
    getChannelVideos,
    getUserNotification,
    searchVideos,
    getRecommendedVideos
};

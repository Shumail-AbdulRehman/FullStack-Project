import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params

    console.log("video id is =>",videoId);
    //TODO: toggle like on video
    const userId=req.user?._id;
    if(!videoId)
    {
        throw new ApiError(404,"video not found")
    }

    const videoLikedExist=await Like.findOne(
        {
            $and:[{
            likedBy:userId
        },{
            video:videoId
        }]
        }
        
    )

    if(!videoLikedExist)
    {
        const likeVideo=await Like.create({
            likedBy:userId,
            video:videoId
        })

        console.log("video Like ran when creating so liek video is :=>",likeVideo)

        if(!likeVideo)
        {
            throw new ApiError(500,"couldnt liked the video, soemthing went wrong")
        }

        res.status(200)
        .json
        (
            new ApiResponse(200,true,"video liked successfully")
        )
    }

   else if(videoLikedExist)
   {
        const dislikeVideo=await Like.findOneAndDelete(
            {
                $and:[{likedBy:userId},{video:videoId}]
            }
        )

        if(!dislikeVideo)
        {
            throw new ApiError(500,"couldnt dislike the video,soemthing went wrong at deleting the document")
        }

        res.status(200)
        .json(
            new ApiResponse(200,false,"video disliked successfully")
        )
   }

   else
   {
    throw new ApiResponse(500,"something went wrong when liking or disliking the video")
   }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    const userId=req.user?._id;
    if(!commentId)
    {
        throw new ApiError(404,"comment not found")
    }

    const commentLikedExist=await Like.findOne(
        {
            $and:[{
            likedBy:userId
        },{
            comment:commentId
        }]
        }
        
    )

    if(!commentLikedExist)
    {
        const likeComment=await Like.create({
            likedBy:userId,
            comment:commentId
        })

        if(!likeComment)
        {
            throw new ApiError(500,"couldnt liked the comment, soemthing went wrong")
        }

        res.status(200)
        .json
        (
            new ApiResponse(200,true,"comment liked successfully")
        )
    }

   else if(commentLikedExist)
   {
        const dislikeComment=await Like.findOneAndDelete(
            {
                $and:[{likedBy:userId},{comment:commentId}]
            }
        )

        if(!dislikeComment)
        {
            throw new ApiError(500,"couldnt dislike the comment,soemthing went wrong at deleting the document")
        }

        res.status(200)
        .json(
            new ApiResponse(200,false,"comment disliked successfully")
        )
   }

   else
   {
    throw new ApiResponse(500,"something went wrong when liking or disliking the comment")
   }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user?._id;

    if (!tweetId) {
        throw new ApiError(404, "tweet not found");
    }

    const tweetLikedExist = await Like.findOne({
        $and: [
            { likedBy: userId },
            { tweet: tweetId }
        ]
    });

    if (!tweetLikedExist) {
        const likeTweet = await Like.create({
            likedBy: userId,
            tweet: tweetId
        });

        if (!likeTweet) {
            throw new ApiError(500, "couldn't like the tweet, something went wrong");
        }

        res.status(200).json(
            new ApiResponse(200, true, "tweet liked successfully")
        );
    } 
    else if (tweetLikedExist) {
        const dislikeTweet = await Like.findOneAndDelete({
            $and: [
                { likedBy: userId },
                { tweet: tweetId }
            ]
        });

        if (!dislikeTweet) {
            throw new ApiError(500, "couldn't dislike the tweet, something went wrong at deleting the document");
        }

        res.status(200).json(
            new ApiResponse(200, false, "tweet disliked successfully")
        );
    } 
    else {
        throw new ApiResponse(500, "something went wrong when liking or disliking the tweet");
    }
});


const getLikedVideos = asyncHandler(async (req, res) => {
    const userId=req.user?._id
    const allLikedVideos= await Like.aggregate([
        {
            $match:{
                likedBy:new mongoose.Types.ObjectId(userId),
                video:{$ne:null}
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"video",
                foreignField:"_id",
                as:"video",
                pipeline:[
                            {
                                $match:{
                                    isPublished:true
                                }
                            },
                             {
                                $project:
                                    {
                                    videoFile:1,
                                    thumbnail:1,
                                    owner:1,
                                    title:1,
                                    duration:1,
                                    views:1,
                                    isPublished:1,
                                }
                            }
                        ]
                    }
        }
        ,
        { $unwind: "$video" }
    ])


    if (allLikedVideos.length === 0) {
    return res.status(200).json(
        new ApiResponse(200, [], "No liked videos found")
    );
}


    res.status(200)
    .json(
        new ApiResponse(200,allLikedVideos,"all liked videos sent successfully")
    )

})

const getLikesCount= asyncHandler(async(req,res)=>
{
    const {videoId}=req.params;

    if(!videoId)
    {
        throw new ApiError(401,"videoId is required");
    }

    const likesCount=await Like.aggregate(
        [
            {
                $match:{
                    video:new mongoose.Types.ObjectId(videoId)
                }
            },
            {
                $count:"likesCount"
            },
        ]
    )


    const totalLikes=likesCount[0]?.likesCount || 0;
    res.status(200).json(
        new ApiResponse(200,totalLikes,"video likes ent successfully")
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getLikesCount
}
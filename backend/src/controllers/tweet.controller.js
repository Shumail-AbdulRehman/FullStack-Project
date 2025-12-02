import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTweet = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id;

    console.log(userId.toString(), " && ", channelId);

    if (userId.toString() !== channelId)
        throw new ApiError(
            401,
            "unauthorized channelID and userID doesnt match"
        );

    if (!content) {
        throw new ApiError(401, "content is required");
    }
    const userTweet = await Tweet.create({
        owner: userId,
        content: content,
    });

    if (!userTweet) {
        throw new ApiError(
            500,
            "something went wrong while creating tweet of user"
        );
    }

    res.status(200).json(
        new ApiResponse(200, userTweet, "tweet created successfully")
    );
});

const getUserTweets = asyncHandler(async (req, res) => {
    // const userId=req.user._id
    const { channelId } = req.params;
    // const userTweets=await Tweet.find({
    //     owner:channelId
    // }).sort({createdAt:-1});

    const userTweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId),
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
        {
            $sort: { createdAt: -1 },
        },
    ]);


    // const userLikedTweets=await Tweet.aggregate(
    //     [
    //         {
    //             $match:{
    //             owner: new mongoose.Types.ObjectId(channelId),
    //             }
    //         },
    //         {
    //             $lookup:{
    //                 from:"likes",
    //                 localField:"_id",
    //                 foreignField:"tweet",
    //                 as:"likedTweets",
    //                 pipeline:[
    //                     {
    //                         $match:{
    //                             likedBy:new mongoose.Types.ObjectId(req.user._id)
    //                         }
    //                     }
    //                 ]
    //             }
    //         }
    //     ]
    // );

    // console.log("likedTweets of user are::",userLikedTweets);

    // if(!userTweets.length)
    // {
    //    return  res.status(200)
    //     .json(new ApiResponse(200,[],"no tweets found"))
    // }

    console.log("user tweets::", userTweets);

    res.status(200).json(
        new ApiResponse(200, userTweets, "user tweets fetched successfully")
    );
});


const getChannelTweetsWithLikes=asyncHandler(async(req,res)=>
{
    const {channelId}=req.params;
    const currentUserId=req.user._id;

     const tweets = await Tweet.aggregate([
    {
        $match: {
            owner: new mongoose.Types.ObjectId(channelId),
        },
    },

    // 1) Check if CURRENT USER liked this tweet
    {
        $lookup: {
            from: "likes",
            let: { tweetId: "$_id" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$tweet", "$$tweetId"] },
                                { $eq: ["$likedBy", new mongoose.Types.ObjectId(currentUserId)] }
                            ]
                        }
                    }
                }
            ],
            as: "myLike"
        }
    },

    // 2) Count TOTAL likes of this tweet
    {
        $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "tweet",
            as: "allLikes"
        }
    },

    // 3) Add fields
    {
        $addFields: {
            isLiked: { $gt: [{ $size: "$myLike" }, 0] },
            likeCount: { $size: "$allLikes" }
        }
    },

    // 4) Clean up
    {
        $project: {
            myLike: 0,
            allLikes: 0
        }
    },
    {
        $lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"owner"
        }
    },
    {
        $unwind:"$owner"
    }
]);

        console.log("Tweets likkekekek are ::",tweets);

        res.status(200).json(
            new ApiResponse(200,tweets,"tweets sent sucessfully")
        )

})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId, newContent } = req.body;

    if (!tweetId) {
        throw new ApiError(401, "tweet id is required");
    }
    const userTweet = await Tweet.findById(tweetId);

    if (!userTweet) {
        throw new ApiError(404, "user tweet not found");
    }

    if (userTweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(401, "only owner of tweet can update the tweet");
    }

    const updatedUserTweet = await Tweet.findByIdAndUpdate(
        userTweet._id,
        {
            content: newContent,
        },
        { new: true }
    );

    if (!updatedUserTweet) {
        throw new ApiError(
            500,
            "something wnet wrong while updating user tweet"
        );
    }

    res.status(200).json(
        new ApiResponse(
            200,
            updatedUserTweet,
            "user tweet updated successfully"
        )
    );
});

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    console.log("tweet id is ::",tweetId);

    if (!tweetId) {
        throw new ApiError(401, "tweet id is required");
    }

    const userTweet = await Tweet.findById(tweetId);

    if (!userTweet) {
        throw new ApiError(404, "no tweet with this id is found");
    }

    if (req.user?._id.toString() !== userTweet.owner.toString()) {
        throw new ApiError(401, "only owner can delete this tweet");
    }

    const deleteTweet = await Tweet.findByIdAndDelete(tweetId);
    if (!deleteTweet) {
        throw new ApiError(500, "something went wrong while deleting tweet");
    }
    res.status(200).json(
        new ApiResponse(200, true, "user tweet deleted successfully")
    );
});

export { createTweet, getUserTweets, updateTweet, deleteTweet,getChannelTweetsWithLikes };

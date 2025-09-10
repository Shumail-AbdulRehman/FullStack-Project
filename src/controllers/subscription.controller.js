import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const userId=req.user?._id;
    const isUserSubscribed=await Subscription.findOne(
        {
            subscriber:userId,
            channel:channelId
        }
    )
    if(!isUserSubscribed)
    {
        const subscribeChannel=await Subscription.create(
            {
                subscriber:userId,
                channel:channelId
            }
        )

        if(!subscribeChannel)
        {
            throw new ApiError(500,"something went wrong while subscribing the channel")
        }
        res.status(200)
        .json(
            new ApiResponse(200,true,"user successfully subscribed to the channel")
        )
    }
    else
    {
        const unSubscribeChannel=await Subscription.findByIdAndDelete(isUserSubscribed._id)
        if(!unSubscribeChannel)
        {
            throw new ApiResponse(500,"something went wrong while unsubscribing the channel")
        }
        res.status(200)
        .json(
            new ApiResponse(200,false,"user unsubscribed successfully")
        )
    }

})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // const userId=req.user?._id

    const userChannelSubscribers= await Subscription.aggregate([
        {
            $match:{
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"subscriber",
                foreignField:"_id",
                as:"subscriber"
                
            }
        },
        {
            $unwind:"$subscriber"
        },
        {
            $project: {
                _id: "$subscriber._id",
                fullName: "$subscriber.fullName",
                username: "$subscriber.username",
                email: "$subscriber.email",
                avatar: "$subscriber.avatar",
                createdAt: "$subscriber.createdAt"
            }
        }
    ]);

    if(!userChannelSubscribers.length)
    {
        res.status(200)
        .json(
            new ApiResponse(200,[],"no user is subscribed to your channel")
        )
    }

    res.status(200)
    .json(
        new ApiResponse(200,userChannelSubscribers,"subscribed user list fetched successfully")
    )






})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    
    const subscriberChannels=await Subscription.aggregate([
        {
            $match:{
                subscriber:new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup:
            {
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"channel"
            }
            
        },
        {
            $unwind:"$channel"
        },
        {
            $project:
            {
                 _id: "$channel._id",
                fullName: "$channel.fullName",
                username: "$channel.username",
                email: "$channel.email",
                avatar: "$channel.avatar",
                createdAt: "$channel.createdAt"
            }
        }
    ])

    if (!subscriberChannels.length) {
    return res.status(200).json(
        new ApiResponse(200, [], "User has not subscribed to any channels")
    );
    }

    res.status(200).json(
        new ApiResponse(200, subscriberChannels, "Subscribed channels fetched successfully")
    );

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
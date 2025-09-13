import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const{content}=req.body
    const userId=req.user?._id

    if(!content)
        {
            throw new ApiError(401,"content is required")
        }
    const userTweet=await Tweet.create(
        {
            owner:userId,
            content:content
        })

    if(!userTweet)
        {
            throw new ApiError(500,"something went wrong while creating tweet of user")
        }

    res.status(200)
    .json(
        new ApiResponse(200,userTweet,"tweet created successfully")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    const userId=req.user._id

    const userTweets=await Tweet.find({
        owner:userId
    })

    if(!userTweets.length)
    {
       return  res.status(200)
        .json(new ApiResponse(200,[],"no tweets found"))
    }

    res.status(200)
    .json(
        new ApiResponse(200,userTweets,"user tweets fetched successfully")
    )

})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId,newContent}=req.body

    if(!tweetId)
    {
        throw new ApiError(401,"tweet id is required")
    }
    const userTweet=await Tweet.findById(tweetId)

    if(!userTweet)
    {
        throw new ApiError(404,"user tweet not found")
    }

    if(userTweet.owner.toString() !== req.user?._id.toString())
    
    {
        throw new ApiError(401,"only owner of tweet can update the tweet")
    }


   

    const updatedUserTweet=await Tweet.findByIdAndUpdate(userTweet._id,{
        content:newContent,
        
    },
    {new:true})

    if(!updatedUserTweet)
    {
        throw new ApiError(500,"something wnet wrong while updating user tweet")
    }

    res.status(200)
    .json(
        new ApiResponse(200,updatedUserTweet,"user tweet updated successfully")
    )

    

})

const deleteTweet = asyncHandler(async (req, res) => {

    const {tweetId}=req.params

    if(!tweetId)
    {
        throw new ApiError(401,"tweet id is required")
    }

    const userTweet=await Tweet.findById(tweetId)

    if(!userTweet)
    {
        throw new ApiError(404,"no tweet with this id is found")
    }

    if(req.user?._id.toString() !== userTweet.owner.toString())
    {
        throw new ApiError(401,"only owner can delete this tweet")
    }

    const deleteTweet=await Tweet.findByIdAndDelete(tweetId)
    if(!deleteTweet)
    {
        throw new ApiError(500,"something went wrong while deleting tweet")
    }
    res.status(200)
    .json(
        new ApiResponse(200,true,"user tweet deleted successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
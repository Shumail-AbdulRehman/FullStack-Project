import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    console.log("video id is :=>",videoId)
    if(!videoId)
    {
        throw new ApiError(400,"video id is required")
    }

    const commentsAggregate=  Comment.aggregate([
        {
            $match:{
                video:new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField: "owner",
                foreignField: "_id",
                as:"owner",
                pipeline:
                [
                    {
                        $project:{
                            _id: true,
                            username: true,
                            avatar: true
                        }
                    }
                ]

            }
        },
        {
            $project:{
                content:true,
                createdAt:true,
                owner:true,
                video:true
            }
        }, 
        {
            $sort:{
                createdAt:-1
            }
        },
        {
            $unwind:"$owner"
        }
    ])

    const options={
        page:parseInt(page),
        limit:parseInt(limit)
    }

    // console.log("comments AGgregate is:=>",commentsAggregate);

    const comments=await Comment.aggregatePaginate(commentsAggregate,options)
    console.log("comments are =>",comments);
    res.status(200)
    .json(
        new ApiResponse(200,comments,"comments sent successfully")
    )


})

const addComment = asyncHandler(async (req, res) => {
    const {content}=req.body
    const {videoId}=req.params

    if(!(content && videoId))
    {
        throw new ApiError(400,"content and video id is required")
    }

    const userId=req.user._id

    const addedUserComment=await Comment.create(
        {
            content:content,
            video:videoId,
            owner:userId
        }
    
    
    )

    if(!addedUserComment)
    {
        throw new ApiError(500,"something wnet wrong while adding user comment")
    }

    res.status(200)
    .json(
        new ApiResponse(200,addedUserComment,"added user comment successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    const{newContent}=req.body
    const {commentId}=req.params

    if(!(commentId && newContent))
    {
        throw new ApiError(400,"comment id is required")
    }

    const userComment=await Comment.findById(commentId)

    if(!userComment)
    {
        throw new ApiError(404,"comment not found")
    }

    if(req.user?._id.toString() !== userComment.owner.toString())
    {
        throw new ApiError(403,"only owner can update comment")
    }

    const updatedUserComment=await Comment.findByIdAndUpdate(commentId,{
        content:newContent
    },{
        new:true
    })

    if(!updatedUserComment)
    {
        throw new ApiError(500,"couldnt update user comment ")
    }

    res.status(200)
    .json(
        new ApiResponse(200,updatedUserComment,"comment updated successfully")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    const{commentId}=req.params

    if(!commentId)
    {
        throw new ApiError(400,"comment id is required")
    }

    const userComment=await Comment.findById(commentId)

    if(!userComment)
    {
        throw new ApiError(404,"comment not found")
    }

    if(req.user?._id.toString() !== userComment.owner.toString())
    {
        throw new ApiError(403,"only owner can delete comment")
    }

    const deletedComment=await Comment.findByIdAndDelete(commentId)
    if(!deletedComment)
    {
        throw new ApiError(500,"something went wrong couldnt delete the user comment")
    }

    res.status(200).json
    (
        new ApiResponse(200,true,"comment deleted successfully")
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }

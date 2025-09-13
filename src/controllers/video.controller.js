import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description,videoLink,videoDuration} = req.body

    if(!(title && description && videoLink && videoDuration)) throw new ApiError(400,"title , description , video link and video duration is required")

    const userId=req.user._id
    const uploadThumbnail=await uploadOnCloudinary(req.file?.path)
    const thumbnailUrl=uploadThumbnail?.secure_url || null
    

    if(!thumbnailUrl) throw new ApiError(404,"thumbnail not found")
    
    const publishUserVideo=await Video.create({
        title,
        description,
        owner:userId,
        videoFile:videoLink,
        thumbnail:thumbnailUrl,
        videoDuration
    })

    if(!publishUserVideo) throw new ApiError(500,"something went wrong while publishing user video")
    
    res.status(201).json
    (
        new ApiResponse(201,publishUserVideo,"published user video successfully")
    )
    



})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if(!videoId) throw new ApiError(400,"video id is required")
    
    const video=await Video.findById(videoId)

    if(!video) throw new ApiError(404,"video not found")

    res.status(200).json(
        new ApiResponse(200,video,"video fetched successfully")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const {title,description}=req.body

    if(!req.file?.path) throw new ApiError(400,"thumbnail is required")
    const uploadThumbnail=await uploadOnCloudinary(req.file?.path)
    const userVideo=await Video.findById(videoId)
    if(req.user._id.toString() !==  userVideo.owner.toString()) throw new ApiError(401,"unauthorize access")
    if(!uploadThumbnail?.secure_url) throw new ApiError(500,"soemthing went wrong while updating thumnbnail")

    const updatedVideo=await Video.findByIdAndUpdate(videoId,
        {
            title:title,
            description:description,
            thumbnail:uploadThumbnail.secure_url
        },
        {
            new:true
        }
    )

    if(!updatedVideo) throw new ApiError(500,"soemthing went wrong while updating the video")
    
    res.status(200).json(
        new ApiResponse(200,updatedVideo,"video updated successfully")
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if(!videoId) throw new ApiError(400,"video id is required")
    
    const video=await Video.findById(videoId)
    if(!video) throw new ApiError(404,"video not found")
    if(req.user._id.toString() !== video.owner.toString()) throw new ApiError(401,"unauthorize access")

    const deleteVideo=await Video.findByIdAndDelete(videoId)

    if(!deleteVideo) throw new ApiError(500,"soemthing wnet wrong while deleting video")
    
    res.status(200).json(
        new ApiResponse(200,true,"video deleted successfully")
    )
    
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId) throw new ApiError(400,"video id is required")

    const video=await Video.findById(videoId)
    if(!video) throw new ApiError(404,"video not found")

    if(video.owner.toString() !== req.user._id.toString()) throw new ApiError(401,"unauthorize access")
    
    const updatePublishStatus=await Video.findByIdAndUpdate(videoId,
        {
            isPublished:!video.isPublished
        },
        {
            new:true
        }
    )

    res.status(200).json(
        new ApiResponse(200,updatePublishStatus,"publish status updated successfully")
    )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}





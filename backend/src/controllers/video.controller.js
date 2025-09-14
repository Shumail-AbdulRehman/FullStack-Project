import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { deleteImageByUrl } from "../utils/deleteImageFromCloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query

    const options={
        page:parseInt(page),
        limit:parseInt(limit)
    }

    const pipeline=[
        {
            $sort:{
                createdAt:-1
            }
        }
    ]
    const aggregate= Video.aggregate(pipeline)

    const result=await Video.aggregatePaginate(aggregate,options)

    res.status(200).json(
        new ApiResponse(200,result,"videos sent successfullt")
    )





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

    const updatedVideo = await Video.findByIdAndUpdate(videoId, updateData, { new: true });

    if (!updatedVideo) throw new ApiError(500, "something went wrong while updating the video");

    res.status(200).json(
        new ApiResponse(200, updatedVideo, "video updated successfully")
    );
});


const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if(!videoId) throw new ApiError(400,"video id is required")
    
    const video=await Video.findById(videoId)
    
    if(!video) throw new ApiError(404,"video not found")
    const oldVideoUrl=video?.videoFile
    const oldThumbnailUrl=video?.thumbnail
    if(req.user._id.toString() !== video.owner.toString()) throw new ApiError(401,"unauthorize access")

    const deleteVideo=await Video.findByIdAndDelete(videoId)

    if(!deleteVideo) throw new ApiError(500,"soemthing wnet wrong while deleting video")
    const videoDeletedFromCloudinary=await deleteImageByUrl(oldVideoUrl,"video")

    if(videoDeletedFromCloudinary?.result !== "ok") console.log(videoDeletedFromCloudinary,"something went wrong while deleting videoFile")
    const thumbnailDeletedFromCloudinary=await deleteImageByUrl(oldThumbnailUrl,"image")

    if(thumbnailDeletedFromCloudinary?.result !=="ok") console.log(thumbnailDeletedFromCloudinary,"something wnet wring while deleting thumbnail in deleteVideo controller")
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





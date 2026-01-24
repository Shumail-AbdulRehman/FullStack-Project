import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, selectedVideos } = req.body;
    const userId = req.user._id;

    if (!(name?.trim() && description?.trim()) && selectedVideos?.trim()) {
        throw new ApiError(
            400,
            "name and description and selected videos is required"
        );
    }

    const videoObjectIds = selectedVideos.map((id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid video ID");
        }
        return new mongoose.Types.ObjectId(id);
    });

    const createdUserPlaylist = await Playlist.create({
        name: name,
        description: description,
        owner: userId,
        videos: videoObjectIds,
    });

    if (!createdUserPlaylist)
        throw new ApiError(
            500,
            "something went wrong while creating user playlist"
        );

    res.status(200).json(
        new ApiResponse(
            200,
            createdUserPlaylist,
            "user playlist created successfully"
        )
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId?.trim()) throw new ApiError(400, "userId is required");

    const userPlaylists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
            },
        },
        {
            $addFields: {
                videos: {
                    $filter: {
                        input: "$videos",
                        as: "video",
                        cond: { $eq: ["$$video.isPublished", true] },
                    },
                },
            },
        },
        {
            $match: {
                videos: { $not: { $size: 0 } },
            },
        },
    ]);

    console.log("user playlists are::", userPlaylists);

    if (userPlaylists.length === 0)
        return res
            .status(200)
            .json(new ApiResponse(200, userPlaylists, "no playlist is found"));

    res.status(200).json(
        new ApiResponse(
            200,
            userPlaylists,
            "user playlists fetched successfully"
        )
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId?.trim()) throw new ApiError(400, "playlist id is required");

    // const playlist = await Playlist.findById(playlistId);

   const playlistAggregate = await Playlist.aggregate([
    {
        $match: {
            _id: new mongoose.Types.ObjectId(playlistId)
        }
    },
    {
        $lookup: {
            from: "videos",
            localField: "videos",
            foreignField: "_id",
            as: "videos",
            pipeline: [
                {
                    $match: { isPublished: true }
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
                    $project: {
                        title: 1,
                        thumbnail: 1,
                        description: 1, 
                        duration: 1,
                        views: 1,
                        createdAt: 1,
                        "owner.username": 1, 
                        "owner.avatar": 1,
                        "owner._id": 1 
                    }
                }
            ]
        }
    }
]);

const playlist = playlistAggregate[0];

if (!playlist) throw new ApiError(404, "playlist not found");

return res.status(200).json(
    new ApiResponse(200, playlist, "playlist fetched successfully")
);


});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    const userId = req.user?._id;

    if (!(playlistId && videoId))
        throw new ApiError(400, "playlist id and video id is required");

    const userPlaylist = await Playlist.findById(playlistId);

    if (!userPlaylist) throw new ApiError(404, "playlist not found");

    if (userId.toString() !== userPlaylist.owner.toString())
        throw new ApiError(401, "unauthorize access");

    const videoExistInPlaylist = await Playlist.find({
        _id: playlistId,
        videos: videoId,
    });

    if (videoExistInPlaylist.length !== 0)
        throw new ApiError(403, "video already exist in playlist");

    userPlaylist.videos.push(videoId);
    await userPlaylist.save();

    res.status(201).json(
        new ApiResponse(
            201,
            userPlaylist,
            "video added to playlist successfully"
        )
    );
});
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!(playlistId && videoId)) {
        throw new ApiError(400, "playlist id and video id is required");
    }

    const updatedPlaylist = await Playlist.findOneAndUpdate(
        { _id: playlistId, owner: req.user._id, videos: videoId },
        { $pull: { videos: videoId } },
        { new: true }
    );

    if (!updatedPlaylist) {
        throw new ApiError(404, "video not found or unauthorized access");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "video removed from playlist successfully"
        )
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId) throw new ApiError(400, "playlist id is required");

    const userPlaylist = await Playlist.findById(playlistId);

    if (!userPlaylist) throw new ApiError(404, "playlist not found");

    if (userPlaylist.owner.toString() !== req.user._id.toString())
        throw new ApiError(401, "unauthorize access");

    const deleteUserPlaylist = await Playlist.findByIdAndDelete(playlistId);

    if (!deleteUserPlaylist)
        throw new ApiError(
            500,
            "something went wrong while deleting user Playlist "
        );

    res.status(200).json(new ApiResponse(200, true, "playlist deleted"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!(playlistId && name && description))
        throw new ApiError(400, "playlistId,description and name is required");

    const updatedPlaylist = await Playlist.findOneAndUpdate(
        {
            owner: req.user._id,
            _id: playlistId,
        },
        {
            name: name,
            description: description,
        },
        {
            new: true,
        }
    );

    if (!updatedPlaylist) throw new ApiError(404, "playlist not found");

    res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "playlist updated sucessfully")
    );
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
};

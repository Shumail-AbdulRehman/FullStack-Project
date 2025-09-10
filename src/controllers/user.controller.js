import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { deleteImageByUrl } from "../utils/deleteImageFromCloudinary.js";
import mongoose from "mongoose";

const registerUser=asyncHandler(async(req,res)=>
    
{
   const {fullName,username,email,password}=req.body

   if(
    [fullName,username,email,password].some((filed)=> filed?.trim()==="")
   )
   {
    throw new ApiError(400,"all fields are required")
   }

   const userExist=await User.findOne(
    {
        $or:[{username},{email}]
    }
   )

   if(userExist)
   {
    throw new ApiError(409,"user with email or username already exits")
   }
   console.log("req.files is :=",req.files)

   const avatarLocalpath=req.files?.avatar[0]?.path;
   const coverImageLocalPath=req.files?.coverImage?.[0]?.path;
   console.log("local path for both",avatarLocalpath,coverImageLocalPath)
   if(!avatarLocalpath)
   {
    throw new ApiError(400,"avatar is required")
   }
   const avatar=await uploadOnCloudinary(avatarLocalpath)
   const coverImage=await uploadOnCloudinary(coverImageLocalPath)
   
   if(!avatar)
   {
    throw new ApiError(501,"failed to upload avatar")
   }

   const user=await User.create({
    fullName,
    email,
    password,
    username:username.toLowerCase(),
    avatar:avatar.url,
    coverImage:coverImage?.url || ""
   })

   const createdUser=await User.findById(user._id).select("-password -refreshToken")
   if(!createdUser)
   {
    throw new ApiError(500,"something went wrong with registering user")
   }

   res.status(200).json(
    new ApiResponse(200,createdUser,"user registered successfully")
   )
})

const userLogin=asyncHandler(async(req,res)=>
{
    const {email,password}=req.body;

    if(!(email && password))
    {
        throw new ApiError(400,"email and password is required");

    }

    const user= await User.findOne({email});

    if(!user)
    {
        throw new ApiError(404,"user with this email doesnt exist");

    }

    const isPasswordValid=await user.isPasswordCorrect( password )

    if(!isPasswordValid)
    {
        throw new ApiError(401,"Password incorrect")
    }

    const userAccessToken=await user.generateAccessToken()
    const userRefreshToken=await user.generateRefreshToken()

    if(!(userAccessToken && userRefreshToken))
    {
        throw new ApiError(500,"something went wrong with generating Tokens")
    }

    user.refreshToken=userRefreshToken
    await user.save()

    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly:true,  
        secure:true
    }

    res.status(200)
    .cookie("accessToken",userAccessToken,options)
    .cookie("refreshToken",userRefreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,userAccessToken,userRefreshToken
            },
            "user logged in successfully"
        )
    )


})

const userLogOut=asyncHandler(async(req,res)=>
{

    await User.findByIdAndUpdate(req.user._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {
            new:true
        }
    )

    const options={
        httpOnly:true,
        secure:true
    }

    res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"user logout successfully")
    )
})

const generateNewAccessToken=asyncHandler(async (req,res)=>
{
    const incomingRefreshToken= req.cookies?.refreshToken;

    if(!incomingRefreshToken)
    {
        throw new ApiError(401,"refresh Token is required")

    }
    let decodedIncomingRefreshToken;
    try {
         decodedIncomingRefreshToken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
    } catch (error) {
        throw new ApiError(401,"expired or invalid token")
    }
    const user=await User.findById(decodedIncomingRefreshToken._id)

    if(!user)
    {
        throw new ApiError(401,"invalid refresh Token")
    }

    if(user.refreshToken!==incomingRefreshToken)
    {
        throw new ApiError(401,"user refreshToken doesnt matches with incoming refreshToken")
    }

    const newAccessToken= await user.generateAccessToken();
    const newRefreshToken=await user.generateRefreshToken();

    user.refreshToken=newRefreshToken

    await user.save()

    const updatedUserData=await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true
    }

    res.status(200)
    .cookie("accessToken",newAccessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(
        new ApiResponse(200,{updatedUserData,refreshToken:newRefreshToken,accessToken:newAccessToken},"new accessToken and refreshToken generated successfully")
    )
})

const getCurrentUser=asyncHandler(async(req,res)=>
{
    const user=req?.user;
    if(!user)
    {
        throw new ApiError(401,"no user found")
    }

    res.status(200)
    .json(
        new ApiResponse(200,user,"user found")
    )
})

const updateUserEmailAndFullName=asyncHandler(async(req,res)=>
{
    const{newEmail,newFullName}=req.body;

    if(!(newEmail&&newFullName))
    {
        throw new ApiError(400,"email and fullname is required ")
    }

    const checkUser=req?.user;

    if(!checkUser)
    {
        throw new ApiError(401,"unauthorize access")
    }

    const checkEmailUsedByAnotherUser = await User.findOne({ 
        email: newEmail, 
        _id: { $ne: checkUser._id } 
    });

    

    if(checkEmailUsedByAnotherUser)
    {
        throw new ApiError(409,"email is being used by another user");
    }

    

    const user=await User.findById(checkUser._id).select("-password -refreshToken")

    if(!user)
    {
        throw new ApiError(401,"user not found");
    }

    user.email=newEmail.trim();
    user.fullName=newFullName.trim();

    await user.save()

    res.status(200).json(
        new ApiResponse(200,user,"email and fullname updated successfully")
    )
    
})

const updateAvatar=asyncHandler(async(req,res)=>
{
    const avatarLocalpath=req.file?.path

    if(!avatarLocalpath)
    {
        throw new ApiError(401,"avatar is required")
    }

    const avatar=await uploadOnCloudinary(avatarLocalpath)

    if(!avatar.url)
    {
        throw new ApiError(500,"something went wrong while uploading avatar");
    }

    const oldUserAvatar=req.user?.avatar

    const user=await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            avatar:avatar.url
        }
    },{new:true}).select("-password -refreshToken")

    if(!user)
    {
        throw new ApiError(401,"user not found")
    }

    try {
        const oldUserAvatarDeleted=await deleteImageByUrl(oldUserAvatar)
    
        
        console.log(oldUserAvatarDeleted)
    } catch (error) {
        console.log("avatar image not deleted and error is:",error)
    }

    res.status(200).json(
        new ApiResponse(200,user,"avatar updated successfully")
    )

})

const updateCoverImage=asyncHandler(async(req,res)=>
{
    const coverImageLocalPath=req.file?.path

    if(!coverImageLocalPath)
    {
        throw new ApiError(400,"cover image is required");
    }

    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url)
    {
        throw new ApiError(500,"something went wrong while uploading coverImage");
    }

    const oldUserCoverImage=req.user?.coverImage
    
    const user=await User.findByIdAndUpdate(req.user?._id,{
        $set:{coverImage:coverImage.url}
    },{new:true}).select("-password -refreshToken")

    if(!user)
    {
        throw new ApiError(404,"user not found")
    }

    if(oldUserCoverImage)
    {
        try {
            const oldUserCoverImageDeleted=await deleteImageByUrl(oldUserCoverImage)
    
        
            console.log(oldUserCoverImageDeleted)
        } catch (error) {
            console.log("old cover image not deleted error:",error)
        }
    }
    

    res.status(200).json(
        new ApiResponse(200,user,"cover image updated successfully")
    )
})

const getUserChannelProfile=asyncHandler(async(req,res)=>
{
    const {username}=req.params
    if(!username?.trim())
    {
        throw new ApiError(400,"username is missing")
    }
    const loggedInUserId = new mongoose.Types.ObjectId(req.user?._id);
    const channel=await User.aggregate([
        {
            $match:{
                username: username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }
        },
        {
            $addFields:
            {
                subscribersCount:{
                    $size: "$subscribers"
                },
                channelSubscribedTo:{
                    $size:"$subscribedTo"
                },
                isSubscribed:{
                    $cond:{
                        if:{
                            $in:[loggedInUserId,"$subscribers.subscriber"]
                        },
                        then:true,
                        else:false
                    }
                }
            }
        },
        {
            $project:{
                fullName:1,
                username:1,
                subscribersCount:1,
                channelSubscribedTo:1,
                isSubscribed:1,
                _id:1,
                avatar:1,
                coverImage:1,
                email:1,
                createdAt:1

            }
        }
    ])

    if(!channel?.length)
    {
        throw new ApiError(404,"channel doesnt exist")
    }


    res.status(200).json(
        new ApiResponse(200,channel[0],"user channel data sent successfully")
    )

    
})

const getUserWatchHistory=asyncHandler(async(req,res)=>
{
    const userWatchHistory=await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)
            },
            
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:
                        {
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        fullName:1,
                                        username:1,
                                        avatar:1,
                                        coverImage:1

                                    }
                                }
                            ]
                        },
                        
                       
                    },
                    {
                            $addFields:{
                                owner:{
                                    $first:"$owner"
                                }
                            }
                    }
                ]
            }
        },
        {
            $project:{
                watchHistory:1
            }
        }
    ])

   
    res.status(200)
    .json(
        new ApiResponse(200,userWatchHistory,"user watch history sent successfully")
    )
})



export {
    registerUser,
    userLogin,
    userLogOut,
    generateNewAccessToken,
    getCurrentUser,
    updateUserEmailAndFullName,
    updateAvatar,
    updateCoverImage,
    getUserChannelProfile,
    getUserWatchHistory,
}
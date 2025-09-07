import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

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

export {registerUser}
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        index:true,
        unique:true
    },
    coverImage:{
        type:String
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    avatar:
    {
        type:String,
        required:true
    },
    password:
    {
        type:String,
        required:true
    },
    refreshToken:
    {
        type:String
    },
    email:
    {
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    fullName:
    {
        type:String,
        required:true,
        trim:true,
        index:true
    },

},{
    timestamps:true
})

userSchema.pre("save",async function(next)
{
    if(!this.isModified("password")) return next();

    this.password= await  bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect=async function(pass)
{
    return await bcrypt.compare(pass,this.password)
}


userSchema.methods.generateAccessToken= function()
{
   return  jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken=function()
{
    return jwt.sign(
        {
             _id:this._id
            
        },
        REFRESH_TOKEN_SECRET,
        {
            expiresIn:REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model("User",userSchema)

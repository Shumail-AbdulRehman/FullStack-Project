import mongoose, { Schema } from "mongoose";

const watchHistorySchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        video: { type: Schema.Types.ObjectId, ref: "Video" },
        watchedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

export const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);

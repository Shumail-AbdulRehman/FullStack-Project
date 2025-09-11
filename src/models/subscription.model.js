import mongoose, {Schema} from "mongoose"

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId, 
        ref: "User"
    }
}, {timestamps: true})

// chai aur code, ducky,
// shumail,arham,asnan 

export const Subscription = mongoose.model("Subscription", subscriptionSchema)
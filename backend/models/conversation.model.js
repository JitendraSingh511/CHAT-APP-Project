import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    messages:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message"
        }
    ]
},{timestamps:true})

const conversation = mongoose.model("Conversation",conversationSchema)

export default conversation
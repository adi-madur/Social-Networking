import mongoose from 'mongoose';
let { Schema } = mongoose;

let postSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
})

let postModel = mongoose.model("posts", postSchema);

export default postModel;
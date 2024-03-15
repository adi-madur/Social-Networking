import mongoose from 'mongoose';
const { Schema } = mongoose;

const postSchema = new Schema({
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

const postModel = mongoose.model("posts", postSchema);

export default postModel;
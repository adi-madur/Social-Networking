import mongoose from 'mongoose';
const { Schema } = mongoose;

const followSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    followers: {
        type: Array,
    },
    following: {
        type: Array,
    },
})

const followModel = mongoose.model('follow', followSchema);

export default followModel;
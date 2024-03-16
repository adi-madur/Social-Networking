import mongoose from 'mongoose';
let { Schema } = mongoose;

let followSchema = new Schema({
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

let followModel = mongoose.model('follow', followSchema);

export default followModel;
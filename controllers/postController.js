import postModel from './../models/postSchema.js';
import inputValidator from './../middlewares/validator.js';

let createPost = async (req, res) => {
    let userId = req.user.id;

    let { content } = req.body;

    userId = inputValidator(userId);

    if(!content) {
        return res.status(404).json({
            success: false,
            msg: "Content is Missing"
        })
    }

    let postAlreadyExists = await postModel.findOne({
        content,
        userId,
    })
    
    if(postAlreadyExists) {
        return res.status(400).json({
            success: false,
            msg: "You have already posted this content",
        })
    }
    
    let postInfo = postModel({
        userId,
        content,
    })

    let result = await postInfo.save()

    return res.status(200).json({
        success: true,
        msg: "Post created successfully",
        post: result,
    })

}

let viewPost = async (req, res) => {
    let userId = req.user.id;
    userId = inputValidator(userId);
    let result = await postModel.find({userId});

    res.status(200).json({
        success: true,
        msg: "User's Post's fetched Successfully",
        posts: result
    })

}

let deletePost = async (req, res) => {
    let uid = req.user.id;

    let { postId } = req.body;

    uid = inputValidator(uid);
    postId = inputValidator(postId);

    let postDetails = await postModel.findById(postId);

    if(!postDetails) {
        return res.status(400).json({
            success: false,
            msg: "Post does not exist",
        })
    }

    if(uid !== postDetails.userId) {
        return res.status(400).json({
            success: false,
            msg: "This is not your post"
        })
    }

    try {
        let result = await postModel.findByIdAndDelete(postId);

        return res.status(200).json({
            success: true,
            msg: "Post deleted successfully",
            deletedpost: result,
        })

    } catch(e) {
        return res.status(400).json({
            success: false,
            msg: e.message,
        })
    }


}

let updatePost = async (req, res) => {
    let uid = req.user.id;
    let { postId, content } = req.body;
    uid = inputValidator(uid);
    postId = inputValidator(postId);


    if(!content) {
        return res.status(404).json({
            success: false,
            msg: "Content is missing",
        })
    }

    let postDetails = await postModel.findById(postId);

    if(!postDetails) {
        return res.status(400).json({
            success: false,
            msg: "Post does not exist",
        })
    }

    if(uid !== postDetails.userId) {
        return res.status(400).json({
            success: false,
            msg: "Not your post to update",
        })
    }

    let result = await postModel.findByIdAndUpdate(postId, { content });

    return res.status(200).json({
        success: true,
        msg: "Post Updated Successfully",
        updatedPost: result,
    })

}

export {
    createPost,
    viewPost,
    deletePost,
    updatePost,
}
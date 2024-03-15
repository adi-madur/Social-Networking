import postModel from './../models/postSchema.js';

const createPost = async (req, res) => {
    const userId = req.user.id;

    const { content } = req.body;

    if(!content) {
        return res.status(404).json({
            success: false,
            msg: "Content is Missing"
        })
    }

    const postAlreadyExists = await postModel.findOne({
        content,
        userId,
    })
    
    if(postAlreadyExists) {
        return res.status(400).json({
            success: false,
            msg: "You have already posted this content",
        })
    }
    
    const postInfo = postModel({
        userId,
        content,
    })

    const result = await postInfo.save()

    return res.status(200).json({
        success: true,
        msg: "Post created successfully",
        post: result,
    })

}

const viewPost = async (req, res) => {
    const userId = req.user.id;

    const result = await postModel.find({userId});

    res.status(200).json({
        success: true,
        posts: result
    })

}

const deletePost = async (req, res) => {
    const uid = req.user.id;

    const { postId } = req.body;

    const postDetails = await postModel.findById(postId);

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
        const result = await postModel.findByIdAndDelete(postId);

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

const updatePost = async (req, res) => {
    const uid = req.user.id;

    const { postId, content } = req.body;

    if(!content) {
        return res.status(404).json({
            success: false,
            msg: "Content is missing",
        })
    }

    const postDetails = await postModel.findById(postId);

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

    const result = await postModel.findByIdAndUpdate(postId, { content });

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
import followModel from './../models/followSchema.js';
import postModel from './../models/postSchema.js';
import inputValidator from './../middlewares/validator.js';

let followUser = async (req, res) => {
    try {
        let uid = req.user.id;
        let { userIdToFollow } = req.body;

        uid = inputValidator(uid);
        userIdToFollow = inputValidator(userIdToFollow);

        if(uid.toString() === userIdToFollow.toString()) {
            return res.status(400).jsonn({
                success: false,
                msg: "You cannot follow / unfollow yourself.",
            })
        }

        if (!userIdToFollow) {
            return res.status(404).json({
                success: false,
                msg: "No userId is provided to follow",
            })
        }

        // Find the authenticated user's document
        let authenticatedUser = await followModel.findOne({ userId: uid });

        // Find the user document to be followed
        let userToFollow = await followModel.findOne({ userId: userIdToFollow });

        if (!userToFollow) {
            return res.status(404).json({
                success: false,
                msg: "User doesn't exist with this id",
            })
        }

        // Check if the authenticated user is already following the user
        if (authenticatedUser.following.includes(userIdToFollow)) {
            return res.status(400).json({
                success: false,
                msg: 'You are already following this user',
            });
        }

        // Updating the authenticated user's following array
        authenticatedUser.following.push(userIdToFollow);
        await authenticatedUser.save();

        // Updating the user's followers array
        userToFollow.followers.push(uid);
        await userToFollow.save();

        res.status(200).json({
            success: true,
            message: `User ${userIdToFollow} followed successfully`,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: "Something Went Wrong!",
            error: err,
        });
    }
}

let unfollowUser = async (req, res) => {
    try {
        let uid = req.user.id;
        let { userIdToUnfollow } = req.body;

        uid = inputValidator(uid);
        userIdToUnfollow = inputValidator(userIdToUnfollow);


        if(uid.toString() === userIdToUnfollow.toString()) {
            return res.status(400).jsonn({
                success: false,
                msg: "You cannot follow / unfollow yourself.",
            })
        }

        let authenticatedUser = await followModel.findOne({ userId: uid });

        let userToUnfollow = await followModel.findOne({ userId: userIdToUnfollow });

        // Check if the authenticated user is following the user
        if (!authenticatedUser.following.includes(userIdToUnfollow)) {
            return res.status(400).json({
                success: false,
                msg: 'You are not following this user',
            });
        }

        // Remove the userIdToUnfollow from the authenticated user's following array
        authenticatedUser.following = authenticatedUser.following.filter(
            userId => userId.toString() !== userIdToUnfollow
        );
        await authenticatedUser.save();

        // ObjectId may look like a string when printed or stringified, it's still an object data type in MongoDB, and we need to convert it to a string explicitly for correct comparison with other strings.

        // Remove the uid from the userToUnfollow's followers array
        userToUnfollow.followers = userToUnfollow.followers.filter(
            userId => userId.toString() !== uid
        );
        await userToUnfollow.save();

        res.status(200).json({
            success: true,
            msg: `User ${userIdToUnfollow} unfollowed successfully`,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
}

let followDetails = async (req, res) => {
    let uid = req.user.id;

    uid = inputValidator(uid);

    try {

        let userDetails = await followModel.findOne({ userId: uid });

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                msg: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            msg: "User's Follow details fetched successfully",
            following: userDetails.following,
            followers: userDetails.followers,
        })
    } catch (e) {
        return res.status(500).json({
            success: false,
            msg: e.message,
        })
    }

}

let userFeed = async (req, res) => {
    try {
        let userId = req.user.id;
        userId = inputValidator(userId);


        // Get the document of the authenticated user from the followModel
        let userFollowDoc = await followModel.findOne({ userId });

        // Use the Aggregation Framework to fetch posts from the followed users
        let userFeed = await postModel.aggregate([
            {
                $match: {
                    userId: { $in: userFollowDoc.following },
                },
            },
            {
                $sort: {
                    createdAt: -1, // Sort by createdAt in descending order (most recent first)
                },
            },
        ]);

        return res.status(200).json({
            success: true,
            msg: "User's feed fetched successfully",
            data: userFeed,
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            msg: e.message,
        });
    }
}

export {
    followUser,
    unfollowUser,
    followDetails,
    userFeed,
}
import followModel from './../models/followSchema.js';

const followUser = async (req, res) => {
    try {
        const uid = req.user.id;
        const { userIdToFollow } = req.body;

        if (!userIdToFollow) {
            return res.status(404).json({
                success: false,
                msg: "No userId is provided to follow",
            })
        }

        // Find the authenticated user's document
        const authenticatedUser = await followModel.findOne({ userId: uid });

        // Find the user document to be followed
        const userToFollow = await followModel.findOne({ userId: userIdToFollow });

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

const unfollowUser = async (req, res) => {
    try {
        const uid = req.user.id;
        const { userIdToUnfollow } = req.body;

        const authenticatedUser = await followModel.findOne({ userId: uid });

        const userToUnfollow = await followModel.findOne({ userId: userIdToUnfollow });

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

const followDetails = async (req, res) => {
    const uid = req.user.id;

    try{

        const userDetails = await followModel.findOne({userId: uid});
        
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

export {
    followUser,
    unfollowUser,
    followDetails,
}
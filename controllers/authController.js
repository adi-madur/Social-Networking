import followModel from "../models/followSchema.js";
import userModel from './../models/userSchema.js';
import postModel from './../models/postSchema.js';
import inputValidator from './../middlewares/validator.js';

import bcrypt from 'bcrypt';

let signup = async (req, res, next) => {
    let { username, password, pfpurl, bio } = req.body;
    // Validating
    username = inputValidator(username);

    // Checking if all fields are provided
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Every field is required"
        })
    }

    try {

        let userInfo = userModel(req.body);
        let result = await userInfo.save();


        // Creating empty followers and following list of the user
        let createUserFollowDoc = async (userId) => {
            try {
                let newFollowDoc = new followModel({
                    userId,
                    followers: [],
                    following: [],
                });

                await newFollowDoc.save();
            } catch (err) {
                console.error('Error creating follow document:', err);
            }
        };

        // After successfully creating a new user
        await createUserFollowDoc(result._id);

        return res.status(200).json({
            success: true,
            message: "User Signed up successfully",
            data: result
        })



    } catch (e) {

        if (e.code === 11000) { //--> 11000 code is a error code for duplicate key. i.e same username
            return res.status(400).json({
                success: false,
                message: "Account already exists with this username"
            })
        }

        return res.status(400).json({
            success: false,
            message: e.message
        })
    }

}

let signin = async (req, res) => {
    let { username, password } = req.body;

    username = inputValidator(username);

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Every field is mandatory"
        })
    }

    try {
        let user = await userModel
            .findOne({ username })
            .select('+password')

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        // Generating Token for a User
        let token = user.jwtToken();
        // Since we don't need password now, we'll clear it
        user.password = undefined;

        // Creating Cookie as Object
        let cookieOption = {
            maxAge: 24 * 60 * 60 * 1000, //--> 24 h in milliseconds
            httpOnly: true,
        }

        // Now putting the cookieOption in Cookies
        res.cookie("token", token, cookieOption); //--> The 3 fields are Name, token and CookieObject
        res.status(200).json({
            success: true,
            message: "User Logged in successfully",
            data: user
        })
    } catch (end) {
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }



}

let getUser = async (req, res) => {
    let userId = req.user.id;

    userId = inputValidator(userId);
    try {
        let user = await userModel.findById(userId);
        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            data: user
        })
    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }
}

let logout = (req, res) => {
    // To Logout, the user must be first logged in. Hence the flow goes to `jwtAuth` middleware first
    // And the method to log out is just deleting the token / cookie.
    try {
        let cookieOption = {
            expires: new Date(),
            httpOnly: true,
        }

        res.cookie("token", null, cookieOption);

        res.status(200).json({
            success: true,
            message: "Logged Out successfully"
        })

    } catch (e) {
        res.status(200).json({
            success: false,
            message: e.message
        })
    }
}

let updateUser = async (req, res) => {
    let userId = req.user.id;
    let { username, bio, pfpurl, password } = req.body;

    username = inputValidator(username);

    try {

        let updateFields = {};

        // Building the update object with only the fields that are provided in the request body
        if (username) updateFields.username = username;
        if (bio) updateFields.bio = bio;
        if (pfpurl) updateFields.pfpurl = pfpurl;
        if (password) {
            updateFields.password = await bcrypt.hash(password, 10);
        }
        // Check if updateFields is empty
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                success: false,
                msg: 'No fields provided for updating user details'
            });
        }

        let newUserDetails = await userModel.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            msg: "User Details updated successfully",
            updatedData: newUserDetails,
        })

    } catch (e) {
        return res.status(400).json({
            success: false,
            msg: e.message,
        })
    }

}

let deleteUser = async (req, res) => {

    let userId = req.user.id;
    userId = inputValidator(userId);
    // User must be signed in, then First account is deleted, then logout.
    try {
        // Deleting an account from userModel
        await userModel.findByIdAndDelete(userId);
        // Deleting follow list too
        await followModel.findOneAndDelete({ userId });

        // Delete userId from `following` & `followers` from all other users
        let followDocuments = await followModel.find({
            $or: [{ following: userId }, { followers: userId }],
        });

        for (let followDocument of followDocuments) {
            followDocument.following = followDocument.following.filter(
                (id) => id.toString() !== userId.toString()
            );
            followDocument.followers = followDocument.followers.filter(
                (id) => id.toString() !== userId.toString()
            );
            await followDocument.save();
        }

        // Delete all posts created by the user
        await postModel.deleteMany({ userId });

        // Deleting Cookie and Logging Out
        let cookieOption = {
            expires: new Date(),
            httpOnly: true,
        }

        res.cookie("token", null, cookieOption);

        return res.status(200).json({
            success: true,
            message: "User Deleted and Logged Out successfully",
        })

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message,
        })
    }

}

export {
    signup,
    signin,
    getUser,
    logout,
    updateUser,
    deleteUser,
}
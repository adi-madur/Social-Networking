import followModel from "../models/followSchema.js";
import userModel from "../models/userSchema.js";

// import emailValidator from 'email-validator'; 
import bcrypt from 'bcrypt';

const signup = async (req, res, next) => {
    const { username, password, pfpurl, bio } = req.body;

    // Checking if all fields are provided
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Every field is required"
        })
    }

    try {

        const userInfo = userModel(req.body);
        const result = await userInfo.save();


        // Creating empty followers and following list of the user
        const createUserFollowDoc = async (userId) => {
            try {
                const newFollowDoc = new followModel({
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

const signin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Every field is mandatory"
        })
    }

    try {
        const user = await userModel
            .findOne({ username })
            .select('+password')

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            })
        }

        // Generating Token for a User
        const token = user.jwtToken();
        // Since we don't need password now, we'll clear it
        user.password = undefined;

        // Creating Cookie as Object
        const cookieOption = {
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

const getUser = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await userModel.findById(userId);
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

const logout = (req, res) => {
    // To Logout, the user must be first logged in. Hence the flow goes to `jwtAuth` middleware first
    // And the method to log out is just deleting the token / cookie.
    try {
        const cookieOption = {
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

const updateUser = async (req, res) => {
    const userId = req.user.id;
    const { username, bio, pfpurl, password } = req.body;
    try {

        const updateFields = {};

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

        const newUserDetails = await userModel.findByIdAndUpdate(
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

export {
    signup,
    signin,
    getUser,
    logout,
    updateUser,
}
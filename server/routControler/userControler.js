import User from "../schema/userSchema.js";
import jwt from "jsonwebtoken";

export const getAlUsers = async (req,res) => {
    const currentUserId = req.user?._conditions?._id;
    if(!currentUserId) return res.status(401).json({success : false, message : "unauthorized"});
    try {
        const users = await User.find({_id:{$ne:currentUserId}},"profilepic email username gender");
        res.status(200).json({success:true, users});
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        });
        console.log(error);
    }
}

// Search user by username or email
export const getUserByUsernameOrEmail = async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, message: "Query is required." });

    try {
        const user = await User.findOne(
            { $or: [{ username: query }, { email: query }] },
            "fullname email username gender"
        );

        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id, "fullname email username gender profilepic");
        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Invalid user ID." });
    }
};
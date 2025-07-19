import User from "../schema/userSchema.js";

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
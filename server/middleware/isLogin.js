import User from "../schema/useSchema.js";
import jwtToken from "../utils/jwtToken.js";

const isLogin = (req,res,next) => {
    try {
        const token = req.cookies.jwt || req.headers.cookie.split(";").find((cookie) => cookie.startsWith("jwt="))?.split("=")[1];
        if(!token) return res.status(500).send({
            success: false,
            message : "user unauthorized"
        });

        const decode = jwt.verify(token,process.env.JWT_SECRET);
        if(!decode) return res.status(500).send({
            success: false,
            message : "user unauthorized - Invalid token"
        });

        const user = User.findById(decode.userId).select("-password");
        if(!user) return res.status(500).send({success:false, message:"User not found"});
        req.user = user;
        next()
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        });
        console.log("isLogin middleware error : ",error);
    }
}

export default isLogin;
import User from "../schema/useSchema.js";
import jwtToken from "../utils/jwtToken.js";

export const SignUp = async (req, res) => {
    try {
        const { fullname, username, email, password, gender, profilepic } = req.boby;
        const user = await User.findOne({ username });
        if (user) return res.status(500).send({ success: false, message: "User alreadt exist with this UserName" });
        const emailpresent = await User.findOne({ email });
        if (emailpresent) return res.status(500).send({ success: false, message: "User alreadt exist with this Email" });
        const hashPassword = bcrypt.hashSync(password, 10)
        const boyProfilePic = profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = profilepic || `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullname,
            username,
            email,
            password,
            gender,
            profilepic: gender === "male" ? boyProfilePic : girlProfilePic
        })
        if (newUser) {
            await newUser.save();
        } else {
            res.status(500).send({
                success: false,
                message: "Invalid User Data"
            });
        }
        res.status(201).send({
            success: false,
            message: "Signup Successful"
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        });
        console.log(error);
    }
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.boby;
        const user = User.findOne({ email });
        if (!user) return res.status(500).send({ success: false, message: "Incorrect Email or Password !!!" });
        const comparePassword = bcrypt.compareSync(password, user.password || '');
        if (!comparePassword) return res.status(500).send({ success: false, message: "Incorrect Email or Password !!!" });

        const token = jwtToken(user._id, res);

        res.status(200).send({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilepic: user.profilepic,
            email: user.email,
            message: "LogIned Successfully",
            token
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        });
        console.log(error);
    }
}

export const LogOut = async(req,res) => {
    try {
        res.clearcookie('jwt',{
            path : '/',
            httpOnly : true,
            secure : true
        });
        res.status(200).send({ message: "User LogOut" });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error
        });
        console.log(error);
    }
}
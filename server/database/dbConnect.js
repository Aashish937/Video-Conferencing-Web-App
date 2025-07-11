import mongoose from "mongoose";

const dbConnect = async() => {
    try {
        await mongoose.connect(process.env.MONGOOSE_CONNECTION),
        console.log("Connected to Database");
    } catch (error) {
        console.log("failed to connect",error);
    }
}

export default dbConnect;
import mongoose from "mongoose";

const connectDb=async()=>{
    mongoose.connection.on('connected',()=>console.log("database is connected"))
    await mongoose.connect(`${process.env.MongoDB_URI}/hospital`)
}

export default connectDb;
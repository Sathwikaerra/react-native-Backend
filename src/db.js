import mongoose from "mongoose"

export  const connectDB=async()=>{

    try {
        const conn=await mongoose.connect(process.env.MONGO_URL);
        console.log("DB connected")
        
    } catch (error) {

        console.log("error in Db")
        process.exit(1);
        
    }

}
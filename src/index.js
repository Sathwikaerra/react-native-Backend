import express from "express"
import "dotenv/config"
import authRoutes from "./routes/authRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"
import { connectDB } from "./db.js";
import cors from "cors"
import job from "./cron.js";

const app=express();
const port=process.env.PORT || 3000

job.start();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/user",authRoutes)
app.use("/api/books",bookRoutes)


app.listen(port,()=>{

    console.log(`server is running on port ${port}`)
    connectDB();

});
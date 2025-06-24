import jwt from "jsonwebtoken"
import User from "../models/User.js"

const protectRoute=async(req,res,next)=>{
    try {
        
        const token=req.header("Authorization").replace("Bearer","");// bearer ${token} so , beaerer ="" to get token 
        if(!token)
        {
            return res.status(401).json({message:"No Authentication token access denied"})
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        const user=await User.findById(decoded.userId).select("-password")// we signed in -> as userId 
          if(!user)
        {
            return res.status(401).json({message:"token is not valid"})
        }

        req.user=user;
        next();

    } catch (error) {
        console.log("error :",error.message),
     res.status(401).json({message:"token is not valid"})


        
    }


}

export default protectRoute;
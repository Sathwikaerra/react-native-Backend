import express from "express"
import User from "../models/User.js"
import jwt from "jsonwebtoken"


const router=express.Router()

const generateToken=(userId)=>{
    
    return jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"15d"});


}

router.post("/register",async(req,res)=>{
    try {

        const {username,password,email}=req.body;

        console.log(username,password,email)

        
   
        if(!username || !password || !email)
        {
            console.log("2")
            return res.status(400).json({message:"All fields are required"})
        }
         if(username.length < 3)
        {
            console.log("3")
            return res.status(400).json({message:"username should be at least 3 characters long"})
        }
         if(password.length < 6)
        {
            console.log("4")
            return res.status(400).json({message:"password should be at least 6 characters long"})
        }

       const existingEmail=await User.findOne({email});
       
       if(existingEmail)
       {
        console.log("alredy has")
        return res.status(400).json({message:"Email already exists"})
       }

        const existingUserName=await User.findOne({username});
       if(existingUserName)
       {
        console.log("alredy has anme")
        return res.status(400).json({message:"UserName already exists"})
       }

       const profileImage=`https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`
        
       const user=new User({
        username,
        email,
        password,
        profileImage
       })

       console.log("2")

       await user.save();
       const token=generateToken(user._id);

       console.log("3")

       res.status(201).json({
        token,
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            createdAt:user.createdAt,
            profileImage:user.profileImage,
        }
       })
       console.log("4")

    } catch (error) {
        console.log("error in registration",error)
        return res.status(500).json({message:"internal Server Error"})

        
    }
})

router.post("/login",async(req,res)=>{

    try {
        
    const {email,password}=req.body;
    if( !password || !email)
        {
            return res.status(400).json({message:"All fields are required"})
        }

    const user=await User.findOne({email});
    if(!user)
    {
     return res.status(400).json({message:"user doesnot exists"})   
    }

    const ispassword=await user.comparePassword(password);
     if(!ispassword)
    {
     return res.status(400).json({message:"Invalid Credentials"})   
    }


    const token=generateToken(user._id);

       res.status(201).json({
        token,
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            profileImage:user.profileImage,
        }
       })
    


    } catch (error) {
        
    }

    
   
})



export default router;
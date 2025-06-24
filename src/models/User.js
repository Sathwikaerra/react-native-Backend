import mongoose from "mongoose";
import bcrypt from "bcryptjs"


const UserSchema =new mongoose.Schema({
     username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        
    },
    profileImage:{
        type:String,
        default:""

    }

},{timestamps:true});

UserSchema.pre("save",async function(next) {

    if(!this.isModified("password")) return next()

    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);

    next();

    
})

UserSchema.methods.comparePassword= async function(userpassword) {

    return await bcrypt.compare(userpassword,this.password);
    
    
}

const User=mongoose.model("User",UserSchema);


export default User;
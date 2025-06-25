import express from "express"
import cloudinary from "../cloudinary.js"
import Book from "../models/Book.js"
import protectRoute from "../middleware/auth.middleware.js";

const router=express.Router()

router.post("/",protectRoute ,async(req,res)=>{
    try {

        const { title,rating,caption,image}=req.body;
        if(!image || !title || !caption || !rating) {
            return res.status(400).json({message:"please provide all fields"})
        }

        //upload image to cloudinary 
        const uploadResponse=await cloudinary.uploader.upload(image);
        const imageUrl=uploadResponse.secure_url;

        const newBook=new Book({
            title,
            rating,
            caption,
            image:imageUrl,
            user:req.user._id,
        })

        await newBook.save();
        
        res.status(201).json({newBook})

        
    } catch (error) {
        console.log("error creating Book")
        res.status(500).json({message:error.message})
        
    }
})

router.get("/",async(req,res)=>{
    try {
        const page=req.query.page || 1;
        const limit=req.query.limit || 5;
        const skip=(page-1)*limit;


        const books=await Book.find().sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        .populate("user","username profileImage");

        const totalBooks=await Book.countDocuments();

        res.send({
            books,
            currentpage:page,
            totalBooks,
            totalPages:Math.ceil(totalBooks/limit)

        })

        
    } catch (error) {
        console.log("error in get all books route")
        res.status(500).json({message:"internal server error "})
        
    }
})


router.delete("/:id",protectRoute,async(req,res)=>{
    try {
        const book=await Book.findById(req.params.id);
        if(!book) return res.status(400).json({message:"Book not found"});

        if(book.user.toString() !== req.user._id.toString())
        {
            return res.status(400).json({message:"Unauthorized"});
        } 
         
            //delete from cloudinary
            if(book.image && book.image.includes("cloudinary"))
            {
                try {

                    const publicId=book.image.split("/").pop().split(".")[0]
                    await cloudinary.uploader.destroy(publicId);
                    
                } catch (DeleteError) {
                console.log("error in deleting the  book from cloudinary")

                    
                }
            }



        await book.deleteOne();

        res.json({message:"book deleted Successfully"})

    } catch (error) {
         console.log("error in deleting the  book")
        res.status(500).json({message:"internal server error "})
        
    }
})


router.get("/user",protectRoute,async(req,res)=>{
    try {
        const books=await Book.find({user:req.user._id}).sort({createdAt:-1});
        res.json(books)
        
    } catch (error) {
         console.log("error in get all books route")
        res.status(500).json({message:"internal server error "})
        
    }
})


export default router;

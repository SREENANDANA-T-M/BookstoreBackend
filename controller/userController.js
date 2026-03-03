const users = require("../models/userModel");
const jwt=require('jsonwebtoken')

exports.registerController=async (req,res)=>{
    console.log(`Inside Register Controller`);
    const {username,email,password}=req.body
    console.log(username,email,password);   

    // logic
    // register controller
    try {
        // check the user is already exists
        const existingUser=await users.findOne({email:email})
        console.log(existingUser);
        if(existingUser){
            res.status(401).json(`User already exists,please login`)
        }else{
            const newUser=new users({
                username:username,
                email,
                password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
        
    } catch (error) {
        res.status(500).json(error)
    }
      
}


// login controller

exports.loginController=async(req,res)=>{
    console.log(`Inside login Controller`);
    
    const{email,password}=req.body
    console.log(email,password);

    try {
        const existingUser=await users.findOne({email})
        console.log(existingUser)
        if(existingUser){
            if(existingUser.password==password){
                console.log("Login Sucess")
                const token=jwt.sign({userMail:existingUser.email,role:existingUser.role},process.env.jwtSecretKey)
                console.log(token)
                res.status(200).json({existingUser,token})
            }else{
                res.status(401).json(`Invalid Credentials`)
            }
    
        }else{
            res.status(401).json("User Not Found....Please Register")
        }
        
    } catch (error) {
        res.status(500).json(error)
    }
    
    
}


// update user Profile
exports.updateUserProfileController=async(req,res)=>{
    console.log(`Inside Update user Profile Controller`);
    const{username,password,bio,profileImage}=req.body
     const userMail=req.payload
    const profileImg=req.file?req.file.filename:profileImage
    console.log(username,password,bio,profileImage,userMail);

    try {
        const updateUser=await users.findOneAndUpdate({email:userMail},
            {username,password,profileImg,bio},{new:true}
        )
        await updateUser.save()
        res.status(200).json(updateUser)
    } catch (error) {
        res.status(500).json(error)
    }
    
    
}
//  admin Profile update
exports.updateAdminProfileController=async(req,res)=>{
    console.log(`Inside Update Admin Profile Controller`);
    const{username,password,profileImage}=req.body
     const userMail=req.payload
    const profileImg=req.file?req.file.filename:profileImage
    console.log(username,password,profileImage,userMail);

    try {
        const updateAdmin=await users.findOneAndUpdate({email:userMail},
            {username,password,profileImg},{new:true}
        )
        res.status(200).json(updateAdmin)
    } catch (error) {
        res.status(500).json(error)
    }
    
    
}


// get all users in admin dashboard
exports.getAllUsersController = async (req, res) => {
    console.log(`Inside Get All Users Controller`);
    const userMail=req.payload//admin@bookstore.com
    try {
        const allUsers = await users.find({email:{$ne:userMail}})
        res.status(200).json(allUsers)
    } catch (error) {
        res.status(500).json(error)
    }

}

// google login
exports.googleLoginController=async(req,res)=>{
    console.log(`Inside Google Login Controller`);
    const{username,password,email,profileImg}=req.body
    console.log(username,password,email,profileImg);
    try {
        const existingUser=await users.findOne({email})
        if(existingUser){
            const token=jwt.sign({userMail:existingUser.email,role:existingUser.role},process.env.jwtSecretKey)
                console.log(token)
                res.status(200).json({user:existingUser,token})
        }else{
            const newUser=new users({
                username:username,
                email,
                password,
                profileImg
            })
            await newUser.save()
            const token=jwt.sign({userMail:newUser.email,role:newUser.role},proccess.env.jwtSecretKey)
            console.log(token);
            res.status(200).json({user:newUser,token})
            
        }
    } catch (error) {
        res.status(500).json(error)
    }
    
    
}







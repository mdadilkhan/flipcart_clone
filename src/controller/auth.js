const User=require("../models/user")
const jwt =require("jsonwebtoken");
const {validationResult}=require("express-validator")





exports.signup=(req,res)=>{
    
    User.findOne({"email":req.body.email})
    .exec((error,user)=>{
      if(user) return res.status(400).json({
          message:"user already registered"
      });
      
       
      const {
          firstName,
          lastName,
          email,
          password
      }=req.body;
 
      
      const _user=new User({
          firstName,
          lastName,
          email,
          password,
          userName:Math.random().toString()
         });
        //  console.log(_user);
         _user.save((error, data) => {
            if(error){
                return res.status(400).json({
                    message:"something went wrong"
                });
                
            }
            if(data){
                return res.status(201).json({
                    message:"user created successfullu...!"
                })
            }
         });
 
 
 
    });
} 




exports.signin=(req,res)=>{
    User.findOne({"email":req.body.email})
    .exec((error,user)=>{
        if(error) return res.status(400).json({error});
        if(user){
          
            if(user.authenticate(req.body.password)){
                 const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1h"});
                 const {_id,firstName,lastName,email,role,fullName}=user;
                 res.status(200).json({
                     token,
                     user:{_id,firstName,lastName,email,role,fullName}
                 });
            }else{
                return res.status(400).json({
                    message: "invalid password"
                })
            }

        }else{
            return res.status(400).json({
                message:"something went wrong"
            });
        }
    })
}

exports.requiresignin=(req,res,next)=>{
    const token=req.headers.authorization.split(" ")[1];   
    const user=jwt.verify(token,process.env.JWT_SECRET);
    req.user=user;
    next();
   
}
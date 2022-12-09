import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/customError";
import jwt from "jsonwebtoken"; 
import config from "../config";

export const isLoggedin=asyncHandler(async(req,res,next)=>{
    //grab token from req.cookie or from req.header
    let token ;
    if(req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) ){
        token=req.cookies.token || req.headers.authorization.split(" ")[1]
    }

    if(!token){
        throw new CustomError("Not authorized to access this route",401)
    }
    
    try {
        const decodedJwtPayload= jwt.verify(token,config.JWT_SECRET)
        req.user=await User.findById(decodedJwtPayload._id,"name email role")
        next()
    } catch (error) {
        throw new CustomError("Not authorized to access this route",401)
    } 
})
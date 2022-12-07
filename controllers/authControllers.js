import User from "../model/user.schema"
import CustomError from "../utils/customError"
import asyncHandler from "../services/asyncHandler"
import cookieOptions from "../utils/cookieOptions"

/******************************************************
 * @SIGNUP
 * @request_type POST
 * @route http://localhost:4000/api/auth/signup
 * @description User signUp Controller for creating new user
 * @parameters name, email, password
 * @returns User Object
 ******************************************************/

export const signUp= asyncHandler(async(req,res)=>{
     try {
        // collect information 
        const {name,email,password}=req.body

        // validate inforamtion 
        if(!(name || email || password)){
            throw CustomError("Please fill all the fields",400)
        }

        // check if user already exist or not 
        const existingUser=await findOne({email})
        if(existingUser){
            throw CustomError("User already exists",400)
        }
        
        // if not create a user 
        const user=await User.create({
            name,
            email,
            password // no need to hash password 
        })
        
        // create token 
        // const token = User.getJwtToken() || user.getJwtToken()   which one is correct in both of these 
        const token =user.getJwtToken()
        console.log(user);// you will see here password 
        user.password=undefined

        // set a cookie 
        res.cookie("token",token,cookieOptions)
        res.status(200).json({
            success:true,
            user,
            token
        })

     } catch (error) {
        console.log("ERROR",error);
        throw  CustomError("SignUp failed",500)
     }
})
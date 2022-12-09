import User from "../model/user.schema"
import CustomError from "../utils/customError"
import asyncHandler from "../services/asyncHandler"
import cookieOptions from "../utils/cookieOptions"
import mailHelper from "../utils/mailHelper"
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


/******************************************************
 * @LOGIN
 * @request_type  GET
 * @route http://localhost:4000/api/auth/login
 * @description User login Controller for logging  in user
 * @parameters  email, password
 * @returns success message
 ******************************************************/

export const login=asyncHandler(async(req,res)=>{
    try {
        // get values and and valdate them 
    const{email,password}=req.body
    if(!(email || password)){ 
        throw CustomError("Please Provide all the fields",400)
    }
    // check if user exist or not  
    const user=await findOne({email}).select("+password") // to takout password also
    if(!user){
        throw CustomError("Invalid credentials",404)
    }
    // if user found compare the password
    const isPasswordMatched =await user.comparePassword(password)
    if(!isPasswordMatched){
        throw CustomError("Invalid credentials-pass",400)
    }
    // if password matched  create token
    const token=user.getJwtToken()
    user.password=undefined
    res.cookie("token",token,cookieOptions)
    return res.status(200).json({
        success:true,
        user,
        token
    })
    } catch (error) {
        console.log("ERROR",error);
        throw CustomError("Error in login controller",500)
    } 

})



/******************************************************
 * @LOGOUT
 * @request_type  
 * @route http://localhost:4000/api/auth/logout
 * @description User logout Controller for logging outby clearing cookie
 * @parameters  
 * @returns success message
 ******************************************************/

export const logout=asyncHandler(async(_req,res)=>{
      res.cookie("token",null,
      {
        expires:new Date(Date.now()),
        httpOnly:true
      })
      res.status(200).json({
        success:true,
        message:"Logged out"
      })
})

/******************************************************
 * @forgotpPassword
 * @request_type  
 * @route http://localhost:4000/api/auth/forgotPassword
 * @description user will submt email and we will genearte token 
 * @parameters  email
 * @returns  success email send 
 ******************************************************/

export const forgotPassword=asyncHandler(async()=>{
    // get email from user and validate 
    const {email}=req.body
    if(!email){
        throw CustomError("Please provide an Email",401)
    }

    // finding user with that email 
    const user= await User.findOne({email})
    if(!user){
        throw CustomError("User not found",404)
    }
 
    // create forgotPasswordToken and forgotPasswordTokenExpiry
      const resetToken=user.generateForgetPasswordToken()
      // save to database
      /* 
      documents are automatically validated before they are saved to the database. Mongoose registers validation as a pre('save') hook on every schema by default
      */
      await user.save({validateBeforeSave:false})
    // how to use create token - userschema have method  

    const resetUrl=`${req.protocol}${req.get('host')}/api/auth/password/reset/${resetToken}`
    const text=`Your password reset url is
    \n\n ${resetUrl}\n\n`
     
    const options={
        email:user.email,
        subject:"Email reset link for website",
        text:text
    }
    try {
        await mailHelper(options) 
        res.status(201).json({
            success:true,
            message:`Email send successfully yo ${user.email}`
        })
    } catch (error) {
        // clear fields and save 
        user.forgotPasswordToken =undefined,
        user.forgotPasswordTokenExpiry=undefined,
        console.log("ERROR",error);
        await user.save({validateBeforeSave:false})
        throw CustomError("Email sent failure ",424)
    }
})
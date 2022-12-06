import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"; 
import config from "../config";
const userSchema= mongoose.Schema(
    {
    name:{
        type:String,
        require:[true,"Name is required"],
        maxLength:[50,"Name is having more than 50 Characters"]
    },
    email:{
        type:String,
        require:[true,"Email is required"],
        unique:true, 
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minLength:[6,"password is less than 6 characters"],
        select:false
    },
    role:{
        type:String,
        enum:Object.values(AuthRoles),
        default:AuthRoles.USER
    },
    forgotPasswordToken:String,
    forgotPasswordExpiry:Date,
    },
    {
        timestamps:true
    }
)


// encrypt password
userSchema.pre("save",async function(next){
    // this function will run on each time you are saving something in  database even if i will modify name then it will also run  so to solve his we uses isModified method 
    if(this.isModified("password")){ 
        this.password=await bcryptjs.hash(this.password,10)
        return next()
    }
    return next() 
})

// adding more functionality directly to userSchema

userSchema.methods={
    // compare password
    comparePassword:async function(enteredPassword){
        return await bcryptjs.compare(enteredPassword,this.password)
    },

    // create JWT token 
    getJwtToken:  function(){
        return jwt.sign(
            {
                _id:this._id,
                role:this.role
            },
            config.JWT_SECRET,
            {
                expiresIn:config.JWT_EXPIRY
            }

            )
    }
}

export default mongoose.model("user",userSchema)
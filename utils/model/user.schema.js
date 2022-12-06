import mongoose from "mongoose";
import AuthRoles from "../authRoles";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"; 

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
    if(this.isModified("password")){ 
        this.password=await bcryptjs.hash(this.password,10)
        return next()
    }
    return next() 
})


export default mongoose.model("user",userSchema)
import mongoose from "mongoose";
import AuthRoles from "../authRoles";
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
export default mongoose.model("user",userSchema)
import mongoose from "mongoose";

const userSchema= mongoose.Schema({
    name:{
        type:String,
        require:[true,"Name is required"],
        maxLength:[50,"Name is having more than 50 Characters"]
    }
})
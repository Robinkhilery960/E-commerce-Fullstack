import mongoose, { Mongoose } from "mongoose";

const couponSchema = new Mongoose.Schema({
    code:{
        type:String,
        required:[true,"Coupon code is missing"]
    },
    discount:{
        type:Number,
        default:0
    },
    active:{
        type:Boolean,
        default:true   // a newly created coupon by default should be active 
    }
},
{
    timestamps: true
}
);


export default mongoose.model("Coupon",couponSchema)
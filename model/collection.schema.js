import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            require:[true,"Collection name is missing"],
            trim:true,
            maxLength:[120,"Collection name exceed 120 characters"]
        }
    },
    {
        timestamps:true
    }
    );

    export default mongoose.model("Collection",collectionSchema)

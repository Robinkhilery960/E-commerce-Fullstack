import Collection from "../model/collection.schema"
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"

/******************************************************
 * @GET_COLLECTION
 * @request_type  GET
 * @route http://localhost:4000/api/collection/read 
 * @description getting collection from databse 
 * @parameters   collectionId
 * @returns   perticular collection based on collectionId
 ******************************************************/

export const getCollection=asyncHandler(async(req,res)=>{
    // collect collection id from client 
    const {collectionId}=req.params
    if(!collectionId){
        throw new CustomError("Please provide collectionId",401)
    }
    // find collection based on userId
    const collection=await Collection.findById(collectionId)
    if(!collection){ 
        throw new CustomError("Collection not found",404)
    }

    res.status(201).json({
        success:true,
        collection
    })
})



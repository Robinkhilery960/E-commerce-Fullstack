import Collection from "../model/collection.schema"
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"



/******************************************************
 * @CREATE_COLLECTION
 * @request_type  POST
 * @route http://localhost:4000/api/collection/create 
 * @description creating collection to  databse    
 * @parameters   name
 * @returns    created collection
 ******************************************************/

export const createCollection=asyncHandler(async(req,res)=>{
    // grab data from client
    const {name}=req.body
    if(!name){
        throw new CustomError("Please provide name of collection",401)
    }
    
    try {
        const collection= await Collection.create({name}) 
        res.status(201).json({
            success:true,
            collection
        })
    } catch (error) {
        throw new CustomError("collction creation failed",401)
          
    }
   
})


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

/******************************************************
 * @UPDATE_COLLECTION
 * @request_type  POST
 * @route http://localhost:4000/api/collection/update 
 * @description getting collection from databse  and updating it 
 * @parameters   collectionId and data used to update 
 * @returns   updated collection
 ******************************************************/

export const updateCollection=asyncHandler(async(req,res)=>{
    // grab data from client 
    const {collectionId}=req.params
    const {data}=req.body
    if(!(collectionId || data)){
        throw new CustomError("Please provide sufficent information ",401)
    }
    // grab collection from databse and update it 
    const collection=await Collection.findByIdAndUpdate(collectionId,data)
    if(!collection){ 
        throw new CustomError("Collection not found",404)
    }
    //TODO: check what you afe getting as response a updated collection or old one 
    res.status(201).json({
        success:true,
        collection
    })
})



import Product from "../models/product.schema.js"
import formidable from 'formidable';
import fs from "fs"
import {deleteFile, s3FileUpload} from "../services/imageUpload.js"
import Mongoose from "mongoose"
import asyncHandler from '../services/asyncHandler'
import CustomError from '../utils/customError'
import config from "../config/index.js"

/**********************************************************
 * @ADD_PRODUCT
 * @route https://localhost:5000/api/product
 * @description Controller used for creating a new product
 * @description Only admin can create the coupon
 * @descriptio Uses AWS S3 Bucket for image upload
 * @returns Product Object
 *********************************************************/


export const addProduct = asyncHandler(async (req, res) => {
    
    // create an instance of the form using formidable
    const form=formidable({
        multiples:true,
        keepExtensions:true
    }) 

    // now parse the request stream 
    form.parse(req,async function (error,fields,files){
        try {
            if(error){
                return res.status(400).json({
                    status: "Fail",
                    message: "There was an error parsing the files",
                    error: error,
                  })
            }

            const productId=new Mongoose.Types.ObjectId();
            // const productId=new mongoose.Types.ObjectId()

            // check for fields
            if(!(fields.name || fields.price || fields.collectionId)){
                throw new CustomError("Please provide all mandatory fields",500)
            }

            // upload images 
            /* 
            maps will return you an array which contains promises for each call that will be resolved in future 
            */
           const imageArray= await Promise.all(
            Object.keys(files).map(async(fileKey,index)=>{

                const element=files[fileKey]
                // read data of that file 
                const data=fs.readFileSync(element.filepath)

                // now upload file to aws 
                const upload=await s3FileUpload({
                    bucketName:config.S3_BUCKET,
                    key:`products/${productId}/photo_${index+1}.png`,
                    body:data,
                    contentType:element.mimetype
                })

                return {
                    secure_url:upload.Location
                }
           })
           )
            
           // now create a product in database

           const product=new Product.create({
            _id:productId,
            photos:imageArray,
            ...fields
           })

           //if product is not created 
           if(!product){
            return new customError("Product not created ",400)
           }

           // product is created 
             res.status(200).json({
            status: "success",
            message: "Product  created successfully", 
          })

        } catch (error) {
            return res.status(400).json({
                status: "Fail",
                message: "There was an error while uploading  the files",
                error: error,
              })
            
        }
    })

     
})


/**********************************************************
 * @GET_ALL_PRODUCT
 * @route https://localhost:5000/api/product
 * @description Controller used for getting all products details
 * @description User and admin can get all the prducts
 * @returns Products Object
 *********************************************************/

export const getAllProduct=asyncHandler(async(req, res)=>{

    const products= await Product.find()

    if(!products){
        throw new customError("No product found",404)
    }

    res.status(200).json({
        status:"Success",
        message:"All products are fatched",
        products
    })
})

/**********************************************************
 * @GET_PRODUCT_BY_ID
 * @route https://localhost:5000/api/product
 * @description Controller used for getting single product details
 * @description User and admin can get single product details
 * @returns Product Object
 *********************************************************/

export const getProductById= asyncHandler(async(req, res)=>{
    // get productId from the front end
    const {productId}=req.params
    
    const product=await Product.findById(productId)

    if(!product){
        throw new customError("Product not  found",404)
    }

    res.status(200).json({
        status:"Success",
        message:"Product found successfully ",
        product
    })

})
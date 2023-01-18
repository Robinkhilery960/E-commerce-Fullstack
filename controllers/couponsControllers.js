import Coupon from "../model/coupon.schema.js";
import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/customError";


/**********************************************************
 * @CREATE_COUPON
 * @route https://localhost:5000/api/coupon
 * @description Controller used for creating a new coupon
 * @description Only admin and Moderator can create the coupon
 * @returns Coupon Object with success message "Coupon Created SuccessFully"
 *********************************************************/

export const createCoupon=asyncHandler(async(req, res)=>{
    // collecting data from client 
    const {code, discount, active}= req.body

    // validate all fields

    if(!(code || discount || active)){
        throw new CustomError("Please provide all the fields",400)
    }

    // create coupon 
    const createdCoupon=await Coupon.create({code,discount,active})

    if(!createdCoupon){
        throw new CustomError("Coupon not created",400)
    }

    res.status(200).json({
        success:true,
        message:"Coupon created successfully ",
        createdCoupon,
    })

})


/**********************************************************
 * @DEACTIVATE_COUPON
 * @route https://localhost:5000/api/coupon/deactive/:couponId
 * @description Controller used for deactivating the coupon
 * @description Only admin and Moderator can update the coupon
 * @returns Coupon Object with success message "Coupon Deactivated SuccessFully"
 *********************************************************/

export const deactivateCoupon= asyncHandler(async(req, res)=>{
 // grab coupon id from client
 const {couponId}=req.params

 const coupon=await Coupon.findByIdAndUpdate(
    couponId,
    { active:false },
    {
      new: true,
      runValidators: true,
    }
 )

 if(!coupon){
    throw new CustomError("Coupon not deavtivated",400)
}
res.status(200).json({
    success:true,
    message:"Coupon deactivated successfully",
    coupon,
})

})



/**********************************************************
 * @DELETE_COUPON
 * @route https://localhost:5000/api/coupon/:couponId
 * @description Controller used for deleting the coupon
 * @description Only admin and Moderator can delete the coupon
 * @returns Success Message "Coupon Deleted SuccessFully"
 *********************************************************/


export const deleteCoupon=asyncHandler(async(req,res)=>{
    // collect couponId from client 
    const {couponId}= req.params

    if(!couponId){
        throw new CustomError("Please provide couponId",400)
    }

    const deletedCoupon=await Coupon.findByIdAndDelete(couponId)

    if(!deletedCoupon){
        throw new CustomError("Coupon is not deleted successfully",400)
    }

    res.status(200).json({
        success:true,
        message:"coupon deleted successfully",
        deletedCoupon
    })
})


/**********************************************************
 * @GET_ALL_COUPONS
 * @route https://localhost:5000/api/coupon
 * @description Controller used for getting all coupons details
 * @description Only admin and Moderator can get all the coupons
 * @returns allCoupons Object
 *********************************************************/

export const getAllCoupon= asyncHandler(async(req, res)=>{
     
   
    const coupons=await Coupon.find()
   
    if(!coupons){
       throw new CustomError("No coupon found",404)
   }
   res.status(200).json({
       success:true,
       message:"All coupons fatched ",
       coupons,
   })
   
   })
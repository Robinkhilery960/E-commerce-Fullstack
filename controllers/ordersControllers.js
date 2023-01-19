import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/customError";
import Product from "../models/product.schema.js";
import Coupon from "../model/coupon.schema.js";
import razorpay from "../config/razorpay.config.js";

/**********************************************************
 * @GENEARATE_RAZORPAY_ID
 * @route https://localhost:5000/api/order/razorpay
 * @description Controller used for genrating razorpay Id
 * @description Creates a Razorpay Id which is used for placing order
 * @returns Order Object with "Razorpay order id generated successfully"
 *********************************************************/

export const generateRazorpayOrderId = asyncHandler(async (req, res) => {
  // collect product and coupon from  the client side
  const { product, coupon } = req.body;

  // validate product and coupon
  if (!product) {
    throw new CustomError("You have not selected any product to buy", 400);
  }

  // validate product price from the database

  const realAmount = product.reduce(async (totalAmount, currentProductId) => {
    const product = await Product.findById(currentProductId);
    return totalAmount + product.price;
  }, 0);

  if (realAmount !== req.body.amount) {
    throw new CustomError("Amount from client does not match real amount", 400);
  }

  // check  coupon
  if (coupon) {
    // does this coupon exist in database
    const allCoupons = await Coupon.find();
    const couponExist = false;
    for (entry in allCoupons) {
      if (entry.code === coupon.code) {
        couponExist = true;
      }
    }
    if (!couponExist) {
      throw new CustomError("Coupon is inValid", 400);
    }

    // check coupon status
    if (!coupon.active) {
      throw new CustomError("Coupon is Expired", 400);
    }

    const finalAmount = req.body.amount - req.body.amount * (discount / 100);

    const options = {
      amount: Math.round(finalAmount * 100), // Amount is represented in smallest currency unit
      currency: "INR",
      receipt: `receipt_${new Date().getTime()}`,
    };

    // generate orderId
    const orderId = await razorpay.orders.create(options);

    if (!orderId) {
      throw new CustomError("OrderId not generated successfully", 400);
    }

    res.status(201).json({
      success: true,
      message: "OrderId generated successfully",
      orderId,
    });
  }
});

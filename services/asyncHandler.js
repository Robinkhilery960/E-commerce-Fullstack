const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      message:error.message
    });
  }
};


export default asyncHandler;



// above function can also be written like this 

// const asyncHandler=(fn)=>{
//  return async(req,res,next)=>{
//       try {
//         await fn(req,res,next)
//       } catch (error) {
//         res.status(error.code || 500).json({
//             success:false
//         })
//       }
//  }
// }


import s3 from "../config.s3.config.js"

// upload file 
export const s3FileUpload=async({bucketName,key,body,contentType})=>{
    // keeps the props name in capital
    return await s3.upload({
        Bucket:bucketName,
        Key:key,
        Body:body,
        ContentType:contentType
    }).Promise()
}

// delete file 
export const s3FileDelete=async({bucketName,key})=>{
    // keeps the props name in capital
    return await s3.deleteObject({
        Bucket:bucketName,
        Key:key
    }).Promise()
}
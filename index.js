import app from "./app";
import mongoose from "mongoose";
import config from './config/index'

(
   async()=>{
       try {
        await mongoose.connect(config.MONGODB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })

        console.log("Connected to Database")
        
        app.on("error",(error)=>{
            console.log("ERROR",error);
            throw error
        })

        const onListening =()=>{
            console.log(`App is listening on http://localhost:${config.PORT}`);
        }

        app.listen(config.PORT,onListening)

       } catch (error) {
             console.log("ERROR",error);
             throw error
       }
   } 
)()

 
import transporter from "../config/transporter.config";
import config from "../config";

const mailHelper=async(options)=>{
   const message={
        from:config.SMTP_MAIL_EMAIL,
        to:options.email,
        subject:options.subject,
        text:options.text,
   }
    try { 
        await transporter.sendMail(message)
        console.log("Mail sent successfully");
    } catch (error) {
        console.log("ERROR",error);
        throw CustomError("Mail not sent",554)
    }
}

export default mailHelper
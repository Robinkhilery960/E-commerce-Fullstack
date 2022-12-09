import transporter from "../config/transporter.config";
import config from "../config";

const mailHelper=async(options)=>{
   const message={
        from:config.SMTP_MAIL_EMAIL,
        to:options.email,
        subject:options.subject,
        text:options.text,
   }   
        await transporter.sendMail(message) 
}

export default mailHelper
import nodemailer from "nodemailer"
import config from "../config/index"

/* 
port – is the port to connect to (defaults to 587 if is secure is false or 465 if true)
host – is the hostname or IP address to connect to (defaults to ‘localhost’)
secure – if true the connection will use TLS when connecting to server. If false (the default) then TLS is used if server supports the STARTTLS extension. In most cases set this value to true if you are connecting to port 465. For port 587 or 25 keep it false
auth – defines authentication data 
*/
const transport={
    host:config.SMTP_MAIL_HOST,
    port:config.SMTP_MAIL_PORT,
    secure:false,
    auth:{
        email:config.SMTP_MAIL_USERNAME,
        password: config.SMTP_PASSWORD
    }
}

// creatting a transporter object to send emails
/* 
transporter is going to be an object that is able to send mail
transport is the transport configuration object or it is  an object that defines connection data
*/
const transporter=nodemailer.createTransport(transport)

export default transporter
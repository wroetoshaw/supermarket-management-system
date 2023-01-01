var nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD
    }
  });


async function sendEmail(to,subject,html=null,text=null){
     mailOptions = {       
      from: process.env.USER_EMAIL,
      to: to,
      subject: subject
    }
    if(text) mailOptions["text"]=text
    if(html) mailOptions["html"]=html
      

    return new Promise((resolve,reject)=>{
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          reject(error)
        } else {
         resolve("success")
          
        }
      });
    })
}


module.exports = sendEmail
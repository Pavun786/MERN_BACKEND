const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
     user: process.env.EMAIL ,
      pass: process.env.PASSWORD ,
    },
  });

  function sendMail(toEmail ,subject , content) {
    const mailOptions = {
        from : process.env.EMAIL,
        to : toEmail,
        subject : subject ,
        html : content
    };

    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log("error occued",error)
        }else{
            console.log("Email sent : ",info.response)
        }
    })
  }
  module.exports={sendMail}
const User= require("../models/User");
const {sendMail} = require("./SendMail");
const bcrypt = require("bcrypt")
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const verifyUser = require("../models/verifyUser");
dotenv.config()

async function InsertVerifyUser(name,email,password){

    try{
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password,salt);
      const token = generateToken(email);

      const newUser = new verifyUser({
        name: name,
        email: email,
        password: hashedPassword,
        token: token
      })

      const activationLink =`http://localhost:4000/signin/${token}`
      const content =`<h4>Hi,There</h4>
      <h5>welcome to the app</h5>
      <p>Thank you for signing..Click on the below link to activate</p>
      <a href="${activationLink}">click here</a>
      <p>Regards</p>
      <p>Team</p>
      `
     await newUser.save(); //save the details in verifyUser collection for temporerly
     
     sendMail(email,"VerifyUser",content)

    }catch(e){
      console.log(e)
    }
}

function generateToken(email){
    const token = jwt.sign(email,process.env.SECRETKEY)
    return token
}

async function InsertSignUpUser(token){

    try{

        console.log(token)    
        const userVerify = await verifyUser.findOne({token: token})
        console.log(userVerify)

        if(userVerify){
            const newUser = new User({      // here we insert the user detail into User collection, when user activation done in mail.
                
                name: userVerify.name,
                email: userVerify.email,
                password: userVerify.password,
                forgetPassword : {}
            });
            console.log(newUser);
            await newUser.save();
            await userVerify.deleteOne({token: token}); //and user details also remove from verifyUser collection
            const content = `<h4>Registeration successfull</h4>
            <h5>welcome to the app</h5>
            <p>You are successfully registered</p>
            <p>Regards</p>
            <p>Team</p>`;
            sendMail(newUser.email,"Registeration successful",content);  //mail send
            return `<h4>Hi,There</h4>
            <h5>welcome to the app</h5>
            <p>You are successfully registered</p>
            <p>Regards</p>
            <p>Team</p>`;
        }
        return `<h4>Registeration failed</h4>
        <p>Link Expired.....</p>
        <p>Regards</p>
        <p>Team</p>`;
    }
    catch(e){
        console.log(e)
        return `
        <html> 
        <body>
        <h4>Registeration failed</h4>
        <p>Unexpected error happend....</p>
        <p>Regards</p>
        <p>Team</p>
        </body>
        </html>
        `;
    }
}

module.exports = {InsertVerifyUser,InsertSignUpUser}
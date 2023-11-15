const express = require("express");
const { InsertVerifyUser, InsertSignUpUser } = require("../controllers/signin");
const { CheckUser } = require("../controllers/login");
const { Http2ServerRequest } = require("http2");

const router = express.Router();

router.get("/:token",async (req,res)=>{
    try{
        // console.log(req.params.token)
     const response = await InsertSignUpUser(req.params.token);

     res.status(200).send(response);
     
    } catch(e){
      
        console.log(e)
      
        res.status(500).send(
        `<html>
            <body>
            <h4>Registeration failed</h4>
            <p>Unexpected error happend....</p>
             <p>Regards</p>
              <p>Team</p>
            </body>
        </html>`
        
      )
    }
})

router.post("/verify",async (req,res)=>{

    try{
        const {name,email,password} = await req.body;
       
        console.log(name,email,password)
   
        const registerCredentials = await CheckUser(email);
   
        if(registerCredentials === false){
           
            await InsertVerifyUser(name,email,password);
            
            res.status(200).send(true)
       
        } else if(registerCredentials === true){
           
            res.status(200).send(false)
      
        } else if(registerCredentials === "Server Busy"){
           
            res.status(500).send("Server Busy")
        }
    }
    catch(error){
      
        console.log(error)
    }
})

module.exports = router;
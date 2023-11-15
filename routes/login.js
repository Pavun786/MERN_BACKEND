const express = require("express");
const { AuthenticateUser } = require("../controllers/login");
const router = express.Router();
const client = require("../redis");

client
   .connect()
   .then(() => {
      console.log("connected to redis")
   })
   .catch((e) => {
      console.log(e)
   })

router.post("/", async (req, res) => {
   
   const { email, password } = await req.body;

   const loginCredentials = await AuthenticateUser(email, password);
   
   console.log(loginCredentials)

   if (loginCredentials === "Invalid User name or Password") {
      
      res.status(200), send("Invalid Username or Password")
   
   } else if (loginCredentials === "Server Busy") {
      
      res.status(200).send("Server Busy")
   
   } else {
     
      res.status(200).json({ token: loginCredentials.token })
   }
})

module.exports = router;









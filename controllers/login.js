const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
const client = require("../redis");
dotenv.config();

async function CheckUser(email){
    try{
      const user = await User.findOne({email:email})
     
      if(user){
        
        return true;
      }
        return false;
    
     }catch(e){
      
        return "Server Busy"
    }
}

 async function AuthenticateUser(email,password){
     try{
        
        const userCheck = await User.findOne({email: email});
        
        const validPassword = await bcrypt.compare(password,userCheck.password)
        
        if(validPassword){
           
            const token = jwt.sign({email},process.env.LOGIN_SECRET)
            
            const response ={
                id: userCheck._id,
                name: userCheck.name,
                email: userCheck.email,
                token: token,
                status : true
            }

            await client.set(`key-${email}`,JSON.stringify(response))

            // console.log(res)

            await User.findOneAndUpdate({ email: userCheck.email},{ $set:{token}},{new:true})
            
            return response
        }
        
        return "Invalid User name or password"
     
    }catch(e){
        console.log(e)
        return "Server Busy"
     }
 }

async function AuthorizeUser(token){
    try{
        
        const decodedToken = jwt.verify(token,process.env.LOGIN_SECRET)
        
        if(decodedToken){
            
            const email = decodedToken.email;
            
            const auth = await client.get(`key-${email}`);  //if token verified,then get user details from redis cache by email
            
            console.log("auth",auth)
            
            if(auth){
                const data = JSON.parse(auth)
                console.log("login ",data)
                return data
            } else{
                const data = await User.findOne({email: email}) //Or get user details from mongoDB by email
                return data
            }
            
        }
        return false;
    } catch(e){
        console.log(e)
    }
}





module.exports = {CheckUser,AuthenticateUser,AuthorizeUser}
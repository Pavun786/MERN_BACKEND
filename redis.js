const redis = require("redis");
const dotenv = require("dotenv");
dotenv.config()


// Redis is an open source in-memory data store that can be used as a database, cache, or message broker. 
// It's often used for caching web pages and reducing the load on servers.ie: its allow the user to use app without signup the app 

const redisClient =()=>{
    return redis.createClient()
}

const client = redisClient();

client.on("error",(err)=>{
    console.log(err)
})

client.on("connect",()=>{
    console.log("connected to redis..")
});

client.on("end",()=>{
    console.log("redis connection ended")
})

client.on("SIGQUIT",()=>{
    client.quit
})

module.exports = client;









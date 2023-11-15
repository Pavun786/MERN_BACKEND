const express = require("express")

const connectDb = require("./db")

const cors = require("cors")

const signinRouter = require("./routes/signin")

const loginRouter = require("./routes/login")

const homeRouter = require("./routes/home")


const app = express();

const port = 4000;

app.use(express.json());
app.use(cors({
    origin:"*"
}))

connectDb()

app.get("/",(req,res)=>{
    res.send("Unity is strength")
})

app.use("/signin",signinRouter)
app.use("/login",loginRouter)
app.use("/home",homeRouter)

app.listen(port,()=>{
    console.log(`Server run on PORT ${port}`)
})
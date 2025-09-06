import dotenv from "dotenv"
import connectDb from "./db/index.js"
import app from "./app.js"
dotenv.config({
    path: "./env"
})
connectDb()
.then(()=>
{
    app.listen(process.env.PORT,()=>
    {
        console.log("Server is running on Port",process.env.PORT)
    })
})
.catch((error)=>
{
    console.log("CONNECTION TO DB FAILED:=>",error)
})
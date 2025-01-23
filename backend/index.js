const express=require("express");
const mongoose=require("mongoose");
const connectToMongoDB=require("./config/db")
const bookRoute=require("./Routes/bookRoute")
const app=express();
const PORT=7002;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
connectToMongoDB();

app.use("/api",bookRoute)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
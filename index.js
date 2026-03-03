// 7.import dotenv
require("dotenv").config()

// 1.import express
const express=require("express")

// import router
const router=require("./router")

// 5.import cors
const cors=require("cors")

// import connecting file
require("./connection")

// 2.to create server
const BookStoreServer=express()

// 6.tell server to use CORS
BookStoreServer.use(cors())

// 8.parse data-middleware
BookStoreServer.use(express.json())

// tell server to use port
BookStoreServer.use(router)


BookStoreServer.use("/uploadImages", express.static("./imageUploads"))// used for accessing the image files stored in statically in the system


// 3.port
const PORT=4000

// 4.tell server to listen
BookStoreServer.listen(PORT,()=>{
    console.log(`Bookstore Server started at PORT ${PORT}, and waiting for client Request`);
    
})

BookStoreServer.get("/",(req,res)=>{
    res.status(200).send("Bookstore Server started and waiting for client Request")
})

BookStoreServer.post("/",(req,res)=>{
    res.status(200).send("This is POST Request")
})
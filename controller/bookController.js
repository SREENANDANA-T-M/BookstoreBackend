const { json } = require("express");
const books = require("../models/bookModel");
const users = require("../models/userModel");
const stripe=require('stripe')(process.env.stripeSK)

// add book
exports.addBookController = async (req, res) => {
    console.log(`Inside Add Book  Controller`);
    // console.log(req.body)
    // console.log(req.files);

    const { title, author, noOfPages, imageURL, price, discountPrice, abstract, publisher, language, isbn, category } = req.body
    console.log(title, author, noOfPages, imageURL, price, discountPrice, abstract, publisher, language, isbn, category);

    // const uploadImages=req.files
    // console.log(uploadImages);

    var uploadImg = []
    req.files.map(item => uploadImg.push(item.filename))
    console.log(uploadImg);

    const userMail = req.payload

    try {
        const existingBook = await books.findOne({ title, userMail })
        console.log(existingBook);

        if (existingBook) {
            res.status(401).json(`You have already added this book!!!`)
        } else {
            const newBook = new books({
                title, author, noOfPages, imageURL, price, discountPrice, abstract, publisher, language, isbn, category, uploadImages: uploadImg, userMail
            })
            await newBook.save()
            res.status(200).json(newBook)
        }


    } catch (error) {
        res.status(500).json(error)
    }


    console.log(uploadImages);



}
// get home books
exports.getHomeBookController = async (req, res) => {
    console.log(`Inside Get Home Book Controller`);

    try {
        const homeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(homeBooks)
    } catch (error) {
        res.status(500).json(error)
    }

}


// get all books
exports.getAllBookController = async (req, res) => {
    console.log(`Inside Get All Book Controller`);
    const searchKey=req.query.search
    console.log(req.query.search)
    try {
        const allBooks = await books.find({title:{$regex:searchKey,$options:"i"}})
        res.status(200).json(allBooks)
    } catch (error) {
        res.status(500).json(error)
    }

}


// get all user added books
exports.getUserBookController = async (req, res) => {
    console.log(`Inside Get User Books Controller`);
    const userMail = req.payload
    try {
        const userBooks = await books.find({ userMail })
        res.status(200).json(userBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}


// remove user added books
exports.removeUserAddedBookController = async (req, res) => {
    console.log(`Inside Remove User Added Book controller`);
    console.log(req.params);
    const { id } = req.params
    try {
        const removeBook = await books.findByIdAndDelete({ _id: id })
        res.status(200).json("Book Deleted")
    } catch (error) {
        res.status(500).json(error)
    }

}

// get all purchased books
exports.getPurchasedBooksController=async(req,res)=>{
    console.log(`Inside purchased Books Controller`);
    const userMail = req.payload
    try {
        const purchasedBooks=await books.find({boughtBy:userMail })
        res.status(200).json(purchasedBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}


// view book
exports.viewBookController=async(req,res)=>{
    console.log(`Inside view Book Controller`);
    const{id}=req.params
    try {
        const bookDetails=await books.findById({_id:id})
        res.status(200).json(bookDetails)
    } catch (error) {
        res.status(500).json(error)
    }
    
}

// payment-user side
exports.makePaymentController=async(req,res)=>{
    console.log(`Inside Make Payment Controller`);
    const{_id,title,author,noOfPages,imageURL,price,discountPrice,abstract,publisher,language,isbn,category,userMail,uploadImages}=req.body
    
    const email=req.payload
    console.log(email);
    try {
        const updateBookDetails=await books.findByIdAndUpdate({_id},{status:"sold",boughtBy:email},{new:true})
        // console.log(updateBookDetails);
        const line_items=[{
            price_data:{
                currency:'usd',
                product_data:{
                    name:title,
                    description:`${author}|${publisher}`,
                    // images:uploadImages,
                    metadata:{
                        title,author,noOfPages,imageURL,price,discountPrice,abstract,publisher,language,isbn,category,userMail,status:"sold",boughtBy:email
                    }
                },
                unit_amount:Math.round(discountPrice*100)
            },
            quantity:1
        }]

        // stripe checkout session
        const session=await stripe.checkout.session.create({
            payment_method_types:["card"],
            success_url:'http://localhost:5173/payment-success',
            cancel_url:'http://localhost:5173/payment-error',
            line_items,
            mode:'payment',
        });
        console.log("session",session);
        res.status(200).json({checkoutSessionURL:session.url})
        

        
    } catch (error) {
        res.status(500).json(error)
    }
    
    
}

// -------------------admin------------------------//
// approve book
exports.approveBookController=async(req,res)=>{
    console.log(`Inside Approve Book Controller`);
    const {id}=req.params
    try {
        const updateBook=await books.findByIdAndUpdate({_id:id},{
            status:"approved" },{new:true})
            res.status(200).json(updateBook)
        
    } catch (error) {
        res.status(500).json(error)
    }
}






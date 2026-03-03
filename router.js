const express=require("express")
const { registerController, loginController, updateUserProfileController, updateAdminProfileController, getAllUsersController, googleLoginController } = require("./controller/userController")
const jwtMiddleware = require("./Middlewares/jwtMiddleware")
const { addBookController, getHomeBookController, getAllBookController, getUserBookController, removeUserAddedBookController, getPurchasedBooksController, viewBookController, approveBookController, makePaymentController } = require("./controller/bookController")
const multerConfig = require("./Middlewares/imageMulterMiddleware")
const adminjwtMiddleware = require("./Middlewares/AdminJwtMiddleware")
const router=express.Router()

// register
router.post("/register",registerController)

// login
router.post("/login",loginController)

// google login
router.post("/google-login",googleLoginController)
// add book
router.post("/add-book",jwtMiddleware,multerConfig.array("uploadImages",3),addBookController)

// get home books
router.get("/home-books",getHomeBookController)

// get all books
router.get("/all-books",jwtMiddleware,getAllBookController)

// get logged-in user Books
router.get("/user-books",jwtMiddleware,getUserBookController)

// remove user added books
router.delete("/remove-book/:id",jwtMiddleware,removeUserAddedBookController)

// purchased books
router.get("/purchased-books",jwtMiddleware,getPurchasedBooksController)

// view book details
router.get("/view-book/:id",jwtMiddleware,viewBookController)

// update user profile
router.put("/update-profile",jwtMiddleware,multerConfig.single("profileImage"),updateUserProfileController)

// payment
router.post("/make-payment",jwtMiddleware,makePaymentController)


// -----------------Admin------------------------//
// all books-admin
router.get("/admin-allbooks",adminjwtMiddleware,getAllBookController)

// update book status
router.put("/admin-updatebook/:id",adminjwtMiddleware,approveBookController)

// update Admin Profile
router.put("/admin-updateprofile",adminjwtMiddleware,multerConfig.single("profileImage"),updateAdminProfileController)

// get all users in admin dashboard
router.get("/all-users",jwtMiddleware,getAllUsersController)

module.exports=router
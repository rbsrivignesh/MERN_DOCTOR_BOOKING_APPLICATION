import express from 'express'
import { bookAppointment, cancelAppointment, getProfile, listAppointments, loginUser, paymentRazorpay, registerUser,updateProfile, verifyRazorpay } from '../controller/userController.js';
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/update-profile",upload.single('image'),authUser, updateProfile);
userRouter.get("/get-profile",authUser,getProfile);
userRouter.get("/list-appointments",authUser,listAppointments);
userRouter.post("/book-appointment",authUser, bookAppointment)
userRouter.post("/cancel-appointment",authUser, cancelAppointment)
userRouter.post("/payment-razorpay",authUser, paymentRazorpay)
userRouter.post("/verify-razorpay",authUser, verifyRazorpay);

export default userRouter;
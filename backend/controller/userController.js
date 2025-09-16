import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import razorpay from 'razorpay';


// api to register user

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "All Fields are mandatory" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email address" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong password" })
        }

        //hashing user password

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password,salt);

        const userData = {
            name, email, password: hashedPassword
        }
        const newUser = new userModel(userData);

        const user = await newUser.save(userData);

        //creating token using _id

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, token });










    } catch (error) {

        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//api for user login 


const loginUser = async (req,res)=>{
   try {
        const {  email, password } = req.body;
        // if (!email || !password) {
        //     return res.json({ success: false, message: "All Fields are mandatory" })
        // }
        // if (!validator.isEmail(email)) {
        //     return res.json({ success: false, message: "Enter a valid email address" })
        // }
        // if (password.length < 8) {
        //     return res.json({ success: false, message: "Enter a strong password" })
        // }

        const user = await userModel.findOne({email});

        if(!user){
           return res.json({success: false, message: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch){
            const token = jwt.sign({id : user._id}, process.env.JWT_SECRET);

            res.json({success: true, token});
        }
        else{
            res.json({success: false, message: "Wrong Credentials"})
        }
   
    } catch (error) {

        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//api to get user profile data 

const getProfile = async ( req, res)=>{
    try {
        
        const {userId} = req;
        const userData = await userModel.findById(userId).select('-password');

        res.json({success: true, userData});

    }catch (error) {

        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//api to update user profile

const updateProfile = async(req,res)=>{
     try {
        const {userId} = req;
        const {name,phone,address, dob, gender} = req.body;
        console.log(address)
        console.log(JSON.parse(address))
        const imageFile = req.file;

        if(!name || !phone || !address ||!dob ||!gender){
            return res.json({success: false, message : "Data missing"})
        };

        await userModel.findByIdAndUpdate(userId, {name, phone, address : JSON.parse(address), dob, gender})
        if(imageFile){
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image'});
            const imageUrl = imageUpload.secure_url;

            await userModel.findByIdAndUpdate(userId, {image : imageUrl})
        }

        res.json({success :true, message : "Profile Updated"})



    }catch (error) {

        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//api to book appointment 
const bookAppointment = async (req, res)=>{

    try {
        const {userId} = req;
        const {docId, slotDate, slotTime} = req.body;
        const doctorId = docId;
        const doctorData = await doctorModel.findById(docId).select('-password');
        if(!doctorData.available){
            res.json({success: false, message: "Doctor Not Available"})
        }

        let slots_booked = doctorData.slots_booked ;

        //checking for slots availability 
        if(slots_booked[slotDate]){

     
        if(slots_booked[slotDate] && slots_booked[slotDate].includes(slotTime)) {

            res.json({success: false, message: "Slot Not Available"})

        }else{
            slots_booked[slotDate].push(slotTime);
        }
    }
    else{
        slots_booked[slotDate] = [];
        slots_booked[slotDate].push(slotTime);
                

        }
            
        const userData = await userModel.findById(userId).select('-password');

        delete doctorData.slots_booked;

        const appointmentData = {
            userId, doctorId, userData, doctorData, amount : doctorData.fees, slotDate, slotTime, date : Date.now()
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        await doctorModel.findByIdAndUpdate(docId, {slots_booked});

        res.json({success: true, message: "Appointment Booked"});


    

        
    }catch (error) {

        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//list appointments for user

const listAppointments = async(req, res)=>{
    try {
        const {userId} = req;
        const appointments = await appointmentModel.find({userId});
        res.json({success: true, appointments});
        
     }catch (error) {

        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const cancelAppointment = async(req,res)=>{
    try {
        const {userId} = req;
        const {appointmentId} = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
        if(userId !== appointmentData.userId){
            return res.json({success: false, message : "Unauthorized action"})
        }
        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled : true});

        // removing doctors slot
        
        const {doctorId, slotDate, slotTime} = appointmentData;
        const doctorData = await doctorModel.findById(doctorId);
        console.log({doctorId, slotDate, slotTime})
        console.log(doctorData)
        let slots_booked = doctorData.slots_booked;
        slots_booked[slotDate] = slots_booked[slotDate].filter (e => e!== slotTime);
        await doctorModel.findByIdAndUpdate(doctorId, {slots_booked});
        
        res.json({success: true, message :"Appointment Cancelled"});
      
        
    }catch (error) {

        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
//api to make payment of appointment using razor pay
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

const paymentRazorpay = async( req, res)=>{
    try {
        const {appointmentId} = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if(!appointmentData || appointmentData.cancelled){
        return res.json({success : false, message : "Apppintment Cancelled or not Found"});
    }

    const options = {
        amount : appointmentData.amount*100,
        currency : "INR",
        receipt : appointmentId


    }

    // creation of an order 

    const order = await razorpayInstance.orders.create(options);
    
    res.json({success: true, order});
     }catch (error) {

        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// api to verify razorpay transaction

const verifyRazorpay = async(req, res)=>{
    try {
        const {razorpay_order_id} = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        console.log(orderInfo);
        if(orderInfo.status === 'paid'){

            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {payment : true});
            res.json({success:true, message : "Payment Successful"})
        }
        else{
             res.json({success:false, message : "Payment Failed"})
        }
        
   }catch (error) {

        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
export { registerUser , loginUser,getProfile, updateProfile, bookAppointment, listAppointments, cancelAppointment,paymentRazorpay, verifyRazorpay};
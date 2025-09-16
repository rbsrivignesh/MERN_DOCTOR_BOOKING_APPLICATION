//api for adding doctor
import validator from 'validator'
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';


const addDoctor = async (req,res)=>{
    try {
        const {name,email,password,speciality, degree, experience, about, fees, address} = req.body;
        const imageFile = req.file;

       // checking for all data to add doctor

       console.log({name,email,password,speciality, degree, experience, about, fees, address} );
       
       if(!name
        || !email || !password || !degree || !experience || !about || !fees ||!address || !speciality
       ){
        return res.json({success : false , message : "Missing Details"})
    }
    
    // validating email format 
    
    if(!validator.isEmail(email)){
           return res.json({success : false , message : "Please enter a valid email"})
           
        }
        
        // validating strong password 
        if(password.length < 8){
        return res.json({success : false , message : "Please enter a Strong password"})

    }

    // hashing doctor password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    // upload image to cloudinary

    const imageUpload = await cloudinary.uploader.upload(imageFile.path,{
        resource_type: "image"
    });

    const imageUrl = imageUpload.secure_url;
    console.log(imageUrl);

    //saving doctor data in db

    const doctorData = {
        name,
        email,
        image : imageUrl,
        password :hashedPassword,
        degree,
        experience,
        about, 
        fees,
        speciality,
        address : JSON.parse(address),
        date : Date.now()
    
    }

    const newDoctor = new doctorModel(doctorData);

    await newDoctor.save();


    res.json({success : true, message : "Doctor added to the db"});


        
    } catch (error) {
        
        console.log(error);
        res.json({success: false, message : error.message})
    }
}


// api for admin login

const loginAdmin = async (req, res) =>{
    try { 

        const {email,password} = req.body;
        if( email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){


            const token = jwt.sign(email+password, process.env.JWT_SECRET);

            res.json({success:true, token});
        }
        else{
            res.json({success: false, message : "Wrong Credentials"})
        }

    } catch (error) {
        
        console.log(error);
        res.json({success: false, message : error.message})
    }}

    //api to get all doctors list for admin panel

    const allDoctors = async (req,res)=>{

        try {
            
            const doctors = await doctorModel.find({}).select('-password');

            res.json({success : true, doctors})

        } catch (error) {
        
        console.log(error);
        res.json({success: false, message : error.message})
    }}

//api to get all appointments 

const appointmentsAdmin = async (req, res)=>{

    try {
        const appointments = await appointmentModel.find({});

        res.json({success : true, appointments});


    }
    catch(error){

        res.json({success : false, message : error.message});
    }
}

//cancel appointments from admin

const appointmentCancel = async(req,res)=>{
    try {
     
        const {appointmentId} = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);
        
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

// api to get dashboard data for admin panel

const adminDashboard = async(req, res)=>{

    try {
        const doctors = await doctorModel.find({}).select('-password');
        const users = await userModel.find({}).select('-password');
        const appointments = await appointmentModel.find({});
        const dashData = {
            doctors : doctors.length,
            patients : users.length,
            latestAppointments : appointments.reverse().slice(0,5),
            appointments : appointments.length
        }

        res.json({success: true, dashData});
        
      }catch (error) {

        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin, appointmentCancel, adminDashboard};
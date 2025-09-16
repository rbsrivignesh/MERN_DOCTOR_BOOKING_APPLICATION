import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";
const changeAvailability = async (req,res)=>{

    try {
        const {docId} = req.body;
        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId, {available : !docData.available});
        res.json({success: true, message : "Availability changed"})
    }  catch (error) {
            
            console.log(error);
            res.json({success: false, message : error.message})
    }}



     const doctorList = async (req,res)=>{

        try {
            
            const doctors = await doctorModel.find({}).select(['-password','-email']);

            res.json({success : true, doctors})

        } catch (error) {
        
        console.log(error);
        res.json({success: false, message : error.message})
    }}

    //api for doctor login 

    const loginDoctor = async(req, res)=>{
        try {
            const {email, password} = req.body;

            const doctor = await doctorModel.findOne({email});

            if(!doctor){
            return res.json({success: false, message: "Doctor Not Found"});
            }

            const isMatch = await bcrypt.compare(password, doctor.password);

            if(!isMatch){
                return res.json({success: false, message : "Invalid Credentials"});
            }

            const token =  jwt.sign({ id : doctor._id}, process.env.JWT_SECRET);

            res.json({success:true, token});
        
         } catch (error) {
        
        console.log(error);
        res.json({success: false, message : error.message})
    }}

    //get all appointments of a specific doctor
    const appointmentsDoctor = async(req, res)=>{
        try {
            const {doctorId} = req;
            const appointments = await appointmentModel.find({doctorId});

            res.json({success:true, appointments});

            
        } catch (error) {
        
        console.log(error);
        res.json({success: false, message : error.message})
    }}

    //api to mark appointment completed 

    const appointmentComplete = async(req, res)=>{
        try{
            const {doctorId} = req;
            const {appointmentId} = req.body;

            const appointmentData = await appointmentModel.findById(appointmentId);

            if(appointmentData && appointmentData.doctorId === doctorId){
                await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted : true});

                return res.json({success: true, message : "Appointment Completed"});
            }
            else{
                return res.json({success:false, message : "UnAuthorized Actions - Mark Failed"})
            }

         } catch (error) {
        
        console.log(error);
        res.json({success: false, message : error.message})
    }}
        const appointmentCancel= async(req, res)=>{
        try{
            const {doctorId} = req;
            const {appointmentId} = req.body;

            const appointmentData = await appointmentModel.findById(appointmentId);

            if(appointmentData && appointmentData.doctorId === doctorId){
                await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled : true});

                console.log(doctorId);
                console.log(appointmentId);

                return res.json({success: true, message : "Appointment Cancelled"});
            }
            else{
                return res.json({success:false, message : "UnAuthorized Actions - Mark Failed"})
            }

         } catch (error) {
        
        console.log(error);
        res.json({success: false, message : error.message})
    }}

    //doctor dashboarddata

    const doctorDashboard = async(req, res)=>{
        try {
            const {doctorId} = req;
            const appointments = await appointmentModel.find({doctorId});
            let earnings = 0; 

            appointments.map((item,index)=>{
                if(item.isCompleted || item.payment){
                    earnings += item.amount;
                }
            })

            let patients = [];

            appointments.map((item, index)=>{
                if(!patients.includes(item.userId)){
                    patients.push(item.userId);
                }
            });

            const dashData = {
                earnings, 
                appointments : appointments.length,
                patients : patients.length,
                latestAppointments : appointments.reverse().slice(0,5)
            }
            res.json({success : true, dashData});
        } catch (error) {
        
        console.log(error);
        res.json({success: false, message : error.message})
    }}


    // api to get doctor profile 
    const doctorProfile = async(req, res)=>{
        try {

            const {doctorId} = req;
            const profileData = await doctorModel.findById(doctorId).select("-password");

            res.json({success: true, profileData});

            
         } catch (error) {
        
        console.log(error);
        res.json({success: false, message : error.message})
    }}

    const updateDoctorProfile = async(req, res)=>{
        try {
            const {doctorId} = req;
            const {fees, address, available} = req.body;

            await doctorModel.findByIdAndUpdate(doctorId, {
                fees, address, available
            });

            res.json({success: true, message : "Profile updated"})
          } catch (error) {
        
        console.log(error);
        res.json({success: false, message : error.message})
    }}

export {changeAvailability,doctorList,loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard,doctorProfile, updateDoctorProfile};
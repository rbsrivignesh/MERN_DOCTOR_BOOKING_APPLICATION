import express from 'express'
import {appointmentCancel, appointmentComplete, appointmentsDoctor, doctorDashboard, doctorList, doctorProfile, loginDoctor, updateDoctorProfile} from '../controller/doctorController.js';
import authDoctor from '../middleware/authDoctor.js';

const doctorRouter = express.Router();

doctorRouter.post("/login",loginDoctor);
doctorRouter.get("/list",doctorList);
doctorRouter.get("/appointments",authDoctor,appointmentsDoctor);
doctorRouter.post("/cancel",authDoctor,appointmentCancel);
doctorRouter.post("/complete",authDoctor,appointmentComplete);
doctorRouter.get("/dash-data",authDoctor,doctorDashboard);
doctorRouter.get("/profile-data",authDoctor,doctorProfile);
doctorRouter.post("/update-profile",authDoctor,updateDoctorProfile);


export default doctorRouter;
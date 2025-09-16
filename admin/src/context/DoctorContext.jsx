import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props)=>{
     const backendUrl = import.meta.env.VITE_BACKEND_URL;
     const [dToken, setDToken] =  useState(localStorage.getItem("dToken")? localStorage.getItem("dToken"):"");
    const [dashData, setDashData] = useState(false)
    const [appointments, setAppointments] = useState([]);
    const [profileData, setProfileData] = useState(false)

    const completeAppointment = async(appointmentId)=>{
        try {
            const {data} = await axios.post(backendUrl + "/api/doctor/complete",{appointmentId},{headers:{dToken}} );
            if(data.success){
                toast.success(data.message);
                   getAppointments();
            }
            else{
                toast.error(data.message);
            }
            
        } catch (error) {
            toast.error(error.message);
            
        }
    }
       const cancelAppointment = async(appointmentId)=>{
        try {
            const {data} = await axios.post(backendUrl + "/api/doctor/cancel",{appointmentId},{headers:{dToken}} );
            if(data.success){
                toast.success(data.message);
                getAppointments();
            }
            else{
                toast.error(data.message);
            }
            
        } catch (error) {
            toast.error(error.message);
            
        }
    }

    const getAppointments = async ()=>{
        try {
            const {data} = await axios.get(backendUrl+"/api/doctor/appointments",{headers : {dToken}});
            if(data.success){
                console.log(data.appointments);
                setAppointments(data.appointments);
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error)
            
        }
    }
    const getDashData = async()=>{
        try {
            const {data}= await axios.get(backendUrl+"/api/doctor/dash-data",{headers : {dToken}});
            if(data.success){
                setDashData(data.dashData);
                console.log(data.dashData);         
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error)
            
        }
    }
    const getProfileData = async()=>{
        try {
            const {data} = await axios.get(backendUrl +"/api/doctor/profile-data",{headers: {dToken}});
            if(data.success) {
                setProfileData(data.profileData);
                console.log(data.profileData);
            }
            
       } catch (error) {
            toast.error(error.message);
            console.log(error)
            
        }
    }
     const value = {
        backendUrl,dToken, setDToken, getAppointments,appointments, setAppointments, completeAppointment, cancelAppointment, dashData, getDashData, setDashData, profileData, setProfileData, getProfileData



    }


    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider;
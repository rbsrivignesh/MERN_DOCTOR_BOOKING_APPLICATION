import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
           const connect= await mongoose.connect(`${process.env.CONNECTION_STRING}/presciptio092025`);
           console.log(connect.connection.host);
           console.log(connect.connection.name);
        
    } catch (error) {
            console.log(error);
    }


   
}

export default connectDB;
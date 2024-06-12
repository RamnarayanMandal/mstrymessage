import mongoose from "mongoose";

type connectionObject = {
    isconnected?: number
}

const connection: connectionObject = {}

async function dbconnection():Promise<void> {
    if(connection.isconnected){
      console.log("Already connected to Database");
    }

    try {

      const db =  await mongoose.connect(process.env.MONGODB_URL||"",{})
      connection.isconnected=db.connections[0].readyState
        
      console.log("Connected to Database successfully");
    } catch (error) {

        console.log("Database connection failed: " + error)
        process.exit(1);
    }
    
}

export default dbconnection;
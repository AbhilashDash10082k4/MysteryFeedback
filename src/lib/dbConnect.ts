//Nextjs is edge time server, which means it runs only when user sends request, and when it runs, the db is connected at that time, so if multiple requests are sent it will choke the application. To prevent this we check that if the application is running already then the connected db should be used

import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number //this means that the data type coming from the connected db may or may not be a number 
}
const connection: ConnectionObject = {} //type(connection) = ConnectionObject which is initialized to empty

async function dbConnect(): Promise<void> { //this function dbConnect connects with the db, it is async as the connection takes time as the db is another continent
    if(connection.isConnected) { //checking connection
        console.log("");
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "",{});
        connection.isConnected = db.connections[0].readyState
        console.log("DB is connected")
    }catch(error) {
        console.log("DB is not connected", error);
        process.exit(1);
    }
}
export default dbConnect;
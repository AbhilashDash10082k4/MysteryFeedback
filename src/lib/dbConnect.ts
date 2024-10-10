//Nextjs is edge time server, which means it runs only when user sends request, and when it runs, the db is connected at that time, so if multiple requests are sent it will choke the application. To prevent this we check that if the application is running already then the connected db should be used

import mongoose from "mongoose";

type ConnectionObject = { //an object of type ConnectionObject
    isConnected?: number //this means that the data type coming from the connected db is a number 
}
const connection: ConnectionObject = {} //type(connection) = ConnectionObject which is initialized to empty

async function dbConnect(): Promise<void> { //this function dbConnect connects with the db, it is async as the connection takes time as the db is another continent
    //condition fro already connected db
    if(connection.isConnected) { //checking connection
        console.log("Already connected to DB");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "",{});
        console.log(db);
        connection.isConnected = db.connections[0].readyState //db.connections = array holding connection with DB, [0] = 1st connection with the DB, readyState= current state of DB connection (connection status),

        //db.connections[0].readyState => current state of 1st connection with the DB, current state = number

        /*if db.connecitons[0].readyState = 
        0 => The connection is not established.
        1=> connection is successfully established.
        2=>connection is in the process of being established.
        3=> connection is in the process of being closed.*/ 
        console.log(connection.isConnected);
        console.log(db.connections);
        console.log("DB is connected");

    }catch(error) {
        console.log("DB is not connected", error);
        process.exit(1);
    }
}
export default dbConnect;
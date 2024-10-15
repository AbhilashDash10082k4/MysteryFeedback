import mongoose, {Schema, Document} from "mongoose"; //Document- for type safety used in typescript

export interface Message extends Document { //this line says that Message is an extension of Document which belongs to mongoose, this interface defines custom data type for messages
    //fields inside Message
    content: string,
    createdAt: Date,
}

//schema of message , schema - defined for database and interface defines the input type for frontend
const MessageSchema: Schema<Message> = new Schema ({ //Schema<Message> => schema should follow interface of message,
    content: {
        type: String,
        required: true
    },
    createdAt: {
        required: true, //reqd is an attribute or component of Schema
        type: Date,
        default: Date.now //Date.now gives the current date
    }
})

//user
export interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifyCode: string,//to verify user
    veriCodeExpiry: Date, //expire user login
    isAcceptingMessage: boolean, //if the user is accepting anonymous message
    isVerified: boolean,
    //har msg ka alag document ban rha hai and that document is stored in User Document
    message: Message[]// Message documet is initialized as an array in User
}
const UserSchema : Schema<User> = new Schema ({
    //defining schema for every field in User
    username: {
        type: String,
        required: [true, "Username is required"], //Username is required is a custom message passed if username is not filled
        trim: true,// trim=true if many spaces in username
        unique : true //unique username, diff than stored in database
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        //verify for valid email = done through regex => tool for text processing fro matching, searching, based on patterns
        match: [/.+\@.+\..+/, "Use a valid email"], ///.+\@.+\..+/ => simple regex for email validation, match =>  for testing valid email
        unique: true
    },
    password: {
        type: String,
        required: [true, "Enter password"], //add password checker for strong password
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"],
    },
    veriCodeExpiry: {
        type: Date,
        required: [true, "Verify code expiry is required"],
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    isVerified: {
        type: Boolean,
        default: false //not everyone is verified at the beginning
    },
    message: [MessageSchema] //array of MessageSchema
})

//exporting these data as UserModel
//in next.js the server is refreshed everytime it is run and it fertches data each time it runs, so whether the data exists in db or not based on that the model is exported
const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema)) //1st case 
export default UserModel; //<User> is typechecking
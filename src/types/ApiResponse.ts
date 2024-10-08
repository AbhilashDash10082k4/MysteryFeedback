//standardizing response, showing required type of msg through API response
import { Message } from "@/model/User"
export interface ApiResponse {  //response by API
    //any time an optional field can be included to suggest messages(by openAi) and to get type safety
    success: boolean, //response of Api is a success or not
    message: string, //api sends messages
    isAcceptingMessages?: boolean // ? as not all the time isAcceptingMessages is needed to be sent
    messages?: Array<Message> //needed for if the user only sends messages or many messages are shown from db, ? as it works only specific cases
}
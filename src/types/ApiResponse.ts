import {Message} from '../model/user'

export interface ApiResponses{
    sucess: boolean;
    message: string;
    isAccesptingMessage?: boolean;
    messages?: Array<Message>;
}
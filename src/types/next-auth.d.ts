import 'next-auth'
import { DefaultSession } from 'next-auth';

declare module 'next-auth'{
    interface User{
        _id?:string;
        username?:string;
        email?:string,
        isVerified?:boolean;
        isAccetingMessage?:boolean;
    }
    interface Session{
        user:{
            _id?:string;
            username?:string;
            email?:string;
            isVerified?:boolean;
            isAccetingMessage?:boolean;
        } & DefaultSession['user']
    }
}



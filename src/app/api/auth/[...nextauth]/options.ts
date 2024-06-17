import { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from "bcryptjs";
import dbconnection from "@/lib/dbconnection";
import UserModel from "@/model/user";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Enter your Email"
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Enter your password"
                },
            },
            async authorize (credentials:any):Promise<any> {
                await dbconnection();
               try {
                 const user = await UserModel.findOne({ 
                    $or:[
                        { email: credentials.identifier },
                        { username: credentials.identifier }
                    ]
                    
                     });

                     if(!user){
                         throw new Error("No user found with this username or email")
                     }
                 if (!user.isVerifed) {
                     throw new Error("User is not verified plz verifify your account before logning")
                 }

               const isPasswordCorrect =  bcrypt.compare(credentials.password, user.password);

               if(isPasswordCorrect){
                 return user;

               }
               else{
                 throw new Error("Password is incorrect")
  
               }

               } catch (error) {
                 console.log("Error while authorizing user", error);
                 return null;
                
               }
               

            }
        })
    ],
    callbacks:{
       async  jwt({token,user}) {
        if(user){
           token._id = user._id?.toString() 
           token.username = user.username
           token.email = user.email
           token.isVerified = user.isVerified
           token.isAccetingMessage = user.isAccetingMessage
        }
        return token
        
       } ,

       async session({session,token}) {
        if (token){
            session.user._id = token._id
            session.user.username = token.username
            session.user.email = token.email
            session.user.isVerified = token.isVerified
            session.user.isAccetingMessage = token.isAccetingMessage
            
        }
        
        return session;
       }

    },
    pages:{
        signIn: "/sign-in",
       
    },
    session: {
       strategy:"jwt",
    },
    secret:process.env.NEXTAUTH_SECRET,
    
};

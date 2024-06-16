import {resend} from "@/lib/resend"
import verificationEmail from "../../.next/emails/verificationEmail"
import {ApiResponses} from '@/types/ApiResponse'
import { promises } from "dns"



export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
):Promise<ApiResponses> {
  

    try {

         await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystry Message | verification code',
            react: verificationEmail({username, otp:verifyCode}),
          });

        return{
            sucess: true,
            message: 'Verification email has been send successfully'
        }
        
    } catch (error:any) {

        console.log("Error sending verifation email",error.message)
        return {
            sucess: false,
            message: 'Failed to send verification email'
        }
        
    }
    
}
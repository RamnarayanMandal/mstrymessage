import dbconnection from "@/lib/dbconnection";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/hepler/sendVerificationEmail";

export async function POST(req: Request, res: Response) {
  await dbconnection();

  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "username,email and password is required",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByVerification = await UserModel.findOne({
      username,
      isVerifed: true,
    });

    if (existingUserByVerification) {
      return Response.json(
        {
          success: false,
          message: "User already exist",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    const verifiedCode = Math.floor(10000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerifed) {
        return Response.json(
          {
            success: false,
            message: "User already exist with this email",
          },
          {
            status: 400,
          }
        );
      }

      const hasedPassword = await bcrypt.hash(password,10)
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + 1); 

      existingUserByEmail.password = hasedPassword;
      existingUserByEmail.verifiedCode = verifiedCode;
      existingUserByEmail.verifyCodeExpriry = expiryDate;

       await existingUserByEmail.save();

      

    } else {
      const hasedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hasedPassword,
        verifiedCode,
        verifyCodeExpriry: expiryDate,
        isVerifed: false,
        isAccetingMessage: true,
        messages: [],
      });

      const user = await newUser.save();

      if (!user) {
        return Response.json(
          {
            success: false,
            message: "Error while singup User",
          },
          {
            status: 500,
          }
        );
      }

      // send verification email

      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifiedCode
      );

      if (!emailResponse.sucess) {
        return Response.json(
          {
            success: false,
            message: emailResponse.message,
          },
          {
            status: 500,
          }
        );
      }

      return Response.json(
        {
          success: true,
          message: "User singup successfully and plz verified your email ",
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.log("Error while singup User", error);
    return Response.json(
      {
        success: false,
        message: "Error while singup User",
      },
      {
        status: 500,
      }
    );
  }
}

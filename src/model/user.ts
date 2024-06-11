import mongoose,{Schema,Document} from 'mongoose';

export interface Message extends Document {
    content:String,
    cratedAt:Date,
    updatedAt:Date

}

const MessageSchema:Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
   
},{timestamps:true});


export interface User extends Document {
    username:String,
    email:String,
    password:String,
    verifiedCode:String,
    verifyCodeExpriry:Date,
    isVerifed:boolean,
    isAccetingMessage:boolean,
    messages:Message[],
    cratedAt:Date,
    updatedAt:Date
}


const UserSchema:Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        unique:true,
        
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"please use valid email"]
       
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    verifiedCode:{
        type:String,
        required:[true,"verify code is required"]
    },
    verifyCodeExpriry:{
        type:Date,
        required:[true,"verify code expriry is required"]
    },
    isVerifed:{
        type:Boolean,
        default:false
    },
    isAccetingMessage:{
        type:Boolean,
        default:true
    },
    messages:{
        type:[MessageSchema],
         default:[]
    }
},{timestamps:true});

const UserModel = (mongoose.models.User as mongoose.Model<User>) ||  mongoose.model<User>("User",UserSchema)

export default UserModel;
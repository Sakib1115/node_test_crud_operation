const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const userSchema=mongoose.Schema;
let userKey=new userSchema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String
    },
    mobileNumber:{
        type:String
    },
    CountryCode:{
        type:String,
        default:"+91"
    },
    userName:{
        type:String
    },
    Address:{
        type:String
    },
    password:{
      type:String
    },
    DateOfBirth:{
        type:String
    },
    otp:{
        type:String
    },
    otpExpireTime:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    userType:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER"
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCK","DELETE"],
        default: "ACTIVE",
      }
},{timestamps:true})
module.exports = mongoose.model("user",userKey);
let adminModel = mongoose.model("user", userKey);
adminModel.findOne({userType:"admin",status:"ACTIVE"},(err,res)=>{
  if(err){
console.log('Server Errror',err)
  }else if(res){
console.log('Admin already exist.')
  }else{
    let admin = {
      firstName:"sakib",
      lastName:"ansari",
      email:"pqc-trainee@mobiloitte.com",
      mobileNumber:"1234567890",
      password:bcrypt.hashSync('Mobiloitte1'),
    }
    adminModel(admin).save((saveErr,saveRes)=>{
      if(saveErr){

      }else{
        console.log('Default admin created.')
      }
    })
  }
})

const userModel=require('../Model/userModel');
const bcrypt=require('bcryptjs');
const commonFunction=require('../helper/commonFunction');
const jwt = require('jsonwebtoken');

module.exports={
    signUp:async(req,res)=>{
        try {
            const result = await userModel.findOne({ $and: [{ $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber },
             { userName: req.body.userName }] }, { status: { $in: ["ACTIVE", "BLOCK"] } }, { userType: { $in: "USER" } }] })
            if (result) {
                if (result.email == req.body.email) {
                    res.send({ ResponseCode: 409, ResponseMessage: "email already exist" })
                }

                else if (result.mobileNumber == req.body.mobileNumber) {
                    res.send({ ResponseCode: 409, ResponseMessage: "mobileNumber already exist" })
                }

                else if (result.userName == req.body.userName) {
                    res.send({ ResponseCode: 409, ResponseMessage: "userName already exist" })
                }
            } else {
                req.body.password = bcrypt.hashSync(req.body.password);
                req.body.otp = commonFunction.generateOtp();
                console.log(req.body.otp);
                req.body.otpExpireTime = Date.now() + (3 * 60 * 1000)
                var userName=req.body.userName;

                let subject = "Email Verification"
                let body = `dear Coustomer,\n\t Verify your Email with the following one time password(OTP)- ${req.body.otp} and Do not share this Otp with anyone.
                \nthis OTP will expire in 3 minutes.\n\n you can use the link below to verify email http://localhost:3000/user/emailLinkVerify?id=${req.body.userName}.`
                await commonFunction.sendMail(req.body.email, subject, body);

                const saveResult = await new userModel(req.body).save();
                console.log(saveResult)
                res.send({ responseCode: 200, responseMessage: "signUp successfully done", result: saveResult })
           
            }
 
        } catch (error) {
            console.log(error)
            res.send({ responseCode: 501, responseMessage: "something want to wrong", result: error }); 
        }
    },
    emailLinkVerify:async(req,res)=>{
        try {
            let id=req.query._id
        console.log("id:",id)
        let user=await userModel.findOne({userName:id})
        console.log("user",user)
        if(id==user.userName && user!=null){
            const result=await userModel.findOneAndUpdate({userName:user.userName},{isVerified:true},{new:true})
            res.send({responseCode:200,responseMessage:"email is Verify",result:result})
        }
        } catch (error) {
            res.send({ responseCode: 501, responseMessage: "email is not verify", result: error }); 

        }
    },
    otpVerify:async(req,res)=>{
        try {

            let result = await userModel.findOne({ $and: [{ $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }, { userName: req.body.userName }] }, 
                { status: { $in: ["ACTIVE", "BLOCK"] } }, { userType: { $in: "USER" } }] })
                console.log(result)
            console.log(result)
            if (!result) {

                if (result.email != req.body.email) {
                    res.send({ ResponseCode: 404, ResponseMessage: "email not exist" })
                }
            }
            else{
                if (result.otpExpireTime<=Date.now()) {
                    res.send({ responseCode: 400, responseMessage: "OTP time expire" });
                } else {
                    if (result.otp!=req.body.otp) {
                        res.send({ responseCode: 400, responseMessage: "invelid otp" })
                    } else {
                        const updateResult = await userModel.findByIdAndUpdate({ _id: result._id }, { $set: { isVerified: true } }, { new: true });
                        res.send({ ResponseCode: 200, responseMessage: "OTP verify successfully", result: updateResult });
                    }
                }
            } 
        } catch (error) {
            console.log(error)
            res.send({ responseCode: 501, responseMessage: "something want to wrong", result: error });
        }
    },
    login:async(req,res)=>{
        try {
            let result = await userModel.findOne({ $and: [{ $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }, { userName: req.body.userName }] },
                { status: { $in: ["ACTIVE", "BLOCK"] } }, { userType: { $in: "USER" } }] })
           console.log(result)
           var check = bcrypt.compareSync(req.body.password, result.password);
           if (!result) {
               if (result.email != req.body.email) {
                   res.send({ ResponseCode: 404, ResponseMessage: "email not exist" })
               }else if(result.mobileNumber !=req.body.mobileNumber){
                   res.send({ ResponseCode: 404, ResponseMessage: "mobileNumber not exist" })
               }else if(result.userName !=req.body.userName){
                   res.send({ ResponseCode: 404, ResponseMessage: "userName not exist" })
               }
           }
           else if (result.isVerified == false) {
               res.send({ responseCode: 401, responseMessage: "Email is not verified" })
           } else if (check == false) {
               res.send({ responseCode: 401, responseMessage: "Incorrect password", result: check })
           } else {
               let token = await jwt.sign({ _id: result._id, email: result.email }, 'secret', { expiresIn: '1h' })

               res.send({ responseCode: 200, responseMessage: "login successfully done", result: { result, token } })
           }
        } catch (error) {
            res.send({ responseCode: 501, responseMessage: "something want to wrong", result: error });

        }
    },
    resendOtp:async(req,res)=>{
        try {
            const result=await userModel.findOne({$and:[{email:req.body.email},{status:{$in:["ACTIVE","BLOCK"]}},{userType:{$in:"USER"}}]})
            if (!result) {
                if (result.email != req.body.email) {
                    res.send({ ResponseCode: 404, ResponseMessage: "email not exist" })
                }
            } else {
                req.body.otp = commonFunction.generateOtp();
                console.log(req.body.otp);
                req.body.otpExpireTime = Date.now() + (3 * 60 * 1000)

                let subject = "resend OTP"
                let body = `dear Coustomer,\n\t Verify your Email with the following one time password(OTP)- ${req.body.otp} and Do not share this Otp with anyone.this OTP will expire in 3 minutes.`
                await commonFunction.sendMail(req.body.email, subject, body);

                const updateResult = await userModel.findByIdAndUpdate({_id:result._id},{$set:{otp:req.body.otp,otpExpireTime:req.body.otpExpireTime}},{new:true})
               if(updateResult){
                res.send({ responseCode: 200, responseMessage: "resend OTP", result: updateResult })
               }
            }
        } catch (error) {
            res.send({ responseCode: 501, responseMessage: "something want to wrong", result: error });
 
        }
    },
    resetPassword:async(req,res)=>{
        try {
            const result=await userModel.findOne({$and:[{email:req.body.email},{status:{$in:["ACTIVE","BLOCK"]}},{userType:{$in:"USER"}}]})
            if (!result) {
                if (result.email != req.body.email) {
                    res.send({ ResponseCode: 404, ResponseMessage: "email not exist" })
                }
            } else {
                console.log(req.body.otp)
                console.log(result.otp)
                if (req.body.otp!=result.otp) {
                    res.send({responseCode:400,responseMessage:"Invalid OTP"})
                } else {
                    if (result.otpExpireTime<=Date.now()) {
                        res.send({responseCode:400,responseMessage:"OTP Time Expire"})
                    } else {
                        let newPassword=req.body.newPassword;
                        let confirmPassword=req.body.confirmPassword;
                        if (newPassword!=confirmPassword) {
                            res.send({responseCode:400,responseMessage:"Password Not Match"})
                        } else {
                            req.body.password=bcrypt.hashSync(req.body.confirmPassword);
                            const updateResult=await userModel.findByIdAndUpdate({_id:result._id,userType:{$in:"USER"}},{$set:{password:req.body.password,isVerified:true}},{new:true})
                            res.send({responseCode:200,responseMessage:"password reset successfully done",result:updateResult})
                        }
                    }
                }
            }
        } catch (error) {
            res.send({ responseCode: 501, responseMessage: "something want to wrong", result: error });
        }
    },
    forgotPassword:async(req,res)=>{
        try {
            const result=await userModel.findOne({$and:[{email:req.body.email},{status:{$in:["ACTIVE","BLOCK"]}},{userType:{$in:"USER"}}]})
            if (!result) {
                if (result.email != req.body.email) {
                    res.send({ ResponseCode: 404, ResponseMessage: "email not exist" })
                }
            } else {
                req.body.otp = commonFunction.generateOtp();
                console.log(req.body.otp);
                req.body.otpExpireTime = Date.now() + (3 * 60 * 1000)

                let subject = "forgot password"
                let body = `dear Coustomer,\n\t Verify your Email with the following one time password(OTP)- ${req.body.otp} and Do not share this Otp with anyone.this OTP will expire in 3 minutes.`
                await commonFunction.sendMail(req.body.email, subject, body);
                const saveResult = await userModel.findByIdAndUpdate({_id:result._id},{$set:{otp:req.body.otp,otpExpireTime:req.body.otpExpireTime}},{new:true})
                // const saveResult = await new userModel(req.body).save();
                res.send({ responseCode: 200, responseMessage: "forgotPassword successfully done", result: saveResult })
            }
        } catch (error) {
            res.send({ responseCode: 501, responseMessage: "something went to wrong", result: error });
        }
    },
    viewProfile:async(req,res)=>{
        try {
            const result=await userModel.findOne({_id:req.userId})
                if (!result) {
                    return res.send({responseCode:404,responseMessage:"email does not exist"})

                } else {
                    return res.status(200).send({responseCode:200,responseMessage:"viewProfile successfully done",result:result})

                }
    
        }catch (error) {
            res.send({responseCode:500,responseMessage:"Something Went Wrong",result:error})

        }
    },
    editProfile:async(req,res)=>{
        try {
            const result= await  userModel.findOne({_id:req.userId})
            if (!result) {
                return res.send({responseCode:404,responseMessage:"email does not exist"})

            } else {
               const updateResult = await userModel.findByIdAndUpdate({_id:result._id},{$set:{firstName:req.body.firstName,lastName:req.body.lastName,mobileNumber:req.body.mobileNumber}},{new:true})
               res.send({responseCode:200,responseMessage:"editProfile successfully done",responseResult:updateResult})

            }
        } catch (error) {
            res.send({responseCode:501,responseMessage:"Something Went Wrong",result:error})
        }
    },
    changePassword:async(req,res)=>{
        try {
            const result =await userModel.findOne({_id:req.userId})
            if (!result) {
                return res.send({responseCode:404,responseMessage:"email does not exist"})
            } else {
                var check = await bcrypt.compareSync(req.body.currentPassword, result.password);
                if(check==false){
                    res.send({responseCode:401,responseMessage:"incorrect password"})
                }else{
                    let newPassword=req.body.newPassword;
                    let confirmPassword=req.body.confirmPassword;
                    if(newPassword!=confirmPassword){
                        req.send({responseCode:400,responseMessage:"password not match"})
                    }else{
                        req.body.password=bcrypt.hashSync(req.body.confirmPassword);
                        const updateResult =await userModel.findByIdAndUpdate({_id:result._id,userType:{$ne:"admin"}},{$set:{password:req.body.password}},{new:true})
                        res.send({responseCode:200,responseMessage:"changePassword successfully done",responseResult:updateResult})


                    }
                }
            }
        } catch (error) {
            res.send({responseCode:500,responseMessage:"Something Went Wrong",result:error})
        }
    },
    allDatabase:async(req,res)=>{
        try {
           const result=await userModel.find({$and:[{_id:req.userId},{userType:"USER"}]})
                if (result) {
                    res.send({responseCode:200,responseMessage:"all data fetch successfully",result:result})
                } 
            
        } catch (error) {
            res.send({responseCode:501,responseMessage:"Something Went Wrong",result:error})
  
        }
    }
}
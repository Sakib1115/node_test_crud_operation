const userRouter=require('express').Router();
const userController=require('../Controller/userController');
const auth=require('../middlewere/auth');

userRouter.post('/signUp',userController.signUp);
userRouter.get('/emailLinkVerify',userController.emailLinkVerify);
userRouter.put('/otpVerify',userController.otpVerify);
userRouter.post('/login',userController.login);
userRouter.put('/resendOtp',userController.resendOtp);
userRouter.put('/resetPassword',userController.resetPassword);
userRouter.put('/forgotPassword',userController.forgotPassword);
userRouter.get('/viewProfile',auth.verifyToken,userController.viewProfile);
userRouter.get('/editProfile',auth.verifyToken,userController.editProfile);
userRouter.put('/changePassword',auth.verifyToken,userController.changePassword);
userRouter.get('/allDatabase',auth.verifyToken,userController.allDatabase);
module.exports=userRouter;
const nodemailer =require("nodemailer");

module.exports={
    generateOtp:()=>{
        let otp = Math.floor(100000 + Math.random() * 900000);
        return otp;
    },
    sendMail:(email,subject,body,callback)=>{
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "pqc-trainee@mobiloitte.com",
                pass: "Mobiloitte1"
            }
        })
        // console.log(nodemailer)
        let info = transporter.sendMail({
            from: 'pqc-trainee@mobiloitte.com',
            to: 'cpp-naumaan@indicchain.com',
            subject: subject,
            text : body
        }, (err, result) => {
            console.log("ERROR", err, "result", result)
            if (err) {
              
                callback(err, null);
            } else {
              
                callback(null, result);
            }
        })
    }
}
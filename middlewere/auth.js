const userModel = require('../Model/userModel');
const jwt = require('jsonwebtoken');

module.exports = {

    verifyToken: (req, res, next) => {
        try {
            jwt.verify(req.headers.token, 'secret', (err, result) => {
                if (err) {
                    //    response(res,ErrorCode.INTERNAL_ERROR,err,ErrorMessage.INTERNAL_ERROR);
                    return res.send({
                        errorCode: 500,
                        responseMessage: "Internal Server error",
                        error: err
                    })
                }
                else {
                    console.log("15", result._id);
                    userModel.findOne({ _id: result._id }, (userErr, userResult) => {
                        if (userErr) {
                            return res.send({
                                errorCode: 500,
                                responseMessage: "Internal Server error",
                                error: userErr
                            })
                        }
                        else if (!userResult) {
                            response(res, ErrorCode.NOT_FOUND, [], "Result not found.")
                        }
                        else {
                            if (userResult.status == "BLOCK") {
                                // response(res,ErrorCode.REQUEST_FAILED,[],"Your account has been blocked by admin")
                                return res.send({
                                    errorCode: 402,
                                    responseMessage: "Your account has been blocked by admin",
                                    error: []
                                })
                            }
                            else if (userResult.status == "DELETE") {
                                // response(res,ErrorCode.REQUEST_FAILED,[],"Your account has been deleted.")
                                return res.send({
                                    errorCode: 402,
                                    responseMessage: "Your account has been deleted.",
                                    error: []
                                })
                            }
                            else {
                                req.userId = userResult._id;
                                next();
                            }
                        }
                    })
                }
            })
        }
        catch (error) {
            return res.send({
                errorCode: 501,
                responseMessage: "Internal Server error",
                error: error
            })
        }
    }

}
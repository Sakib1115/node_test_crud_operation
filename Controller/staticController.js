const req = require('express/lib/request');
const staticModel=require('../Model/staticModel');

module.exports={
    staticList:async(req,res)=>{
        try {
            console.log("fmfvf")
            const result=await staticModel.find({status:"ACTIVE"})
            console.log("dfnfj")
            if (!result) {
                res.send({responseCode:404,responseMessage:"data not exist"})
            } else {
                res.send({responseCode:200,responseMessage:"all data match",result:result}) 
            }
        } catch (error) {
            console.log(error)
            res.send({responseCode:501,responseMessage:"internal server error",result:error})
        }
       
    },
    viewStatic:async(req,res)=>{
        try {
            const result=await staticModel.findOne({type:req.query.type})
            if (!result) {
                res.send({responseCode:404,responseMessage:"data not exist"})
            } else {
                res.send({responseCode:200,responseMessage:"data match successfully done",result:result})
            }
        } catch (error) {
            res.send({responseCode:501,responseMessage:"internal server error",result:error})
        }
     
    },
    editStatic:async(req,res)=>{
        try {
            const result=await staticModel.findOne({_id:req.query._id})
            if (!result) {
                res.send({responseCode:404,responseMessage:"data not exist"})
            } else {
                const saveRes=await staticModel.findByIdAndUpdate({_id:result._id},{$set:{type:req.body.type,title:req.body.title,description:req.body.description}},{new:true})
                res.send({responseCode:200,responseMessage:"Result successfully updated",result:saveRes})
            }
        } catch (error) {
            console.log(error)
            res.send({responseCode:501,responseMessage:"internal server error",result:error})
        }
      
    }
}
const mongoose=require("mongoose");

const userSchema=mongoose.Schema;
let statickey=new userSchema({
    type:{
        type:String
    },
    title:{
        type:String
    },
    description:{
        type:String
    },
    status:{
        type:String,
        enum:["ACTIVE","BLOCK","DELETE"],
        default:"ACTIVE" 
    }
},{timestamps:true});
module.exports+mongoose.model('static',statickey);
let staticModel = mongoose.model("static", statickey);
staticModel.find({status:"ACTIVE"},(err,res)=>{
  if(err){
console.log('Server Errror',err)
  }else if(res.length!=0){
console.log('static already exist.')
  }else{
    let static1 = {
      type:"t&c",
      title:"T&C",
      description:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto quibusdam blanditiis necessitatibus, quisquam veniam quas iure molestiae dicta cumque! Molestias dolor suscipit sed temporibus perferendis obcaecati doloribus ex laboriosam culpa!"
    };
    let static2 = {
        type:"t&c",
        title:"T&C",
        description:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto quibusdam blanditiis necessitatibus, quisquam veniam quas iure molestiae dicta cumque! Molestias dolor suscipit sed temporibus perferendis obcaecati doloribus ex laboriosam culpa!"
      }
    staticModel.create(static1,static2,(saveErr,saveRes)=>{
      if(saveErr){
        console.log('Server Errror',saveErr)

      }else{
        console.log('Default static created.',saveRes)
      }
    })
  }
})
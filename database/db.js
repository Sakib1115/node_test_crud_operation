const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://admin:admin@cluster0.ycfzy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",(error,result)=>{
    if (error) {
        console.log("Database is not connected");
    } else {
       console.log("Database is connected"); 
    }
})
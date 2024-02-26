const express=require('express');
const app=express();
const PORT = 3000;
const database=require('./database/db');
app.use(express.json());
app.use(express.urlencoded({extended:true}))

const userRouter=require('./Router/userRouter');
app.use("/user",userRouter);

const staticRouter=require('./Router/staticRouter');
app.use('/static',staticRouter);

app.get('/',(req,res)=>{
    console.log("hello world");
})

app.listen(PORT,(error,result)=>{
    if (error) {
        console.log("internal server error");
    } else {
        console.log('Server is Listing on Port: ',PORT);
    }
})
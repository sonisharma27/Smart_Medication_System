const express =require("express");
const app=express();
const connect=require('./connection');
const user=require('./routes/user');

app.use(express.json());

app.use(user);
connect();
app.listen(3000,(err)=>{
    if(err){
        console.log(err);

    }else{
        console.log("server is running on 3000");
    }
})
require("dotenv").config();
const express =require("express");
const app=express();
const cors = require("cors");
const connect=require('./connection');
const user=require('./routes/user');
require("./services/reminderService");
const medication=require('./routes/medication');
const reportRoutes = require("./routes/report");


app.use(cors({
  origin: "http://localhost:5173", // React app
  credentials: true
}));

app.use(express.json());
app.use("/prescription", require("./routes/prescription"));
app.use(user);
app.use(reportRoutes);
app.use(medication);
app.use("/uploads", express.static("uploads"));

connect();
app.listen(3000,(err)=>{
    if(err){
        console.log(err);

    }else{
        console.log("server is running on 3000");
    }
})
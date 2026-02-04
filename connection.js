const mongoose= require("mongoose");
async function connect(){
try{
   await mongoose.connect("mongodb://localhost:27017/collegeproject")
    console.log("Db connected");
}catch(err){
    console.log(err);
}
}
module.exports=connect;
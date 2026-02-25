const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const MedicationController = require("../controllers/MedicationController");

router.post('/medication/create',auth,(req,res)=>{
    MedicationController.createMedication(req,res);
})
router.get('/medication/get',auth,(req,res)=>{
    MedicationController.getMedications(req,res);
})
router.put('/medication/update/:id',auth,(req,res)=>{
    MedicationController.updateMedication(req,res);
})
router.delete('/medication/delete/:id',auth,(req,res)=>{
    MedicationController.deleteMedication(req,res);
})

module.exports=router;
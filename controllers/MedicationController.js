const Medication = require("../models/Medication");

async function createMedication(req,res) {
  try {
        const userId = req.user._id;

        const medication = new Medication({
            user: userId,
            medicineName: req.body.medicineName,
            dosage: req.body.dosage,
            frequency: req.body.frequency,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            notes: req.body.notes
        });

        await medication.save();

        res.status(201).json({
            success: true,
            message: "Medication created successfully",
            data: medication
            });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }

}

async function getMedications(req,res){
    try {
        const userId = req.user._id;

        const medications = await Medication.find({ user: userId });

        res.status(200).json({
            success: true,
            data: medications
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

async function updateMedication(req,res) {
    try {
        const userId = req.user._id;
        const medicationId = req.params.id;

        const updatedMedication = await Medication.findOneAndUpdate(
            { _id: medicationId, user: userId },
            req.body,
            { new: true }
        );

        if (!updatedMedication) {
            return res.status(404).json({
                success: false,
                message: "Medication not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Medication updated successfully",
            data: updatedMedication
        });

    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

async function deleteMedication(req,res){
    try {
        const userId = req.user._id;
        const medicationId = req.params.id;

        const deletedMedication = await Medication.findOneAndDelete({
            _id: medicationId,
            user: userId
        });

        if (!deletedMedication) {
            return res.status(404).json({
                success: false,
                message: "Medication not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Medication deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}
module.exports={
    createMedication,
    getMedications,
    updateMedication,
    deleteMedication
}

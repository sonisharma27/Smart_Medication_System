const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    medicineName: {
        type: String,
        required: true,
        trim: true
    },
    dosage: {
        type: String,
        required: true
    },
    frequency: {
        type: String,
        required: true
    },
    reminderTime:{
        type:[String],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    notes: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Medication", medicationSchema);

const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 1,
        max: 120
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"]
    },
    mobile: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },
    medicalCondition: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    profileImage: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);

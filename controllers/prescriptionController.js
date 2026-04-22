const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to convert local file to generative part
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

exports.scanPrescription = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image provided" });
        }

        const filePath = req.file.path;
        const mimeType = req.file.mimetype || "image/jpeg";
        
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, message: "Gemini API key is missing. Cannot process image." });
        }

        console.log("🚀 Starting AI Scan with Gemini for image:", req.file.originalname);

        const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
        let result = null;
        let responseText = "";

        const prompt = `
You are a highly accurate medical assistant extracting information from a handwritten or printed prescription image.
Analyze the image and extract the primary medication details.
Return a valid JSON object strictly matching this structure (and absolutely NO markdown formatting or backticks around it, just the raw JSON object):
{
    "extractedText": "The raw text you can read from the prescription",
    "parsedData": {
        "medicineName": "Name of the medicine",
        "dosage": "Dosage (e.g., 500mg, 10ml, etc)",
        "frequency": "once, twice, or thrice",
        "reminderTime": ["08:00"], // Default to ["08:00"] for once, ["08:00", "20:00"] for twice, ["08:00", "14:00", "20:00"] for thrice. Use times mentioned in prescription if available.
        "startDate": "YYYY-MM-DD", // Extract the start date if mentioned, otherwise leave empty string
        "endDate": "YYYY-MM-DD" // Extract the end date or duration if mentioned, otherwise leave empty string
    }
}
If you cannot read the prescription or there are no medicines, return empty strings for the values.
`;

        const imagePart = fileToGenerativePart(filePath, mimeType);

        for (const modelName of modelsToTry) {
            try {
                console.log(`Trying model: ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                result = await model.generateContent([prompt, imagePart]);
                responseText = result.response.text();
                break; // If successful, exit the loop
            } catch (err) {
                console.error(`Model ${modelName} failed:`, err.message);
                // If it's the last model in the array, throw the error to be caught by the outer catch
                if (modelName === modelsToTry[modelsToTry.length - 1]) {
                    throw new Error("All AI models are currently busy or unavailable. Please try again in a few minutes.");
                }
            }
        }
        
        // Clean up text if the model returned markdown codeblocks
        let cleanedText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
        
        const extractedJson = JSON.parse(cleanedText);
        console.log("✅ Scan Complete:", extractedJson.parsedData);

        res.json({
            success: true,
            extractedText: extractedJson.extractedText,
            parsedData: extractedJson.parsedData,
            isSimulation: false
        });

    } catch (error) {
        console.error("Scanner Error:", error.message);
        res.status(500).json({ success: false, message: "Scanning failed: " + error.message });
    } finally {
        // Clean up the uploaded file to avoid filling up disk space
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

exports.processVoiceInput = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ success: false, message: "No voice text provided" });
        }

        const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
        let result = null;
        let responseText = "";

        const prompt = `
You are a highly accurate medical assistant extracting medication information from voice input.
The user spoke the following text: "${text}"
Analyze the text and extract the primary medication details.
Return a valid JSON object strictly matching this structure (and absolutely NO markdown formatting or backticks around it, just the raw JSON object):
{
    "extractedText": "${text}",
    "parsedData": {
        "medicineName": "Name of the medicine",
        "dosage": "Dosage (e.g., 500mg, 10ml, etc)",
        "frequency": "once, twice, or thrice",
        "reminderTime": ["08:00"], // Default to ["08:00"] for once, ["08:00", "20:00"] for twice, ["08:00", "14:00", "20:00"] for thrice. Use times mentioned in text if available.
        "startDate": "YYYY-MM-DD", // Extract the start date if mentioned, otherwise leave empty string
        "endDate": "YYYY-MM-DD" // Extract the end date or duration if mentioned, otherwise leave empty string
    }
}
If you cannot find any medicines, return empty strings for the values.
`;

        for (const modelName of modelsToTry) {
            try {
                console.log(`Trying model: ${modelName} for voice...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                result = await model.generateContent(prompt);
                responseText = result.response.text();
                break;
            } catch (err) {
                console.error(`Model ${modelName} failed:`, err.message);
                if (modelName === modelsToTry[modelsToTry.length - 1]) {
                    throw new Error("All AI models are currently busy or unavailable. Please try again in a few minutes.");
                }
            }
        }
        
        let cleanedText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
        const extractedJson = JSON.parse(cleanedText);
        console.log("✅ Voice Processing Complete:", extractedJson.parsedData);

        res.json({
            success: true,
            extractedText: extractedJson.extractedText,
            parsedData: extractedJson.parsedData
        });

    } catch (error) {
        console.error("Voice Processing Error:", error.message);
        res.status(500).json({ success: false, message: "Processing failed: " + error.message });
    }
};
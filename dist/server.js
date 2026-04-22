import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateVoice } from "./voice-gen.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.post("/voice", async (req, res) => {
    try {
        const { text, voice, emotion, speed, pitch } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Text required" });
        }
        const audioBuffer = await generateVoice({
            text,
            voice,
            emotion,
            speed,
            pitch,
        });
        const base64 = audioBuffer.toString("base64");
        return res.json({
            success: true,
            audio: base64,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            error: err.message,
        });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🎙️ Voice API running on port ${PORT}`);
});

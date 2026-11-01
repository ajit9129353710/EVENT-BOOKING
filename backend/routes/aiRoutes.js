const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Please enter a message",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `You are a helpful AI assistant for an Event Booking Platform.
Answer questions about event booking, tickets, cancellations, and event planning.
Keep your answers simple and helpful.

User: ${message}`,
    });

    res.json({
      reply: response.text,
    });
  } catch (error) {
    console.error("AI Chat Error:", error.message);

    res.status(500).json({
      message: "AI is temporarily unavailable. Please try again.",
    });
  }
});

module.exports = router;
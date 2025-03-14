import express from "express";
const app = express();
const port = 3000;
const OLLAMA_URL = "http://localhost:11434";

app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message, model = "-" } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Wiadomosc jest"});
    }
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt: message,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ollama blad odpowiedzi: ", errorText);
      throw new Error(`Ollama blad: ${response.status} - ${errorText}`);
    }
  } catch (error) {}
});

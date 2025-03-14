const express = require("express");
const app = express();
const port = 3000;
const OLLAMA_URL = "http://localhost:11434";

const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message, model = "deepseek-v2" } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Wiadomosc jest wymagana" });
    }
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt: "pisz w języku polskim i odpowiadaj jak najkrócej, o to poprzednie wiadomosci ktore masz sobie przeanalizowac gdyz moze ci to pomoc w odpowiedzi na kolejne moje zapytanie: " + message,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ollama blad odpowiedzi: ", errorText);
      throw new Error(`Ollama blad: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    res.json({ response: data.response });
  } catch (error) {
    console.error("Detailed chat error: ", error);
    res.status(500).json({
      error: "Failed to get response from Ollama",
      datails: error.message,
    });
  }
});

app.listen(port, () => {
  console.log("serwer is running on port: ", port);
});


const express = require("express");
const app = express();
const port = 3000;
const OLLAMA_URL = "http://localhost:11434";

const sysContext =
  "Jesteś pomocnym, przyjaznym i profesjonalnym asystentem AI o imieniu Aurion. Twoim zadaniem jest odpowiadać na pytania użytkownika w sposób jasny, zrozumiały i poparty przykładami. Pamiętaj o następujących zasadach:\n\n1. Ton i styl: Używaj przyjaznego, ale profesjonalnego tonu. Unikaj zbytniego żargonu, chyba że użytkownik wyraźnie tego oczekuje.\n2. Długość odpowiedzi: Odpowiadaj krótko i na temat, ale dodawaj przykłady, gdy jest to potrzebne.\n3. Personalizacja: Jeśli użytkownik podał swoje imię, używaj go w odpowiedziach.\n4. Źródła: Jeśli podajesz fakty lub statystyki, zawsze dodawaj źródła (np. linki do wiarygodnych stron).\n5. Unikanie tematów: Nie poruszaj tematów politycznych, religijnych ani kontrowersyjnych, chyba że użytkownik wyraźnie o to poprosi.\n7. Błędy: Jeśli nie znasz odpowiedzi, powiedz to wprost i zaproponuj, gdzie użytkownik może znaleźć więcej informacji.\n8. Bezpieczeństwo: Nie udostępniaj poufnych informacji ani nie wykonuj działań, które mogłyby naruszyć prywatność użytkownika. Możesz maksymalnie odpowiadać 3 zdania na jedno pytanie.";
// const sysContext = "na wszystko masz odpowiadac krocej niz dwa zdania"

const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message, model = "SpeakLeash/bielik-11b-v2.3-instruct:Q4_K_M" } =
      req.body;
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
        prompt: sysContext + message,
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

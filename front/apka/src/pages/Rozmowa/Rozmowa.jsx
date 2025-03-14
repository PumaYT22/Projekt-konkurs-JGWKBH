import React, { useState } from "react";

const Rozmowa = () => {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    alert("Wysyłam wiadomość: " + message);
    try {
      const response = await fetch("http://172.16.4.182:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      alert (response.ok);

      if (!response.ok) {
        throw new Error("Błąd podczas wysyłania wiadomości");
      }

      const data = await response.json();
      console.log("Odpowiedź serwera:", data);
    } catch (error) {
      console.error("Wystąpił błąd:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Wpisz wiadomość"
      />
      <button onClick={sendMessage}>Wyślij</button>
    </div>
  );
};

export default Rozmowa;

import React, { useState } from "react";
import styles from './style.module.scss';

const Chatbot = () => {
  const [userMessage, setUserMessage] = useState(""); // Berichten van de gebruiker
  const [chatHistory, setChatHistory] = useState([]); // Gesprekshistorie, voor alle berichten
  const [isLoading, setIsLoading] = useState(false); // Laadstatus voor het wachten op een antwoord

  // Functie om berichten te verzenden naar de Strapi backend
  const handleSendMessage = async () => {
    if (userMessage.trim() === "") return; // Zorg ervoor dat de gebruiker een bericht invoert

    // Voeg het bericht van de gebruiker toe aan de gespreksgeschiedenis
    setChatHistory([...chatHistory, { text: userMessage, isUser: true }]);

    // Stel de laadstatus in
    setIsLoading(true);

    try {
      // Stuur het bericht naar je Strapi backend
      const response = await fetch("http://localhost:1337/api/openai/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question: userMessage }),
        });

      const data = await response.json();

      if (data.answer) {
        // Voeg het antwoord van de AI toe aan de gespreksgeschiedenis
        setChatHistory([
          ...chatHistory,
          { text: userMessage, isUser: true },
          { text: data.answer, isUser: false },
        ]);
      } else {
        console.error("Geen antwoord ontvangen van de server.");
      }
    } catch (error) {
      console.error("Fout tijdens de API-aanroep:", error);
      setChatHistory([
        ...chatHistory,
        { text: "Er is een fout opgetreden bij het ophalen van het antwoord.", isUser: false },
      ]);
    } finally {
      // Zet de laadstatus uit
      setIsLoading(false);
    }

    // Reset het invoerveld
    setUserMessage("");
  };

  return (
    <div className={styles.chatbotcontainer}>
      <div className={styles.chathistory}>
        {/* Toon alle berichten in de chat */}
        {chatHistory.map((message, index) => (
          <div key={index} className={message.isUser ? "user-message" : "ai-message"}>
            {message.text}
          </div>
        ))}
      </div>

      {/* Invoerveld voor de gebruiker */}
      <div className={styles.inputcontainer}>
        <input className={styles.input}
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type je vraag..."
        />
        <button className={styles.button} onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? "Laden..." : "Verzenden"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;

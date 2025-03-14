import React, { useState, useEffect, useRef } from 'react';

const AurionAI = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState('10s');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateResponse = (userPrompt) => {
    if (!userPrompt.trim()) return;

    // Dodajemy wiadomość użytkownika
    setMessages(prev => [...prev, {
      id: Date.now(),
      content: userPrompt,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    }]);

    setIsGenerating(true);
    setAnimationSpeed('2s');

    // Symulacja odpowiedzi AI
    setTimeout(() => {
      const responses = [
        "Dziękuję za pytanie. Według moich danych, odpowiedź brzmi...",
        "Interesujące pytanie. Analizując dostępne informacje mogę powiedzieć, że...",
        "Rozumiem twoje pytanie. Oto co udało mi się znaleźć na ten temat...",
        "To ważne zagadnienie. Na podstawie moich algorytmów, mogę stwierdzić, że..."
      ];
      
      const newMessage = {
        id: Date.now() + 1,
        content: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, newMessage]);
      setIsGenerating(false);
      setAnimationSpeed('10s');
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isGenerating && prompt.trim()) {
      generateResponse(prompt);
      setPrompt('');
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center relative overflow-hidden">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
          
          .horizon-outlined {
            font-family: 'Orbitron', sans-serif;
            letter-spacing: 5px;
            text-transform: uppercase;
            -webkit-text-stroke: 1px rgba(100, 50, 255, 0.8);
            color: transparent;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
        `}
      </style>

      {/* Animated Waves Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg viewBox="0 0 1200 300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(130, 30, 255, 0.8)">
                <animate 
                  attributeName="stop-color" 
                  values="rgba(130, 30, 255, 0.8);rgba(50, 220, 140, 0.8);rgba(130, 30, 255, 0.8)"
                  dur="4s"
                  repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="rgba(50, 220, 140, 0.8)">
                <animate 
                  attributeName="stop-color" 
                  values="rgba(50, 220, 140, 0.8);rgba(130, 30, 255, 0.8);rgba(50, 220, 140, 0.8)"
                  dur="4s"
                  repeatCount="indefinite" />
              </stop>
            </linearGradient>

            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(160, 60, 255, 0.7)">
                <animate 
                  attributeName="stop-color" 
                  values="rgba(160, 60, 255, 0.7);rgba(40, 200, 120, 0.7);rgba(160, 60, 255, 0.7)"
                  dur="4.5s"
                  repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="rgba(40, 200, 120, 0.7)">
                <animate 
                  attributeName="stop-color" 
                  values="rgba(40, 200, 120, 0.7);rgba(160, 60, 255, 0.7);rgba(40, 200, 120, 0.7)"
                  dur="4.5s"
                  repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>

          {/* Wave 1 */}
          <path 
            d="M0,150 C150,60 350,240 600,150 C850,60 1050,240 1200,150" 
            fill="none" 
            stroke="url(#waveGradient1)" 
            strokeWidth="6"
            strokeLinecap="round">
            <animate 
              attributeName="d" 
              dur={animationSpeed}
              repeatCount="indefinite"
              values="M0,150 C150,60 350,240 600,150 C850,60 1050,240 1200,150;
                      M0,150 C150,240 350,60 600,150 C850,240 1050,60 1200,150;
                      M0,150 C150,60 350,240 600,150 C850,60 1050,240 1200,150"
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
            />
          </path>

          {/* Wave 2 */}
          <path 
            d="M0,150 C200,90 400,210 600,150 C800,90 1000,210 1200,150" 
            fill="none" 
            stroke="url(#waveGradient2)" 
            strokeWidth="5"
            strokeLinecap="round">
            <animate 
              attributeName="d" 
              dur={animationSpeed}
              begin="0.2s"
              repeatCount="indefinite"
              values="M0,150 C200,90 400,210 600,150 C800,90 1000,210 1200,150;
                      M0,150 C200,210 400,90 600,150 C800,210 1000,90 1200,150;
                      M0,150 C200,90 400,210 600,150 C800,90 1000,210 1200,150"
              calcMode="spline"
              keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
            />
          </path>
        </svg>
      </div>

      {/* Chat Interface */}
      <div className="w-full max-w-2xl z-10 flex flex-col h-screen">
        {/* Header */}
        <h1 className="text-4xl md:text-6xl font-bold horizon-outlined text-center mt-8 mb-12">
          AURIONAI
        </h1>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg fade-in ${
                  message.isUser 
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
                style={{
                  borderRadius: message.isUser 
                    ? '20px 20px 0 20px' 
                    : '20px 20px 20px 0',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.isUser ? 'text-purple-200' : 'text-gray-500'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form 
          onSubmit={handleSubmit}
          className="p-4 bg-white border-t border-gray-200"
        >
          <div className="flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Napisz wiadomość..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              disabled={isGenerating}
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{boxShadow: '0 4px 12px rgba(102, 51, 204, 0.2)'}}
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AurionAI;
import React, { useState, useEffect, useRef } from "react";
import "./Rozmowa.css"; 
import Wave from './Wave.jsx';
import Wave_gen from './Wave_gen.jsx';


const Rozmowa = () => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // halat
  const [darkMode, setDarkMode] = useState(true);
  const [showTabMenu, setShowTabMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const tabNameInputRef = useRef(null);
  const [newTabName, setNewTabName] = useState("");

  // Inicjalizacja z localStorage
  useEffect(() => {
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem("chatDarkMode");
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
    }

    // Load saved chats
    const savedChats = localStorage.getItem("savedChats");
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    } else {
      // Initialize with one empty chat
      setChats([{ name: "Nowa rozmowa", messages: [] }]);
    }

    // Load active chat index
    const savedActiveChat = localStorage.getItem("activeChat");
    if (savedActiveChat) {
      setActiveChat(JSON.parse(savedActiveChat));
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("chatDarkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("savedChats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem("activeChat", JSON.stringify(activeChat));
  }, [activeChat]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [chats, isWaiting, activeChat]);

  // Focus input on load and chat change
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const createNewChat = () => {
    setChats([...chats, { name: "Nowa rozmowa", messages: [] }]);
    setActiveChat(chats.length);
  };

  const deleteChat = (index) => {
    if (chats.length === 1) {
      // If it's the last chat, just clear it
      setChats([{ name: "Nowa rozmowa", messages: [] }]);
      setActiveChat(0);
    } else {
      // Remove the chat
      const newChats = chats.filter((_, i) => i !== index);
      setChats(newChats);

      // Adjust active chat if needed
      if (activeChat === index) {
        setActiveChat(index === 0 ? 0 : index - 1);
      } else if (activeChat > index) {
        setActiveChat(activeChat - 1);
      }
    }
  };

  const renameChat = () => {
    if (newTabName.trim()) {
      const updatedChats = [...chats];
      updatedChats[activeChat].name = newTabName.trim();
      setChats(updatedChats);
      setNewTabName("");
      setShowTabMenu(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to current chat
    const updatedChats = [...chats];
    updatedChats[activeChat].messages.push({
      sender: "user",
      text: message,
      timestamp: new Date().toISOString(),
    });
    setChats(updatedChats);

    setIsWaiting(true);
    const sentMessage = message;
    setMessage("");

    const messageHistory = updatedChats[activeChat].messages
      .map((msg) => msg.text)
      .join("\n");

    try {
      // Simulate typing effect
      setIsTyping(true); // halat 

      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageHistory+sentMessage }),
      });

      if (!response.ok) {
        throw new Error("Błąd podczas wysyłania wiadomości");
      }

      const data = await response.json();

      // After small delay to show typing indicator
      setTimeout(() => {
        setIsTyping(false);
        const updatedChatsWithResponse = [...chats];
        updatedChatsWithResponse[activeChat].messages.push({
          sender: "bot",
          text: data.response,
          timestamp: new Date().toISOString(),
        });
        setChats(updatedChatsWithResponse);
      }, 700);
    } catch (error) {
      console.error("Wystąpił błąd:", error);
      setTimeout(() => {
        setIsTyping(false);
        const updatedChatsWithError = [...chats];
        updatedChatsWithError[activeChat].messages.push({
          sender: "bot",
          text: "Wystąpił błąd podczas komunikacji z serwerem.",
          timestamp: new Date().toISOString(),
        });
        setChats(updatedChatsWithError);
      }, 700);
    } finally {
      setTimeout(() => {
        setIsWaiting(false);
      }, 700);
    }
  };

  // Format message with basic markdown
  const formatMessage = (text) => {
    // Bold text
    let formattedText = text.replace(
      /\*\*(.*?)\*\*/g,
      '<span class="font-bold">$1</span>'
    );
    // Italic text
    formattedText = formattedText.replace(
      /\*(.*?)\*/g,
      '<span class="italic">$1</span>'
    );
    // Code blocks
    formattedText = formattedText.replace(
      /`(.*?)`/g,
      '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
    );
    // Line breaks
    formattedText = formattedText.replace(/\n/g, "<br />");

    return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  const getRandomAvatarUrl = (sender, seed) => {
    if (sender === "user") {
      return `https://api.dicebear.com/7.x/micah/svg?seed=${seed || "user"}`;
    } else {
      return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed || "bot"}`;
    }
  };

  const formatTimeFromISO = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={`flex flex-col h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800"
      }`}
    >
      <div
        className={`flex items-center justify-between p-3 border-b ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } shadow-md`}
      >
        <div className="flex items-center space-x-3">
          <h1
            className={`text-xl font-bold ${
              darkMode ? "text-indigo-400" : "text-indigo-600"
            }`}
          >
            AurionAI
          </h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-colors duration-200 ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-yellow-300"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        className={`flex overflow-x-auto whitespace-nowrap p-2 border-b ${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-gray-100 border-gray-200"
        }`}
      >
        {chats.map((chat, index) => (
          <div
            key={index}
            className={`relative inline-flex items-center px-3 py-2 mr-2 rounded-t-lg cursor-pointer transition-all ${
              activeChat === index
                ? darkMode
                  ? "bg-gray-700 text-white"
                  : "bg-white text-gray-800"
                : darkMode
                ? "bg-gray-900 text-gray-400"
                : "bg-gray-200 text-gray-600"
            } hover:${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            } group animate-fadeIn`}
            onClick={() => setActiveChat(index)}
          >
            <span className="max-w-xs truncate">{chat.name}</span>
            {chats.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(index);
                }}
                className={`ml-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                  darkMode ? "hover:bg-gray-600" : "hover:bg-gray-300"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
        <button
          onClick={createNewChat}
          className={`inline-flex items-center px-3 py-2 rounded-t-lg transition-colors ${
            darkMode
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          } animate-fadeIn`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      <div style={{backgroundColor:"#101828"}}>
        <div className="siri">
          {isTyping ? <Wave_gen /> : <Wave />}
        </div>
      </div>

      <div className="relative flex-grow">
        {/* Tab options menu */}
        {showTabMenu && (
          <div
            className={`absolute top-2 right-2 z-10 p-3 rounded-lg shadow-lg ${
              darkMode ? "bg-gray-700" : "bg-white"
            } animate-fadeIn`}
          >
            <div className="mb-3">
              <label className="block text-sm mb-1">Zmień nazwę zakładki</label>
              <div className="flex">
                <input
                  ref={tabNameInputRef}
                  type="text"
                  value={newTabName}
                  onChange={(e) => setNewTabName(e.target.value)}
                  placeholder={chats[activeChat].name}
                  className={`flex-grow px-2 py-1 text-sm rounded-l-md ${
                    darkMode
                      ? "bg-gray-800 text-white border-gray-600"
                      : "bg-gray-50 border-gray-300"
                  } border focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                />
                <button
                  onClick={renameChat}
                  className="px-2 py-1 bg-indigo-500 text-white rounded-r-md hover:bg-indigo-600"
                >
                  OK
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowTabMenu(false)}
              className={`w-full text-center py-1 px-2 rounded ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-900"
                  : "bg-gray-100 hover:bg-gray-200"
              } text-sm`}
            >
              Zamknij
            </button>
          </div>
        )}

        {/* Messages area */}
        <div
          className={`h-full overflow-y-auto px-4 py-3 ${
            darkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
          <div className="flex justify-between mb-2">
            <h2
              className={`font-medium ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {chats[activeChat]?.name}
            </h2>
            <button
              onClick={() => {
                setNewTabName(chats[activeChat]?.name || "");
                setShowTabMenu(!showTabMenu);
                setTimeout(() => tabNameInputRef.current?.focus(), 100);
              }}
              className={`p-1 rounded ${
                darkMode
                  ? "hover:bg-gray-800 text-gray-400"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
            </button>
          </div>

          {chats[activeChat]?.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-4/5 text-center space-y-6 animate-fadeIn">
              <div
                className={`w-24 h-24 rounded-full ${
                  darkMode ? "bg-gray-800" : "bg-indigo-50"
                } flex items-center justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-12 w-12 ${
                    darkMode ? "text-gray-600" : "text-indigo-300"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div>
                <h3
                  className={`text-xl font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Rozpocznij nową rozmowę
                </h3>
                <p
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  } max-w-sm`}
                >
                  Zadaj pytanie lub rozpocznij dyskusję z botem. Twoja rozmowa
                  zostanie automatycznie zapisana.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pb-2">
              {chats[activeChat]?.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-2 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  } animate-messageIn`}
                >
                  {msg.sender !== "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-300 dark:border-indigo-700 shadow-md">
                      <img
                        src={getRandomAvatarUrl("bot", "ai-assistant")}
                        alt="Bot Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div
                    className={`relative max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 shadow-sm ${
                      msg.sender === "user"
                        ? "bg-indigo-500 text-white rounded-br-none transform hover:-translate-y-1 hover:shadow-md transition-all duration-200"
                        : `${darkMode ? "bg-gray-800" : "bg-gray-100"} ${
                            darkMode ? "text-white" : "text-gray-800"
                          } rounded-bl-none transform hover:-translate-y-1 hover:shadow-md transition-all duration-200`
                    }`}
                  >
                    <div className="message-text">
                      {formatMessage(msg.text)}
                    </div>
                    <div
                      className={`text-xs text-right mt-1 ${
                        msg.sender === "user"
                          ? "text-indigo-200"
                          : "text-gray-400"
                      }`}
                    >
                      {msg.timestamp ? formatTimeFromISO(msg.timestamp) : ""}
                    </div>

                    {/* Message status indicator */}
                    {msg.sender === "user" &&
                      index === chats[activeChat].messages.length - 1 &&
                      isWaiting && (
                        <div className="absolute -bottom-6 right-0 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Wysłano
                        </div>
                      )}
                  </div>

                  {msg.sender === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-300 dark:border-indigo-700 shadow-md">
                      <img
                        src={getRandomAvatarUrl("user", "user1")}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start space-x-2 animate-fadeIn">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-300 dark:border-indigo-700 shadow-md">
                    <img
                      src={getRandomAvatarUrl("bot", "ai-assistant")}
                      alt="Bot Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className={`relative max-w-xs rounded-lg px-4 py-3 shadow-sm ${
                      darkMode ? "bg-gray-800" : "bg-gray-100"
                    } rounded-bl-none`}
                  >
                    <div className="flex space-x-1">
                      <div className="typing-dot bg-gray-400"></div>
                      <div className="typing-dot bg-gray-400 animation-delay-200"></div>
                      <div className="typing-dot bg-gray-400 animation-delay-400"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div
          className={`p-3 border-t ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="relative flex items-center">
            <div
              className={`absolute left-3 text-gray-400 ${
                message.trim() ? "opacity-0" : "opacity-100"
              } transition-opacity duration-200`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <textarea
              ref={inputRef}
              className={`w-full resize-none focus:outline-none px-10 py-2 rounded-full border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-1 focus:ring-indigo-500"
                  : "bg-gray-100 border-gray-200 text-gray-900 focus:ring-1 focus:ring-indigo-500"
              } placeholder-gray-400 max-h-20`}
              rows="1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Wpisz wiadomość..."
              disabled={isWaiting}
              style={{ paddingRight: "3rem" }}
            />
            <button
              onClick={sendMessage}
              disabled={isWaiting || !message.trim()}
              className={`absolute right-3 p-2 rounded-full transition-all duration-300 ${
                message.trim() && !isWaiting
                  ? "bg-indigo-500 hover:bg-indigo-600 text-white shadow-md transform hover:scale-110"
                  : `${
                      darkMode ? "bg-gray-600" : "bg-gray-200"
                    } text-gray-400 cursor-not-allowed`
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transform rotate-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
        </div>
      </div>
    </div>
  );
};

export default Rozmowa;
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const ChatAssistant = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! How can I help you today?",
    },
  ]);
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);
    try {
      const response = await fetch(props.chatEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply || "Sorry, I couldn't respond.",
        },
      ]);
    } catch (err) {
      setLoading(false);
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Unable to connect to assistant.",
        },
      ]);
    }
  };
  const [input, setInput] = useState("");
  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "25px",
          right: "25px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          zIndex: 9999,
          fontSize: "24px",
          color: "white",
          background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        }}
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "95px",
            right: "25px",
            width: "340px",
            height: "500px",
            background: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            zIndex: 9999,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "15px",
              color: "white",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
            }}
          >
            🤖 BookMyTrip Assistant
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "15px",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "10px",
                    borderRadius: "12px",
                    background: msg.sender === "user" ? "#3a7bd5" : "#f0f0f0",
                    color: msg.sender === "user" ? "white" : "black",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "10px",
                    borderRadius: "12px",
                    background: "#f0f0f0",
                    color: "black",
                  }}
                >
                  🤖 Typing...
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              padding: "10px",
              borderTop: "1px solid #ddd",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #ccc",
              }}
            />

            <button
              onClick={handleSend}
              style={{
                marginLeft: "10px",
                border: "none",
                borderRadius: "10px",
                color: "white",
                padding: "0 15px",
                background: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;

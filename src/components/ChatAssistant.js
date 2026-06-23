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
          width: "72px",
          height: "72px",
          fontSize: "30px",
          background: "linear-gradient(135deg,#3a7bd5,#00d2ff)",
          boxShadow: "0 12px 30px rgba(59,130,246,.45)",
          transition: "all .3s ease",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          zIndex: 9999,
          color: "white",
        }}
      >
        🤖
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "25px",
            width: "380px",
            height: "600px",

            background: props.darkMode
              ? "rgba(15,23,42,0.88)"
              : "rgba(255,255,255,0.78)",

            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",

            border: props.darkMode
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(255,255,255,0.35)",

            borderRadius: "24px",

            boxShadow: "0 25px 60px rgba(0,0,0,.25)",

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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,.15)",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}
              >
                🤖
              </div>

              <div>
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "1rem",
                  }}
                >
                  TripAI
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    opacity: 0.85,
                  }}
                >
                  Travel Assistant
                </div>
              </div>
            </div>
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
                    background:
                      msg.sender === "user"
                        ? "linear-gradient(135deg,#3a7bd5,#00d2ff)"
                        : props.darkMode
                          ? "rgba(255,255,255,.08)"
                          : "rgba(255,255,255,.95)",
                    color:
                      msg.sender === "user"
                        ? "#fff"
                        : props.darkMode
                          ? "#fff"
                          : "#111827",
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

                padding: "12px 16px",

                borderRadius: "14px",

                border: props.darkMode
                  ? "1px solid rgba(255,255,255,.08)"
                  : "1px solid rgba(0,0,0,.08)",

                background: props.darkMode ? "rgba(255,255,255,.08)" : "#fff",

                color: props.darkMode ? "#fff" : "#111827",

                outline: "none",
              }}
            />

            <button
              onClick={handleSend}
              style={{
                marginLeft: "10px",

                width: "48px",
                height: "48px",

                border: "none",

                borderRadius: "50%",

                color: "white",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                background: "linear-gradient(135deg,#3a7bd5,#00d2ff)",

                boxShadow: "0 8px 20px rgba(59,130,246,.35)",
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
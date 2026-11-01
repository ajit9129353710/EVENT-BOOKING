import { useState, useEffect, useRef } from "react";
import {
MessageCircle,
X,
Send,
Bot,
LoaderCircle,
Sparkles,
} from "lucide-react";
import api from "../services/api";
import "./AIChatbot.css";

export default function AIChatbot() {
const [isOpen, setIsOpen] = useState(false);
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);

const [messages, setMessages] = useState([
{
role: "assistant",
text: "Hi! 👋 Welcome to Event AI Assistant. Ask me anything about events, bookings, tickets, or event planning!",
},
]);

const messagesEndRef = useRef(null);

useEffect(() => {
messagesEndRef.current?.scrollIntoView({
behavior: "smooth",
});
}, [messages, loading]);

const sendMessage = async (e) => {
e.preventDefault();

const message = input.trim();

if (!message || loading) return;

setMessages((prev) => [
  ...prev,
  { role: "user", text: message },
]);

setInput("");
setLoading(true);

try {
  const response = await api.post("/ai/chat", { message });

  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      text:
        response.data.reply ||
        "Sorry, I couldn't generate a response.",
    },
  ]);
} catch (error) {
  console.error("AI Chatbot Error:", error);

  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      text:
        error.response?.data?.message ||
        "AI is temporarily unavailable. Please try again.",
    },
  ]);
} finally {
  setLoading(false);
}

};

return (
<div className="ai-chatbot-container">
{!isOpen && (
<button
type="button"
className="ai-chatbot-toggle"
onClick={() => setIsOpen(true)}
aria-label="Open AI Chatbot"
>
<MessageCircle size={27} />
<span className="ai-chatbot-pulse"></span>
</button>
)}

  {isOpen && (
    <section className="ai-chatbot-window">
      <header className="ai-chatbot-header">
        <div className="ai-chatbot-header-info">
          <div className="ai-chatbot-avatar">
            <Bot size={25} />
          </div>

          <div>
            <h3>Event AI Assistant</h3>
            <p>
              <span className="ai-chatbot-online-dot"></span>
              Online · Ready to help
            </p>
          </div>
        </div>

        <button
          type="button"
          className="ai-chatbot-close"
          onClick={() => setIsOpen(false)}
          aria-label="Close AI Chatbot"
        >
          <X size={22} />
        </button>
      </header>

      <div className="ai-chatbot-welcome">
        <div className="ai-chatbot-welcome-icon">
          <Sparkles size={17} />
        </div>

        <div>
          <strong>Your Event Assistant</strong>
          <p>How can I help you today?</p>
        </div>
      </div>

      <div className="ai-chatbot-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`ai-chatbot-message-row ${
              msg.role === "user" ? "user-row" : "assistant-row"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="ai-chatbot-message-avatar">
                <Bot size={17} />
              </div>
            )}

            <div
              className={`ai-chatbot-message ${
                msg.role === "user"
                  ? "user-message"
                  : "assistant-message"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="ai-chatbot-message-row assistant-row">
            <div className="ai-chatbot-message-avatar">
              <Bot size={17} />
            </div>

            <div className="ai-chatbot-message assistant-message ai-chatbot-loading">
              <LoaderCircle size={17} className="ai-chatbot-spinner" />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        className="ai-chatbot-form"
        onSubmit={sendMessage}
      >
        <input
          type="text"
          className="ai-chatbot-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about events..."
          disabled={loading}
          aria-label="Type your message"
        />

        <button
          type="submit"
          className="ai-chatbot-send"
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          {loading ? (
            <LoaderCircle size={19} className="ai-chatbot-spinner" />
          ) : (
            <Send size={19} />
          )}
        </button>
      </form>

      <div className="ai-chatbot-footer">
        Powered by Gemini AI
      </div>
    </section>
  )}
</div>

);
}
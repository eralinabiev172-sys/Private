import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: "Привет! Я твой искусственный интеллект. Задай мне вопрос.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage() {
    const messageText = input.trim();

    if (!messageText || isLoading) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: messageText,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка сервера");
      }

      const aiMessage = {
        id: Date.now() + 1,
        role: "ai",
        text: data.answer,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        aiMessage,
      ]);
    } catch (error) {
      console.error(error);

      const errorMessage = {
        id: Date.now() + 1,
        role: "ai",
        text: "Не удалось получить ответ. Проверь, запущен ли backend.",
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        errorMessage,
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  }

  return (
    <main className="app">
      <section className="chat">
        <header className="chat-header">
          <div className="ai-avatar">AI</div>

          <div>
            <h1>Мой искусственный интеллект</h1>
            <p>{isLoading ? "Печатает..." : "Онлайн"}</p>
          </div>
        </header>

        <div className="messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-row ${message.role}`}
            >
              <div className={`message ${message.role}`}>
                {message.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message-row ai">
              <div className="message ai loading-message">
                ИИ думает...
              </div>
            </div>
          )}
        </div>

        <div className="input-container">
          <input
            type="text"
            placeholder="Напишите сообщение..."
            value={input}
            disabled={isLoading}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            type="button"
            disabled={isLoading || !input.trim()}
            onClick={sendMessage}
          >
            {isLoading ? "Ждите..." : "Отправить"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
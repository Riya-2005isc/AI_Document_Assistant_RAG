"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documentId, setDocumentId] = useState("");

  async function uploadDocument() {
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const response = await fetch("/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    question,
    documentId,
  }),
});

const text = await response.text();

let data;

try {
  data = JSON.parse(text);
} catch {
  throw new Error(
    text || `Server returned ${response.status} with no JSON response.`
  );
}

if (!response.ok) {
  throw new Error(data.error || "Something went wrong.");
}

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setDocumentId(data.documentId);

      setMessages([
        {
          role: "assistant",
          content:
            "Your PDF has been processed successfully. Ask me anything about the document."
        }
      ]);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function askQuestion() {
    if (!question.trim() || !documentId || loading) return;

    const userQuestion = question.trim();

    setQuestion("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userQuestion
      }
    ]);

    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: userQuestion,
          documentId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources || []
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Unable to process your question."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="app">
        <aside className="sidebar">
          <div className="logo">
            <div className="logoIcon">✦</div>
            <div>
              <h2>DocuAI</h2>
              <span>RAG Assistant</span>
            </div>
          </div>

          <div className="uploadBox">
            <div className="uploadIcon">📄</div>

            <h3>Upload Document</h3>

            <p>Upload a PDF and ask questions about its content.</p>

            <input
              id="pdf"
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <label htmlFor="pdf" className="chooseButton">
              {file ? file.name : "Choose PDF"}
            </label>

            <button
              className="uploadButton"
              onClick={uploadDocument}
              disabled={!file || uploading}
            >
              {uploading ? "Processing..." : "Process Document"}
            </button>
          </div>

          <div className="info">
            <h4>How it works</h4>
            <p>1. Upload your PDF</p>
            <p>2. Document text is processed</p>
            <p>3. Ask your question</p>
            <p>4. AI generates an answer</p>
          </div>
        </aside>

        <section className="chat">
          <header className="header">
            <div>
              <h1>AI Document Assistant</h1>
              <p>Ask questions about your documents</p>
            </div>

            <div className="status">
              <span></span>
              AI Online
            </div>
          </header>

          <div className="messages">
            {messages.length === 0 && (
              <div className="welcome">
                <div className="welcomeIcon">✦</div>
                <h2>How can I help you?</h2>
                <p>
                  Upload a PDF document and ask questions about its content.
                </p>

                <div className="examples">
                  <button
                    onClick={() =>
                      setQuestion("What is the main objective of this document?")
                    }
                  >
                    What is the main objective?
                  </button>

                  <button
                    onClick={() =>
                      setQuestion("Summarize the key points of this document.")
                    }
                  >
                    Summarize the document
                  </button>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.role === "user" ? "user" : "assistant"
                }`}
              >
                <div className="avatar">
                  {message.role === "user" ? "You" : "✦"}
                </div>

                <div className="bubble">
                  <p>{message.content}</p>

                  {message.sources && message.sources.length > 0 && (
                    <div className="sources">
                      <strong>Sources:</strong>
                      {message.sources.map((source, i) => (
                        <span key={i}>{source}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message assistant">
                <div className="avatar">✦</div>
                <div className="bubble typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          <div className="inputArea">
            <div className="inputBox">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    askQuestion();
                  }
                }}
                placeholder={
                  documentId
                    ? "Ask something about your document..."
                    : "Upload a PDF first..."
                }
                disabled={!documentId || loading}
              />

              <button
                onClick={askQuestion}
                disabled={!documentId || !question.trim() || loading}
              >
                ↑
              </button>
            </div>

            <small>
              AI responses are generated from your uploaded document.
            </small>
          </div>
        </section>
      </section>
    </main>
  );
}

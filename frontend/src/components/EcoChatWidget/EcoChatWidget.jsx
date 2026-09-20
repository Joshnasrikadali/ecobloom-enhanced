import React, { useState } from "react";
import { Bot, Send, X, MessageCircle } from "lucide-react";
import "./EcoChatWidget.css";

const starterQuestions = ["How can I lower my travel footprint?", "How can I use less electricity?"];

export default function EcoChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", text: "Hi! I’m EcoGuide. Ask me about everyday choices, and I’ll suggest one practical next step." }]);

  const send = async (value = message) => {
    const question = value.trim();
    if (!question || loading) return;
    setMessages((items) => [...items, { role: "user", text: question }]);
    setMessage(""); setLoading(true);
    try {
      const response = await fetch("/api/assistant/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: question }) });
      const data = await response.json();
      setMessages((items) => [...items, { role: "assistant", text: data.reply || "I could not answer that just now. Please try again." }]);
    } catch {
      setMessages((items) => [...items, { role: "assistant", text: "EcoGuide is offline. Start with one small, repeatable change this week." }]);
    } finally { setLoading(false); }
  };

  return <div className="ecoguide-shell">
    {open && <section className="ecoguide-panel" aria-label="EcoGuide chat">
      <header><span><Bot size={19} /> EcoGuide</span><button onClick={() => setOpen(false)} aria-label="Close chat"><X size={18}/></button></header>
      <div className="ecoguide-messages">{messages.map((item, index) => <p key={index} className={item.role}>{item.text}</p>)}{loading && <p className="assistant">Thinking…</p>}</div>
      <div className="ecoguide-starters">{starterQuestions.map((question) => <button key={question} onClick={() => send(question)}>{question}</button>)}</div>
      <form onSubmit={(event) => { event.preventDefault(); send(); }}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask EcoGuide…"/><button aria-label="Send"><Send size={17}/></button></form>
    </section>}
    <button className="ecoguide-fab" onClick={() => setOpen(!open)} aria-label="Open EcoGuide"><MessageCircle size={23}/><span>Ask EcoGuide</span></button>
  </div>;
}

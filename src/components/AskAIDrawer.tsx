import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Sparkles, AlertCircle, HelpCircle } from "lucide-react";
import { NewsStory } from "../types";

interface Message {
  sender: "user" | "ai";
  text: string;
  isSimulated?: boolean;
}

interface AskAIDrawerProps {
  story: NewsStory | null;
  onClose: () => void;
}

export default function AskAIDrawer({ story, onClose }: AskAIDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulatedResponse, setIsSimulatedResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionPrompts = [
    "Explain this simply.",
    "Why is this important?",
    "Give me the background.",
    "Summarize this in 3 points.",
    "Explain the technical terms."
  ];

  useEffect(() => {
    if (!story) return;
    setMessages([
      {
        sender: "ai",
        text: `Hi! I'm your BLINK Assistant. Ask me anything about **"${story.title}"**. Feel free to use the quick queries below or write your own!`,
      },
    ]);
  }, [story]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim() || isLoading || !story) return;

    const userMsg: Message = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storyId: story.id, question: textToSend }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not reach AI assistant.");
        return res.json();
      })
      .then((data) => {
        setIsSimulatedResponse(!!data.isSimulated);
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: data.answer, isSimulated: data.isSimulated },
        ]);
      })
      .catch((err) => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Sorry, I couldn't process that question right now. Please try again.",
          },
        ]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center md:max-w-md md:mx-auto animate-fade-in">
      {/* Container */}
      <div className="bg-white w-full h-[85vh] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up border-t border-sky-100/55">
        
        {/* Top Handle */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-3"></div>

        {/* Chat Header */}
        <div className="px-5 pb-3 flex items-start justify-between border-b border-sky-100/40 bg-white">
          <div className="space-y-1 text-left">
            <span className="text-[10px] font-black tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 w-fit">
              <Sparkles className="w-3 h-3 text-indigo-500 fill-current animate-pulse" /> ASK AI COACH
            </span>
            <h3 className="text-xl font-black text-indigo-950 tracking-tight leading-tight">
              Ask AI about this story
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1">
              Context: {story.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:text-indigo-950 hover:bg-slate-200 active:scale-95 transition-all duration-200"
            id="close-chat-btn"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Chat Message Window */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-2.5 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  msg.sender === "user" ? "bg-indigo-600 text-white" : "bg-sky-50 text-sky-600 border border-sky-100"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5" />}
              </div>

              {/* Speech bubble */}
              <div className="flex flex-col space-y-1 max-w-[75%] text-left">
                <div
                  className={`px-4 py-3 rounded-2xl text-xs font-semibold leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none shadow-sm"
                      : "bg-white text-indigo-950 border border-sky-100/50 rounded-tl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {msg.sender === "ai" && msg.isSimulated && (
                  <span className="text-[9px] text-sky-600 font-bold px-1 uppercase tracking-wide">
                    💡 Local Preview • Connect Gemini Key for live AI
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* AI Loader Bubble */}
          {isLoading && (
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center animate-pulse">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div className="bg-white px-4 py-3.5 rounded-2xl border border-sky-100/50 rounded-tl-none shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 border-t border-sky-100/40 bg-white flex gap-2 overflow-x-auto scrollbar-none shrink-0">
          {suggestionPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="px-3.5 py-1.5 rounded-full border border-sky-100 text-[10px] font-black uppercase text-indigo-600 bg-white hover:bg-sky-50 active:scale-95 transition-all duration-150 whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 border-t border-sky-100/40 bg-white shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask AI anything about this story..."
              className="flex-1 px-4 py-3 border border-sky-100/70 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 font-semibold"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className={`p-3 rounded-2xl text-white transition-all duration-200 shadow-md ${
                inputValue.trim() && !isLoading
                  ? "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
                  : "bg-slate-100 text-slate-300 cursor-not-allowed"
              }`}
              id="send-message-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, X, Send, Loader2, Sparkles, User, Minimize2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AiChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "你好！我是 AI 简历助手。有什么关于简历优化的问题，都可以问我。",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      if (!res.ok) throw new Error();

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMsg = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistantMsg += decoder.decode(value, { stream: true });
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: "assistant", content: assistantMsg },
          ]);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "抱歉，服务暂时不可用，请稍后重试。",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xl shadow-emerald-500/30 hover:bg-emerald-700 hover:scale-105 transition-all"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] flex flex-col liquid-glass overflow-hidden" style={{ height: "500px", borderRadius: "20px" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/20">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
            <Sparkles className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">AI 简历助手</p>
            <p className="text-[10px] text-gray-500">随时帮你优化简历</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
          >
            <Minimize2 className="h-4 w-4 text-gray-400" />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
              msg.role === "user"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-600"
            }`}>
              {msg.role === "user" ? (
                <User className="h-3.5 w-3.5" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white rounded-br-sm"
                  : "bg-white/70 text-gray-800 border border-gray-200/50 rounded-bl-sm"
              }`}
            >
              {msg.content}
              {loading && i === messages.length - 1 && msg.role === "assistant" && !msg.content && (
                <div className="flex gap-1 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-white/20 p-3">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="问我关于简历的任何问题..."
            rows={1}
            className="flex-1 resize-none rounded-xl border-gray-200/50 bg-white/50 text-sm min-h-[36px] max-h-[80px]"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            size="icon"
            className="h-9 w-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 shrink-0"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

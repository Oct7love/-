"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  UserCircle,
  Bot,
  Send,
  Loader2,
  RotateCcw,
  Award,
  Sparkles,
} from "lucide-react";

interface Message {
  role: "interviewer" | "user" | "feedback";
  content: string;
}

export function MockInterview() {
  const [position, setPosition] = useState("");
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function startInterview() {
    if (!position.trim()) return;
    setStarted(true);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `你现在是一位面试官，正在面试「${position}」岗位的候选人。请提出第一个面试问题。
要求：
- 只输出一个面试问题
- 问题要与岗位相关
- 不要其他说明文字`,
        }),
      });

      if (!res.ok) throw new Error();
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let text = "";

      setMessages([{ role: "interviewer", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          setMessages([{ role: "interviewer", content: text }]);
        }
      }
      setQuestionCount(1);
    } catch {
      setMessages([{ role: "interviewer", content: "你好，请先做一下自我介绍。" }]);
      setQuestionCount(1);
    } finally {
      setLoading(false);
    }
  }

  async function handleAnswer() {
    if (!input.trim() || loading) return;
    const answer = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: answer }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `你是面试官，面试「${position}」岗位。
之前的问题：${messages[messages.length - 1]?.content}
候选人的回答：${answer}

请做两件事：
1. 用1-2句话简短点评这个回答（好的地方和可以改进的地方）
2. 提出下一个面试问题

格式：
【点评】你的点评
【下一题】新的面试问题`,
        }),
      });

      if (!res.ok) throw new Error();
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let text = "";

      setMessages((prev) => [...prev, { role: "feedback", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: "feedback", content: text },
          ]);
        }
      }
      setQuestionCount((c) => c + 1);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "feedback", content: "评价获取失败，请继续下一题。" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStarted(false);
    setMessages([]);
    setInput("");
    setQuestionCount(0);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <UserCircle className="h-4 w-4 text-emerald-600" />
            AI 模拟面试
          </CardTitle>
          {started && (
            <Button variant="ghost" size="icon-xs" onClick={reset}>
              <RotateCcw className="h-3 w-3 text-gray-400" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {!started ? (
          <>
            <div className="space-y-1.5">
              <Label className="text-xs">面试岗位</Label>
              <Input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="如：前端开发工程师"
                className="h-8 text-xs"
              />
            </div>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              size="sm"
              onClick={startInterview}
              disabled={loading || !position.trim()}
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 mr-1 animate-spin" />准备中...</>
              ) : (
                "开始模拟面试"
              )}
            </Button>
            <p className="text-[10px] text-gray-400 text-center">
              AI 会扮演面试官向你提问，并对你的回答给出反馈
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-[10px]">{position}</Badge>
              <Badge variant="outline" className="text-[10px]">
                <Award className="h-2.5 w-2.5 mr-0.5" />
                已答 {questionCount} 题
              </Badge>
            </div>

            <div ref={scrollRef} className="max-h-[300px] overflow-y-auto space-y-2 p-1">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                    msg.role === "user" ? "bg-emerald-100" :
                    msg.role === "feedback" ? "bg-amber-100" : "bg-gray-100"
                  }`}>
                    {msg.role === "user" ? (
                      <UserCircle className="h-3.5 w-3.5 text-emerald-600" />
                    ) : msg.role === "feedback" ? (
                      <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    ) : (
                      <Bot className="h-3.5 w-3.5 text-gray-600" />
                    )}
                  </div>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white rounded-br-sm"
                      : msg.role === "feedback"
                      ? "bg-amber-50 text-gray-700 border border-amber-200/50 rounded-bl-sm"
                      : "bg-gray-100 text-gray-700 rounded-bl-sm"
                  }`}>
                    {msg.content}
                    {loading && i === messages.length - 1 && msg.role !== "user" && (
                      <span className="inline-block w-1 h-3 bg-current animate-pulse ml-0.5 align-middle opacity-50" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-1.5">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAnswer();
                  }
                }}
                placeholder="输入你的回答..."
                rows={2}
                className="flex-1 text-xs resize-none min-h-[52px]"
                disabled={loading}
              />
              <Button
                onClick={handleAnswer}
                disabled={!input.trim() || loading}
                size="icon"
                className="h-[52px] w-10 bg-emerald-600 hover:bg-emerald-700 shrink-0 rounded-xl"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

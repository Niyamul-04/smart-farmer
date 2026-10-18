import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useLocation } from "../context/LocationContext";
import {
  Sparkles,
  Send,
  Bot,
  User,
  RefreshCw,
  Copy,
  Check,
  MapPin,
  Thermometer,
  CloudSun,
  ShieldAlert,
  Droplets,
  HelpCircle,
  MessageSquare
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const NiyamulAI: React.FC = () => {
  const { language, toBengaliNumber } = useLanguage();
  const { selectedDistrict, selectedUpazila, coordinates } = useLocation();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro-1",
      role: "assistant",
      content: `🌾 **আসসালামু আলাইকুম! আমি নিয়ামুল এআই (Niyamul AI)।**

আমি আপনার সার্বক্ষণিক স্মার্ট আবহাওয়া ও কৃষি পরামর্শক সহকারী। আপনার নির্বাচিত জেলা **${selectedDistrict?.bnName || "ঢাকা"}** এর আবহাওয়া ও মাটির উপযোগী পরামর্শ দিতে আমি প্রস্তুত।

নিচের যেকোনো পরামর্শ বাটন চাপুন অথবা আপনার জমির সমস্যা বা আবহাওয়া বিষয়ে সরাসরি প্রশ্ন লিখুন!`,
      timestamp: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([
    "আজকের আবহাওয়ায় কি জমিতে সেচ দেওয়া যাবে?",
    "আমার জমিতে এই মৌসুমে সবচেয়ে লাভজনক ফসল কোনটি?",
    "জমিতে সেচ ও জৈব সার প্রয়োগের সঠিক নিয়ম কী?",
    "আবহাওয়ার পরিবর্তনজনিত ফসল সুরক্ষা ও যত্ন নেওয়ার উপায়"
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery("");
    setIsTyping(true);

    try {
      const history = messages.concat(userMsg).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          districtId: selectedDistrict?.id || "dhaka",
          lat: coordinates.lat,
          lon: coordinates.lon
        })
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const assistantMsg: Message = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          timestamp: data.timestamp || new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })
        };
        setMessages(prev => [...prev, assistantMsg]);
        if (data.suggestedQuestions && data.suggestedQuestions.length > 0) {
          setSuggestions(data.suggestedQuestions);
        }
      } else {
        throw new Error(data.message || "Failed to generate reply");
      }
    } catch (err) {
      console.error("AI chat error:", err);
      const fallbackMsg: Message = {
        id: `ai-err-${Date.now()}`,
        role: "assistant",
        content: "দুঃখিত, সংযোগে সাময়িক সমস্যা হয়েছে। দয়া করে আরেকবার প্রশ্নটি করুন।",
        timestamp: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatMarkdown = (text: string) => {
    // Process markdown-like bold, lists, and emojis for rich readability
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("### ")) {
        return <h3 key={idx} className="text-base font-bold text-emerald-950 mt-2 mb-1">{line.replace("### ", "")}</h3>;
      }
      if (line.startsWith("## ")) {
        return <h2 key={idx} className="text-lg font-extrabold text-emerald-950 mt-2 mb-1">{line.replace("## ", "")}</h2>;
      }
      if (line.startsWith("* ") || line.startsWith("- ")) {
        const content = line.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-slate-800 leading-relaxed font-medium">
            <span dangerouslySetInnerHTML={{ __html: parseBold(content) }} />
          </li>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-slate-800 leading-relaxed font-medium">
            <span dangerouslySetInnerHTML={{ __html: parseBold(line.replace(/^\d+\.\s/, "")) }} />
          </li>
        );
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-slate-800 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: parseBold(line) }} />
      );
    });
  };

  const parseBold = (str: string) => {
    return str.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-950 text-emerald-950">$1</strong>');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      {/* AI Assistant Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-emerald-950 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border border-emerald-700/50">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 p-0.5 shadow-lg shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-2xl">
                🤖
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-wide text-white">
                  নিয়ামুল এআই (Niyamul AI)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-sm uppercase tracking-wider animate-pulse">
                  Smart AI
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200 mt-1 font-medium">
                {language === "bn"
                  ? "আপনার সার্বক্ষণিক স্মার্ট কৃষি ও আবহাওয়া সহকারী • তৈরি করেছেন নিয়ামুল"
                  : "Your 24/7 Smart Weather & Agriculture AI Advisor • Powered by Niyamul"}
              </p>
            </div>
          </div>

          {/* Sync badge with selected location */}
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 text-xs text-emerald-100 flex items-center gap-2 self-start md:self-auto">
            <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
            <div>
              <span className="font-bold text-white">
                {selectedDistrict ? (language === "bn" ? selectedDistrict.bnName : selectedDistrict.name) : "ঢাকা"}
              </span>
              <span className="text-emerald-300 ml-1">
                {selectedUpazila ? `(${language === "bn" ? selectedUpazila.bnName : selectedUpazila.name})` : ""}
              </span>
              <div className="text-[10px] text-emerald-200">লাইভ আবহাওয়া ও কৃষি মডেল সংযুক্ত</div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="space-y-1.5">
        <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 px-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{language === "bn" ? "নিয়ামুল এআই-কে দ্রুত প্রশ্ন করুন:" : "Quick Suggested Questions:"}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(suggestion)}
              disabled={isTyping}
              className="text-xs font-semibold bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all shadow-xs text-left"
            >
              💬 {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map(msg => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm shadow-sm font-bold ${
                    isUser
                      ? "bg-slate-900 text-white"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {isUser ? <User className="w-5 h-5" /> : <span>🌾</span>}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm shadow-sm space-y-2 ${
                    isUser
                      ? "bg-emerald-600 text-white font-medium rounded-tr-none"
                      : "bg-slate-50 border border-slate-200 text-slate-900 rounded-tl-none font-medium"
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-1.5 text-[11px] text-emerald-800 font-bold">
                      <span className="flex items-center gap-1">
                        <Bot className="w-3.5 h-3.5 text-emerald-600" />
                        <span>নিয়ামুল এআই (Niyamul AI)</span>
                      </span>
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="text-slate-400 hover:text-emerald-700 p-1 rounded-md"
                        title="কপি করুন"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  <div className="space-y-1">
                    {isUser ? (
                      <p className="leading-relaxed font-semibold">{msg.content}</p>
                    ) : (
                      formatMarkdown(msg.content)
                    )}
                  </div>

                  <div className={`text-[10px] text-right pt-1 ${isUser ? "text-emerald-100" : "text-slate-400"}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm shadow-sm shrink-0">
                🌾
              </div>
              <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
                <span>নিয়ামুল এআই উত্তর তৈরি করছে...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50/80">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={e => setInputQuery(e.target.value)}
              placeholder={language === "bn" ? "নিয়ামুল এআই-কে যেকোনো কৃষি বা আবহাওয়া প্রশ্ন করুন..." : "Ask Niyamul AI any weather or agricultural question..."}
              disabled={isTyping}
              className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>{language === "bn" ? "পাঠান" : "Send"}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

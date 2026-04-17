"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

export function LiveTicker() {
  const [time, setTime] = useState<Date>(new Date());
  const [onlineCount, setOnlineCount] = useState<number>(314);
  const [messageIndex, setMessageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const messages = [
    "🔥 Жаңа 42 вакансия қосылды",
    "💼 Kaspi.kz IT мамандар іздейді",
    "📈 Қаржы саласында орташа жалақы 15% өсті",
    "🚀 18 маман жұмыс тапты (бүгін)"
  ];

  useEffect(() => {
    setMounted(true);
    // Clock
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Message rotation
    const msgTimer = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages.length);
    }, 4000);
    
    // Online count simulation
    const onlineTimer = setInterval(() => {
      const diff = Math.floor(Math.random() * 5) - 2; // -2 to +2
      setOnlineCount(prev => Math.max(100, prev + diff));
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(msgTimer);
      clearInterval(onlineTimer);
    };
  }, [messages.length]);

  return (
    <div className="bg-gradient-to-r from-primary to-indigo-600 py-2.5 overflow-hidden text-white relative shadow-inner z-10">
      <div className="container px-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 text-sm font-medium">
        
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse-dot shadow-[0_0_8px_theme(colors.emerald.400)]" />
          <span className="opacity-90">Қазір онлайн:</span>
          <strong className="tracking-wide">{onlineCount}</strong>
        </div>

        <div className="hidden md:block w-px h-4 bg-white/30" />

        <div className="flex-1 text-center font-semibold tracking-wide h-5 overflow-hidden relative min-w-[250px]">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`absolute w-full inset-0 transition-transform duration-500 ease-in-out ${
                i === messageIndex 
                  ? 'translate-y-0 opacity-100' 
                  : i < messageIndex || (messageIndex === 0 && i === messages.length - 1)
                    ? '-translate-y-full opacity-0'
                    : 'translate-y-full opacity-0'
              }`}
            >
              {msg}
            </div>
          ))}
        </div>

        <div className="hidden md:block w-px h-4 bg-white/30" />

        <div className="flex items-center gap-1.5 opacity-90 font-mono tracking-wider">
          <span className="text-base leading-none relative -top-[1px]">🕒</span>
          {mounted ? format(time, "HH:mm:ss") : "--:--:--"}
        </div>

      </div>
    </div>
  );
}

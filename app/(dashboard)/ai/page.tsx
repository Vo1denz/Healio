"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

export default function YourCompanionPage() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle manual scrolling
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      if (scrollHeight - scrollTop - clientHeight < 50) {
        setIsAutoScroll(true);
      } else {
        setIsAutoScroll(false);
      }
    }
  };

  useEffect(() => {
    if (isAutoScroll) {
      scrollToBottom();
    }
  }, [messages, isAutoScroll]);

  // Add keyboard navigation for scrolling
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!chatContainer) return;
      if (event.key === "ArrowUp") {
        event.preventDefault();
        chatContainer.scrollTop -= 30;
        if (chatContainer.scrollTop <= 0) {
          setIsAutoScroll(false);
        }
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        chatContainer.scrollTop += 30;
        if (chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 50) {
          setIsAutoScroll(true);
        }
      }
    };
    if (chatContainer) {
      chatContainer.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, []);

  // Enable smooth scrolling for touchpad using an EventListener that ignores its event parameter.
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      const handleWheel: EventListener = () => {
        if (chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 50) {
          setIsAutoScroll(true);
        } else {
          setIsAutoScroll(false);
        }
      };
      chatContainer.addEventListener("wheel", handleWheel, { passive: true });
      return () => {
        chatContainer.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const newMessage = { sender: "user", text: input.trim() };
    setMessages([...messages, newMessage]);
    setInput("");
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      const data = await response.json();
      const aiMessage = {
        sender: "ai",
        text: data.response || "I apologize, I need to process that request further.",
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch {
      const errorMessage = {
        sender: "ai",
        text: "An error occurred. Please try again.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="font-montreal flex min-h-screen bg-[#E5F4DD] items-center justify-center"
    >
      <main className="flex-1 p-8 mt-35">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-8 mb-8"
          >
            <Image
              width={120}
              height={120}
              src="/images/logohealio.png"
              alt="Your Companion"
              className="w-24 h-24 object-cover rounded-full"
            />
            <div className="text-center">
              <h1 className="text-5xl font-medium text-[#314328] mb-2">
                Don&apos;t worry we&apos;ve Got Someone for you here
              </h1>
              <p className="text-gray-600">
                Ask Questions, Communicate, Share Your Thoughts, Or Seek Advice. Your Companion Is Here To Listen,
                Support, And Guide You On Your Mental Wellness Journey.
              </p>
            </div>
          </motion.div>

          {/* Chat container with fixed height and manual scroll handler */}
          <div
            ref={chatContainerRef}
            onScroll={handleScroll}
            tabIndex={0}
            style={{ WebkitOverflowScrolling: "touch" }}
            className="bg-white/80 rounded-lg p-4 mb-4 h-[400px] overflow-y-auto focus:outline-none"
          >
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-4 ${message.sender === "user" ? "text-right" : "text-left"}`}
                >
                  {message.sender === "user" ? (
                    <span className="inline-block p-2 rounded-lg bg-[#c6e0bf] text-[#314328]">{message.text}</span>
                  ) : (
                    <div className="inline-block p-2 rounded-lg bg-[#d3ddcd]/70 text-[#526D4E] max-w-[80%]">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start items-center space-x-2 p-2"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.6 }}
                  className="w-2 h-2 bg-[#526D4E] rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.6, delay: 0.2 }}
                  className="w-2 h-2 bg-[#526D4E] rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.6, delay: 0.4 }}
                  className="w-2 h-2 bg-[#526D4E] rounded-full"
                />
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="relative">
            <motion.textarea
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="How can Your Companion help you today?"
              className="w-full min-h-[120px] p-4 pr-12 rounded-lg border border-[#526D4E]/20 bg-white/80 text-[#526D4E] placeholder-[#526D4E]/60 focus:outline-none focus:ring-2 focus:ring-[#526D4E]/20"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="absolute bottom-4 right-4 p-2 rounded-lg bg-[#A5C49C] hover:bg-[#94b38b] transition-colors"
            >
              <ArrowUp className="w-4 h-4 text-white" />
            </motion.button>
          </form>
        </div>
      </main>
    </motion.div>
  );
}

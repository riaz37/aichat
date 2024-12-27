"use client";
import React from "react";
import { useParams } from "next/navigation";
import ChatInput from "@/components/chat-input";
import ChatMessages from "@/components/chat-messages";

const ChatSessionPage = () => {
  const { sessionId } = useParams();
  return (
    <div className="w-full h-[100%] bg-white dark:bg-zinc-800 rounded-xl flex flex-row relative overflow-hidden">
      <ChatMessages />
      <ChatInput />
    </div>
  );
};

export default ChatSessionPage;

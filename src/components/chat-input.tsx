"use client";
import { useChatContext } from "@/context/chat/context";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { PromptType, RoleType } from "@/hooks/use-chat-session";

const ChatInput = () => {
  const { sessionId } = useParams();
  const [inputValue, setInputValue] = useState("");
  const { runModel, currentSession } = useChatContext();

  const isNewSession = !currentSession?.messages?.length;

  

  const examples = [
    "What is quantam computing?",
    "What are qubits?",
    "What is GDP of Bangladesh?",
  ]
  return (
    <div className="w-full flex flex-col items-center justify-center absolute bottom-0 px-4 pb-4 pt-16 bg-gradient-to-t from-white dark:from-zinc-800 dark:to-transparent from-70% to-white/10 left-0 right-0">
      {isNewSession && (
        <div>
          
        </div>
      )}
      <Input
        placeholder="Ask NexAI anything..."
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            runModel(
              {
                role: RoleType.assistant,
                type: PromptType.ask,
                query: inputValue,
              },
              sessionId!.toString()
            );

            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
};

export default ChatInput;

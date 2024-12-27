"use client";
import { createContext, useContext } from "react";
import { ChatSession, promptProps } from "@/hooks/use-chat-session";
import { StreamProps } from "@/hooks/use-llm";

export type ChatContext = {
  sessions: ChatSession[];
  refetchSession: () => void;
  isSessionLoading: boolean;
  createSession: () => void;
  currentSession: ChatSession | undefined;
  lastStream?: StreamProps;
  runModel: (props: promptProps, sessionId: string) => Promise<void>;
};

export const ChatContext = createContext<ChatContext | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }

  return context;
};

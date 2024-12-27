import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { get, set } from "idb-keyval";
import { v4 } from "uuid";

export enum ModelType {
  GPT3 = "gpt-3",
  GPT4 = "gpt-4",
  CLAUDE2 = "claude-2",
  CLAUDE3 = "claude-3",
}

export enum PromptType {
  ask = "ask",
  answer = "answer",
  explain = "explain",
  summarize = "summarize",
  improve = "improve",
  fix_grammar = "fix grammar",
  reply = "reply",
  short_reply = "short reply",
}

export enum RoleType {
  assistant = "assistant",
  writing_expert = "writing expert",
  social_media_expert = "social media expert",
  coding_expert = "coding expert",
}

export type promptProps = {
  type: PromptType;
  context?: string;
  role?: RoleType;
  query?: string;
  regenate?: boolean;
};

export type ChatMessage = {
  id: string;
  model: ModelType;
  human: HumanMessage;
  ai: AIMessage;
  rawHuman: string;
  rawAI: string;
  props?: promptProps;
  createdAt?: string;
};

export type ChatSession = {
  messages: ChatMessage[];
  title?: string;
  id: string;
  createdAt?: string;
};

export const useChatSession = () => {
  const getSession = async (): Promise<ChatSession[]> => {
    return (await get("chat-session")) || [];
  };

  const setSession = async (chatSession: ChatSession) => {
    const session = await getSession();
    const newSession = [...session, chatSession];
    await set("chat-session", newSession);
  };
  const getSessionById = async (id: string) => {
    const session = await getSession();
    return session.find((session: ChatSession) => session.id === id);
  };

  const removeSessionById = async (id: string) => {
    const session = await getSession();
    const newSession = session.filter(
      (session: ChatSession) => session.id !== id
    );
    await set("chat-session", newSession);
  };

  const addMessageToSession = async (
    sessionId: string,
    chatMessage: ChatMessage
  ) => {
    const session = await getSession();
    const newSession = session.map((session: ChatSession) => {
      if (session.id === sessionId) {
        return {
          ...session,
          messages: [...session.messages, chatMessage],
        };
      }
      return session;
    });

    await set("chat-session", newSession);
  };

  const createNewSession = async () => {
    const sessions = await getSession();

    const latestSession = sessions?.[0];
    if (latestSession?.messages?.length === 0) {
      return latestSession;
    }

    const newSession: ChatSession = {
      id: v4(),
      messages: [],
      title: "Untitled",
      createdAt: new Date().toISOString(),
    };

    const newSessions = [newSession, ...sessions];
    await set("chat-session", newSessions);

    return newSession;
  };

  const updateSession = async (
    sessionId: string,
    newSession: Omit<ChatSession, "id">
  ) => {
    const session = await getSession();
    const newSessions = session.map((session: ChatSession) => {
      if (session.id === sessionId) {
        return {
          ...session,
          ...newSession,
        };
      }
      return session;
    });

    await set("chat-session", newSessions);
  };

  return {
    getSession,
    getSessionById,
    setSession,
    removeSessionById,
    addMessageToSession,
    updateSession,
    createNewSession,
  };
};

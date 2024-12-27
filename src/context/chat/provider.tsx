"use client";
import { ChatSession, useChatSession } from "@/hooks/use-chat-session";
import { ChatContext } from "./context";
import { useEffect, useState } from "react";
import { StreamProps, useLLM } from "@/hooks/use-llm";
import { useParams } from "next/navigation";

export type ChatProvider = {
  children: React.ReactNode;
};

export const ChatProvider = ({ children }: ChatProvider) => {
  const { getSession, createNewSession, getSessionById } = useChatSession();

  const { sessionId } = useParams();

  const [sessions, setSessions] = useState<ChatSession[]>([]);

  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true);

  const [lastStream, setLastStream] = useState<StreamProps>();

  const [currentSession, setCurrentSession] = useState<ChatSession | undefined>(
    undefined
  );

  const { runModel } = useLLM({
    onStreamStart: () => {
      setLastStream(undefined);
      refetchSession();
    },
    onStream: async (props) => {
      setLastStream(props);
    },
    onStreamEnd: () => {
      fetchSessions().then(() => {
        setLastStream(undefined);
      });
    },
  });

  const fetchSessions = async () => {
    const sessions = await getSession();
    setSessions(sessions);
    setIsSessionLoading(false);
  };

  const createSession = async () => {
    const newSession = await createNewSession();
    fetchSessions();
    return newSession;
  };

  const fetchSession = async () => {
    const session = await getSessionById(sessionId!.toString());
    setCurrentSession(session);
  };

  useEffect(() => {
    if (!sessionId) {
      return;
    }
    fetchSession();
  }, [sessionId]);

  useEffect(() => {
    setIsSessionLoading(true);
    fetchSessions();
  }, []);

  const refetchSession = async () => {
    fetchSessions();
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        refetchSession,
        isSessionLoading,
        createSession,
        lastStream,
        runModel,
        currentSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

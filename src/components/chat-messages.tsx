import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useChatContext } from "@/context/chat/context";
import { useState } from "react";
import { ChatSession, useChatSession } from "@/hooks/use-chat-session";
import { useMarkdown } from "@/hooks/use-mdx";

const ChatMessages = () => {
  const { sessionId } = useParams();
  const { lastStream } = useChatContext();
  const [currentSession, setCurrentSession] = useState<ChatSession | undefined>(
    undefined
  );

  const { getSessionById } = useChatSession();
  const { renderMarkdown } = useMarkdown();

  const fetchSession = async () => {
    getSessionById(sessionId!.toString()).then((session) => {
      setCurrentSession(session);
    });
  };

  useEffect(() => {
    if (!sessionId) return;

    fetchSession();
  }, [sessionId]);

  useEffect(() => {
    if (lastStream) {
      fetchSession();
    }
  }, [lastStream]);

  const isLastStreamBelongsToCurrentSession = () => {
    return lastStream?.sessionId === sessionId;
  };

  return (
    <div>
      {currentSession?.messages?.map((message, index) => (
        <div key={index} className="p-2">
          {message.rawHuman}
          {renderMarkdown(message.rawAI)}
        </div>
      ))}
      {isLastStreamBelongsToCurrentSession() && (
        <div className="p-2">
         {lastStream?.props?.query}
          {renderMarkdown(lastStream!.message)}
        </div>
      )}
    </div>
  );
};

export default ChatMessages;

import { ChatOpenAI } from "@langchain/openai";
import { ChatMessage, ModelType, promptProps } from "./use-chat-session";
import { useChatSession } from "./use-chat-session";
import { v4 } from "uuid";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { getInstructions, getRole } from "@/lib/prompts";
import { RoleType } from "./use-chat-session";

export type StreamProps = {
  props: promptProps;
  sessionId: string;
  message: string;
};

export type UseLLM = {
  onStreamStart: () => void;
  onStream: (props: StreamProps) => Promise<void>;
  onStreamEnd: () => void;
};

export const useLLM = ({ onStreamStart, onStream, onStreamEnd }: UseLLM) => {
  const { getSessionById, addMessageToSession } = useChatSession();

  const preparePrompt = async (props: promptProps, history: ChatMessage[]) => {
    const messageHistory = history;
    const prompt = ChatPromptTemplate.fromMessages(
      messageHistory?.length > 0
        ? [
            [
              "system",
              "You are {role} Answer user's question based on the following context:",
            ],
            new MessagesPlaceholder("chat_history"),
            ["user", "{input}"],
          ]
        : [
            props?.context
              ? [
                  "system",
                  "You are {role} Answer user's question based on the following context: {context}",
                ]
              : ["system", "You are {role}."],
            ["user", "{input}"],
          ]
    );

    const previousMessageHistory = messageHistory.reduce(
      (acc: (HumanMessage | AIMessage)[], { rawHuman, rawAI }) => [
        ...acc,
        new HumanMessage(rawHuman),
        new AIMessage(rawAI),
      ],
      []
    );
    return await prompt.formatMessages(
      messageHistory?.length > 0
        ? {
            role: props?.role
              ? getRole(props.role)
              : getRole(RoleType.assistant),
            input: props?.query,
            chat_history: previousMessageHistory,
          }
        : {
            role: props?.role
              ? getRole(props.role)
              : getRole(RoleType.assistant),
            type: getInstructions(props?.type),
            input: props?.query,
            context: props?.context,
          }
    );
  };

  const runModel = async (props: promptProps, sessionId: string) => {
    const currentSession = await getSessionById(sessionId);

    if (!props?.query) {
      return;
    }

    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const newMessageId = v4();

    const formattedChatPrompt = await preparePrompt(
      props,
      currentSession?.messages || []
    );
    const stream = await model.stream(formattedChatPrompt);

    let streamedMessage = "";

    onStreamStart();

    for await (const chunk of stream) {
      streamedMessage += chunk.content;
      onStream({ props, sessionId, message: streamedMessage });
    }

    for await (const chunk of stream) {
      streamedMessage += chunk.content;
    }
    const chatMessage = {
      id: newMessageId,
      model: ModelType.GPT3,
      human: new HumanMessage(props?.query),
      ai: new AIMessage(streamedMessage),
      rawHuman: props?.query,
      rawAI: streamedMessage,
      props,
    };

    await addMessageToSession(sessionId, chatMessage).then(() => {
      onStreamEnd();
    });
  };

  return { runModel };
};

import { PromptType, RoleType } from "@/hooks/use-chat-session";

export const getRole = (type: RoleType): string => {
  switch (type) {
    case RoleType.assistant:
      return "You are a helpful assistant.";
    case RoleType.writing_expert:
      return "You are a writing and coding expert.";
    case RoleType.social_media_expert:
      return "You are a social media expert.";
    default:
      return "You are acting as an assistant.";
  }
};

export const getInstructions = (type: PromptType): string => {
  switch (type) {
    case PromptType.ask:
      return "Provide a detailed answer based on the user's query.";
    case PromptType.answer:
    case PromptType.explain:
    case PromptType.summarize:
    case PromptType.improve:
    case PromptType.fix_grammar:
    case PromptType.reply:
    case PromptType.short_reply:
      return "Respond based on the provided context.";
    default:
      return "Provide a response that best addresses the user's input.";
  }
};

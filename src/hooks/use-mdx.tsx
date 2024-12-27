import CodeBlock from "@/components/codeBlock";
import { cn } from "@/lib/utils";
import Markdown from "marked-react";

export const useMarkdown = () => {
  const renderMarkdown = (message: string) => {
    return (
      <Markdown
        renderer={{
          paragraph: (children) => {
            return <p className="text-sm leading-7">{children}</p>;
          },
          heading: (children, level) => {
            const Heading = `h${level}` as keyof JSX.IntrinsicElements;
            return <Heading>{children}</Heading>;
          },
          link: (href, text) => {
            return (
              <a href={href} target="_blank">
                {text}
              </a>
            );
          },
          blockquote: (children) => {
            return <p className="text-sm leading-7">{children}</p>;
          },
          list: (children, ordered) => {
            const List = ordered ? "ol" : "ul";
            return (
              <List
                className={cn(ordered ? "list-decimal" : "list-disc", "ml-8")}
              >
                {children}
              </List>
            );
          },
          listItem: (children) => {
            return (
              <li className="my-4">
                <p className="text-sm leading-7">{children}</p>
              </li>
            );
          },
          code: (code, lang) => {
            return <div className="my-8"><CodeBlock lang={lang || ''} code={code?.toString() || ''}/></div>;
          },
          codespan: (children) => {
            return (
              <span className="px-2 py-1 text-xs rounded text-gray-800">
                {children}
              </span>
            );
          },
        }}
      >
        {message}
      </Markdown>
    );
  };

  return { renderMarkdown };
};

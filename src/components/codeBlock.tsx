import React, { useEffect, useRef } from "react";
import hljs from "highlight.js";
import { Button } from "./ui/button";
import { useClipboard } from "@/hooks/use-clipboard";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";

export interface CodeBlockProps {
  lang?: string;
  code: string;
}

const CodeBlock = ({ lang, code }: CodeBlockProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { copiedText, copy, showCopied } = useClipboard();
  const language = lang && hljs.getLanguage(lang) ? lang : "plaintext";

  useEffect(() => {
    if (ref?.current && code) {
      const highlightedCode = hljs.highlight(code, { language }).value;
      ref.current.innerHTML = highlightedCode;
    }
  }, [code, language]);

  return (
    <div className="hljs-wrapper">
      <div className="pl-4 pr-2 py-2 w-full flex justify-between items-center">
        <p>{language}</p>
        <Button size={"sm"} onClick={() => code && copy(code)}>
          {showCopied ? <CheckIcon /> : <CopyIcon />}
          {showCopied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="hljs-pre">
        <code ref={ref} className={`hljs language-${language}`}></code>
      </pre>
    </div>
  );
};

export default CodeBlock;

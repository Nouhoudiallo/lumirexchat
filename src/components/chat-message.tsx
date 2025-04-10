import type { Message } from "@/types/chat";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    // User message - aligned to the right
    return (
      <div className="py-3 px-4 md:px-8 flex justify-end">
        <div className="max-w-[80%] rounded-lg p-3 bg-gray-800 text-white">
          <div className="flex items-start gap-3">
            <div className="min-w-0 whitespace-pre-wrap">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-xl font-bold" {...props} />,
                  p: ({ node, ...props }) => <p className="text-sm" {...props} />,
                  // Ajoutez d'autres éléments si nécessaire
                  // Ajouter des elements pour les blocks de code
                  code: ({ node, ...props }) => (
                    <pre className="bg-gray-800 text-white p-2 rounded-md" {...(props as React.HTMLAttributes<HTMLPreElement>)} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-gray-600 pl-4 italic" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-5" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal pl-5" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-sm" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-bold" {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="italic" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a className="text-blue-500 underline" {...props} />
                  ),
                  img: ({ node, ...props }) => (
                    <img className="max-w-full h-auto" {...props} />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
           
          </div>
        </div>
      </div>
    );
  } else {
    // AI message - aligned to the left
    return (
      <div className="py-3 px-4 md:px-8 flex justify-start">
        <div className="w-full rounded-lg p-3 bg-[#444654]/30 text-white">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-7 h-7 rounded-sm flex items-center justify-center text-white text-sm bg-[#10a37f]">
                AI
              </div>
            </div>
            <div className="min-w-0 whitespace-pre-wrap w-full">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-xl font-bold" {...props} />,
                  p: ({ node, ...props }) => <p className="text-sm" {...props} />,
                  code: ({ node, ...props }) => (
                    <pre className="bg-gray-800 text-white p-2 rounded-md" {...(props as React.HTMLAttributes<HTMLPreElement>)} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-gray-600 pl-4 italic" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-5" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal pl-5" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-sm" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-bold" {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="italic" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a className="text-blue-500 underline" {...props} />
                  ),
                  img: ({ node, ...props }) => (
                    <img className="max-w-full h-auto" {...props} />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

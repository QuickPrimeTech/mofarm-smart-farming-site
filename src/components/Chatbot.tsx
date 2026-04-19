"use client"; // Import the correct transport
import { useChat } from "@ai-sdk/react"; // Import DefaultChatTransport
import { MessageCircle, X, Send } from "lucide-react";
import { useState } from "react";
import { TextStreamChatTransport } from "ai";
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

 const { messages, sendMessage, status } = useChat({
  transport: new TextStreamChatTransport({
    api: "/api/chat",
  }),
  onError: (error) => {
    console.error("Chat Error Detail:", error.message);
  },
});

  const isLoading = status === "submitted" || status === "streaming";

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col border border-gray-200 overflow-hidden">
          <div className="bg-green-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold">MoFarm Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <p className="text-sm text-gray-500 text-center mt-4">
                Hello! Ask me anything about our fresh farm produce.
              </p>
            )}

          {messages.map((m) => (
  <div
    key={m.id}
    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`max-w-[80%] rounded-lg p-3 text-sm ${
        m.role === "user"
          ? "bg-green-600 text-white rounded-br-none"
          : "bg-gray-200 text-gray-800 rounded-bl-none"
      }`}
    >
      {/* ✅ Render parts array (AI SDK v5+ standard) */}
      {m.parts?.map((part, i) => {
        if (part.type === "text") {
          return (
            <span key={i} className="whitespace-pre-wrap">
              {part.text}
            </span>
          );
        }
        // Handle other part types if needed (file, tool-call, etc.)
        return null;
      })}
    </div>
  </div>
))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none p-3 text-sm animate-pulse">
                  replying ...
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleCustomSubmit}
            className="p-3 border-t bg-white flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 flex items-center justify-center"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}

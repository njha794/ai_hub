"use client";

import { useState, type KeyboardEvent } from "react";
import Message from "./Message";
import type { ChatApiError, ChatApiRequest, ChatApiSuccess } from "@/types/chat";

type ChatMessage = {
  text: string;
  isAi: boolean;
};

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    // User message — use functional updates so we never rely on a stale `messages` closure
    setMessages((prev) => [...prev, { text: trimmed, isAi: false }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Fixed: server expects `message` (was `prompt`); matches `ChatApiRequest`
        body: JSON.stringify({ message: trimmed } satisfies ChatApiRequest),
      });

      const data: ChatApiSuccess | ChatApiError = await res.json();

      if (!res.ok) {
        const errText =
          "error" in data && typeof data.error === "string"
            ? data.error
            : `Request failed (${res.status})`;
        setMessages((prev) => [...prev, { text: errText, isAi: true }]);
        return;
      }

      if (!("message" in data) || typeof data.message !== "string") {
        setMessages((prev) => [...prev, { text: "Unexpected response from server", isAi: true }]);
        return;
      }

      // Fixed: read `message` (was `text`) to match API JSON
      setMessages((prev) => [...prev, { text: data.message, isAi: true }]);
    } catch {
      setMessages((prev) => [...prev, { text: "Network error — could not reach the API.", isAi: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") void handleSend();
  };

  return (
    <div className="flex h-[min(70vh,560px)] flex-col">
      <div className="mb-4 flex-1 overflow-y-auto">
        {messages.map((msg, idx) => (
          <Message key={idx} message={msg.text} isAi={msg.isAi} />
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 rounded-l-lg border p-2 dark:border-zinc-700 dark:bg-zinc-950"
          value={input}
          placeholder="Type a message…"
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="rounded-r-lg bg-blue-600 px-4 text-white hover:bg-blue-700 disabled:opacity-50"
          onClick={() => void handleSend()}
          disabled={loading}
        >
          {loading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}

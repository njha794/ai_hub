import ChatBox from "@/components/ChatBox";

/**
 * App Router page — use `metadata` in `layout.tsx` for <title>, not `next/head`
 * (Head is for the Pages Router; mixing it here is unnecessary).
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Header */}
      <header className="w-full bg-white dark:bg-black shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            AI Chat Hub
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-6xl mx-auto gap-12">
        <div className="text-center sm:text-left max-w-2xl flex flex-col gap-6">
          <h2 className="text-4xl font-bold text-black dark:text-white leading-snug">
            Your Personal AI Chat Assistant
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Start chatting with Google Gemini (free tier via AI Studio). Your API key
            stays on the server — nothing secret is sent to the browser.
          </p>
        </div>

        {/* Chat Section */}
        <div className="w-full max-w-3xl mt-12">
          <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">
            Chat with AI
          </h3>
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-4">
            <ChatBox />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 mt-auto border-t border-zinc-200 dark:border-zinc-800 text-center text-zinc-500 dark:text-zinc-400">
        © 2026 AI Chat Hub. Built with Next.js & Google Gemini
      </footer>
    </div>
  );
}
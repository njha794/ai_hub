"use client"
type MessageProps = {
  message: string;
  isAi: boolean;
};

export default function Message({ message, isAi }: MessageProps) {
  return (
    <div className={`flex ${isAi ? "justify-start" : "justify-end"} mb-2`}>
      <div
        className={`p-3 rounded-lg max-w-xs ${
          isAi ? "bg-gray-200" : "bg-blue-500 text-white"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function ChatApp() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [myId, setMyId] = useState(null);

  // Jab server se message aaye
  useEffect(() => {
    const handleReceive = (msg) => {
      setChat((prev) => [...prev, msg]);
    };
    const handleConnect = () => {
      setMyId(socket.id);
    };

    socket.on("receiveMessage", handleReceive);
    socket.on("connect", handleConnect);
    // If already connected when component mounts
    if (socket.connected) setMyId(socket.id);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("connect", handleConnect);
    };
  }, []);

  // Jab user send kare
  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    socket.emit("sendMessage", trimmed);
    setMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur rounded-2xl shadow-xl border border-white/10">
        <div className="px-5 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold tracking-wide">Chat App</h2>
        </div>

        <div className="p-4 h-80 overflow-y-auto space-y-2">
          {chat.length === 0 ? (
            <p className="text-sm text-slate-300/80">No messages yet. Start the conversation!</p>
          ) : (
            chat.map((msg, index) => {
              const key = msg?.id ?? index;
              const text = typeof msg === "string" ? msg : msg?.text ?? "";
              const senderId = typeof msg === "string" ? undefined : msg?.senderId;
              const isMine = myId && senderId === myId;
              return (
                <div
                  key={key}
                  className={
                    "max-w-[80%] px-3 py-2 rounded-lg shadow-sm " +
                    (isMine
                      ? "bg-indigo-600 text-white ml-auto"
                      : "bg-slate-800/70 text-slate-100 mr-auto")
                  }
                >
                  <p className="text-sm leading-relaxed">{text}</p>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-white/10 flex items-center gap-2">
          <input
            className="flex-1 px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Type a message"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium shadow focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

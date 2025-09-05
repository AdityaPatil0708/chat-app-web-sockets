import { useEffect, useState } from "react";

const ChatApp = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => console.log("✅ Connected to server");
    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const joinRoom = () => {
    if (socket && roomId.trim() !== "") {
      socket.send(
        JSON.stringify({
          type: "join",
          payload: { roomId },
        })
      );
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (socket && message.trim() !== "") {
      socket.send(
        JSON.stringify({
          type: "chat",
          payload: { message },
        })
      );
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      {!joined ? (
        <div className="p-8 rounded-2xl shadow-lg flex flex-col gap-4 w-96 border-1">
          <h1 className="text-2xl font-bold text-center">Join a Room</h1>
          <br />
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="px-4 py-2 rounded-lg text-white border-1"
          />
          <button
            onClick={joinRoom}
            className="px-4 py-2 rounded-lg font-semibold border border-white bg-white text-black hover:cursor-pointer"
          >
            Join
          </button>
        </div>
      ) : (
        <div className="bg-black p-6 rounded-2xl shadow-lg flex flex-col gap-4 w-[500px] border border-white">
          <h1 className="text-xl font-bold text-center">Room: {roomId}</h1>
          <div className="flex flex-col gap-2 h-64 overflow-y-auto bg-black p-4 rounded-lg border border-white">
            {messages.map((msg, index) => (
                <div key={index} className="bg-white text-black px-3 py-1 rounded-lg self-start">
                {msg}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg text-white border border-white"
            />
            <button
              onClick={sendMessage}
              className=" px-4 py-2 rounded-lg font-semibold border border-white bg-white text-black hover:cursor-pointer"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;

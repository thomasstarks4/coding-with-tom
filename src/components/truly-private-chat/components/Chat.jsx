import { useState, useEffect } from "react";
import Peer from "peerjs";
import { toast } from "react-toastify";
import { Copy } from "lucide-react";
import TpcLayout from "../../../design-system/components/TpcLayout";
import Card from "../../../design-system/components/Card";
import Button from "../../../design-system/components/Button";

const Chat = () => {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [conn, setConn] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const newPeer = new Peer({
      host: "0.peerjs.com",
      port: 443,
      secure: true,
      config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      },
    });

    newPeer.on("open", (id) => {
      setPeerId(id);
      setPeer(newPeer);
    });

    newPeer.on("connection", (connection) => {
      toast.success("Connected to a friend!");
      setConn(connection);
      connection.on("data", (data) => {
        setMessages((prev) => [...prev, `Friend: ${data}`]);
      });
    });

    return () => {
      newPeer.destroy();
      setPeer(null);
    };
  }, []);

  const connectToPeer = () => {
    if (!remotePeerId) {
      toast.warn("Please enter a friend's ID.");
      return;
    }
    const connection = peer.connect(remotePeerId);
    setConn(connection);
    connection.on("open", () => {
      toast.success("Connected to your friend!");
      connection.on("data", (data) => {
        setMessages((prev) => [...prev, `Friend: ${data}`]);
      });
    });
  };

  const sendMessage = () => {
    if (!conn || !conn.open) {
      toast.warn("Not connected. Please connect first.");
      return;
    }
    if (!message) return;
    conn.send(message);
    setMessages((prev) => [...prev, `You: ${message}`]);
    setMessage("");
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (messages.length > 0 || conn) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [messages, conn]);

  return (
    <TpcLayout title="Chat">
      <Card>
        <div
          className={`mb-4 flex flex-wrap items-center justify-center gap-2 transition-opacity ${
            peerId ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-sm text-zinc-400">
            Your ID: <span className="font-mono text-zinc-200">{peerId}</span>
          </p>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(peerId);
              toast.info("ID copied to clipboard");
            }}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
          >
            <Copy size={12} />
            Copy
          </button>
        </div>

        <p className="mb-4 text-sm text-amber-400/90">
          Uses public signaling (0.peerjs.com) and STUN only. Some networks may
          block connections; metadata may be visible to third parties.
        </p>

        <p className="mb-4 text-sm text-zinc-500">
          Status: {peerId ? "Ready" : "Loading…"}
        </p>

        <input
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
          placeholder="Enter friend's ID"
          className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
        />

        <Button onClick={connectToPeer} className="mb-6 w-full">
          Connect
        </Button>

        <div className="mb-4 flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>

        <div className="max-h-80 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 p-3">
          {messages.length === 0 ? (
            <p className="text-center text-sm text-zinc-600">No messages yet</p>
          ) : (
            messages.map((msg, index) => (
              <p
                key={index}
                className="rounded-md px-2 py-1.5 text-sm text-zinc-300 odd:bg-zinc-900"
              >
                {msg}
              </p>
            ))
          )}
        </div>
      </Card>
    </TpcLayout>
  );
};

export default Chat;

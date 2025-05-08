import React, { useState, useEffect } from "react";
import Peer from "peerjs";

const Chat = () => {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [conn, setConn] = useState(null);
  const [messages, setMessages] = useState([]);

  // Initialize PeerJS object and set up event listeners
  useEffect(() => {
    const newPeer = new Peer({
      host: "0.peerjs.com",
      port: 443,
      secure: true,
      config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }], // STUN server to find public IP
      },
    });

    newPeer.on("open", (id) => {
      // When the peer is open, set the peer ID
      setPeerId(id);
      setPeer(newPeer);
    });

    newPeer.on("connection", (connection) => {
      // When a connection is made, set the connection and listen for incoming messages
      alert("Connected to a friend!");
      setConn(connection);
      connection.on("data", (data) => {
        setMessages((prev) => [...prev, `Friend: ${data}`]);
      });
    });

    return () => {
      newPeer.destroy(); // Clean up the PeerJS instance when the component unmounts
      setPeer(null);
    };
  }, []);

  // Connect to another peer
  const connectToPeer = () => {
    // Check if the peer ID is valid and establish a connection
    if (!remotePeerId) {
      alert("Please enter a friend’s ID.");
      return;
    }
    const connection = peer.connect(remotePeerId);
    setConn(connection);
    connection.on("open", () => {
      // When the connection is open, listen for incoming messages
      connection.on("data", (data) => {
        setMessages((prev) => [...prev, `Friend: ${data}`]);
      });
    });
    alert("Connected to your friend!");
  };

  // Send message
  const sendMessage = () => {
    if (!conn || !conn.open) {
      alert("Not connected to a peer. Please connect first.");
      return;
    }
    if (!message) {
      return;
    }
    conn.send(message); // Send the message to the connected peer
    setMessages((prev) => [...prev, `You: ${message}`]); // Add the message to the local messages array
    setMessage(""); // Clear the input field
  };

  const [message, setMessage] = useState("");

  // Add beforeunload event to warn about losing chat
  useEffect(() => {
    // Only trigger if there are messages or an active connection
    const handleBeforeUnload = (event) => {
      if (messages.length > 0 || conn) {
        // Standard way to trigger the browser's confirmation dialog
        event.preventDefault();
        event.returnValue = ""; // Required for modern browsers to show the dialog
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [messages, conn]); // Re-run if messages or connection changes

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-teal-400 mb-4 text-center">
          Truly Private Messenger
        </h1>
        <div
          className={`${
            peerId.length < 1 ? "opacity-0" : "opacity-100"
          } flex flex-row gap-2 mb-2 items-center justify-center transition-all duration-300`}
        >
          <p className="text-gray-300">Your ID: {peerId}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(peerId);
              alert("ID copied to clipboard!");
            }}
            className="text-white p-0.5 bg-gray-500 rounded border border-black hover:bg-gray-600 hover:p-1 transition-all duration-300"
          >
            Copy
          </button>
        </div>
        <p className="text-sm italic text-red-400 mb-4">
          Note: This app uses a public signaling server (0.peerjs.com) and STUN
          only. Some connections may fail without a TURN server, and metadata
          may be visible to third parties.
        </p>
        <div className={`text-white`}>
          Status:{` ${peerId.length < 1 ? "Loading" : "Ready"} `}
        </div>
        <input
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
          placeholder="Enter friend's ID"
          className="w-full bg-gray-700 text-gray-200 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={connectToPeer}
          className="w-full bg-teal-600 text-white font-semibold py-2 rounded-md mb-6 hover:bg-teal-700 transition"
        >
          Connect
        </button>
        <div className="flex gap-2 mb-4">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 bg-gray-700 text-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-teal-700 transition"
          >
            Send
          </button>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-md p-4 max-h-80 overflow-y-auto">
          {messages.map((msg, index) => (
            <p
              key={index}
              className="text-gray-200 p-2 odd:bg-gray-900 rounded-md"
            >
              {msg}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chat;

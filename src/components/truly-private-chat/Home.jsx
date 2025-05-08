import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-teal-400 mb-4 text-center">
          Truly Private Chat
        </h1>
        <p className="text-gray-300 mb-4">
          Truly Private Chat is a straightforward way to chat with a friend,
          right from your browser. Think of it like using walkie-talkies: your
          messages go directly to your friend, with no need for signups or
          sharing personal info. It’s simple, direct, and designed to keep
          things hassle-free.
        </p>

        <h2 className="text-xl font-semibold text-teal-400 mb-2 text-center">
          What You Can Do
        </h2>
        <ul className="list-disc pl-6 text-gray-200 mb-4">
          <li>
            Chat instantly by sharing unique IDs with your friend—no accounts
            needed.
          </li>
          <li>
            Send and receive messages in a clean, dark-themed chat window.
          </li>
          <li>
            Enjoy a smooth, easy-to-use interface that works on any device.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-teal-400 mb-2 text-center">
          Your Data, Your Control
        </h2>
        <p className="text-gray-200 mb-6">
          I, the creator, don’t handle or store any of your data—not your
          messages, IDs, or anything else. Your chats happen directly between
          your browser and your friend’s, using public helper services
          (0.peerjs.com and a Google STUN server) to connect you. These services
          see some connection details (like your ID or internet address), but I
          don’t have access to any of it, and they don't have access to any of
          your messages. Your conversation stays between you and your friend.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            to="/tpc/chat"
            className="bg-teal-600 text-white font-semibold py-4 px-2 hover:p-4 rounded-md hover:bg-teal-800 transition-all duration-200"
          >
            Start Chatting
          </Link>
          <Link
            to="/tpc/about"
            className="bg-teal-600 text-white font-semibold py-4 px-2 hover:p-4 rounded-md hover:bg-teal-800 transition-all duration-200"
          >
            Learn More About Privacy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

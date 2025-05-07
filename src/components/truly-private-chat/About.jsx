import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-teal-400 mb-4 text-center">
          About Truly Private Chat
        </h1>
        <p className="text-gray-300 mb-4">
          Welcome to Truly Private Chatr, where you can chat directly with a
          friend like you’re passing notes in class! Our app uses a cool tech
          called WebRTC to connect your browser straight to your friend’s, no
          middleman needed. But, like any tech, it’s got a few quirks. Let’s
          talk about what’s going on behind the scenes, especially the
          “metadata” stuff mentioned in the chat.
        </p>

        <h2 className="text-xl font-semibold text-teal-400 mb-2">
          What’s Metadata?
        </h2>
        <p className="text-gray-200 mb-4">
          Think of your messages as secret letters you send to your friend. The
          words in the letter are private, but the envelope—who sent it, who
          it’s going to, and where it’s mailed from—can be seen by the post
          office. That “envelope” info is metadata. In our app, it’s the details
          about how your browser connects to your friend’s, not the messages
          themselves.
        </p>

        <h2 className="text-xl font-semibold text-teal-400 mb-2">
          What Gets Shared?
        </h2>
        <p className="text-gray-200 mb-2">
          To make the chat work, we use a public helper service (0.peerjs.com)
          and a Google STUN server (stun.l.google.com) to play matchmaker for
          your browsers. Here’s what they might see:
        </p>
        <ul className="list-disc pl-6 text-gray-200 mb-4">
          <li>
            <strong>Your ID</strong>: Each of you gets a unique ID (like
            “peer123”). The helper service sees both IDs to connect you.
          </li>
          <li>
            <strong>Internet Address (IP)</strong>: This is like your browser’s
            “home address” on the internet. The helper service, STUN server, and
            your friend see it to set up the connection.
          </li>
          <li>
            <strong>Ports</strong>: These are like specific “doors” your browser
            uses to talk. They’re shared with the same folks.
          </li>
          <li>
            <strong>When You Connect</strong>: The helper service knows when you
            start chatting, like a postmark on your envelope.
          </li>
          <li>
            <strong>Connection Details</strong>: Technical bits (called ICE
            candidates) about how your browsers try to connect are shared via
            the helper service.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-teal-400 mb-2">
          What This Means for You
        </h2>
        <p className="text-gray-200 mb-4">
          Your messages are sent directly between browsers, wrapped in a secure
          layer (called DTLS), so the helper service and STUN server can’t read
          them. But they can see who’s talking (your IDs), where you’re roughly
          located (via your IP address, like your city), and when you’re
          chatting. It’s like the post office knowing you sent a letter from New
          York to Chicago, but not what’s inside.
        </p>
        <p className="text-gray-200 mb-4">
          Since we don’t use extra privacy features like end-to-end encryption,
          stick to chatting with trusted friends. Also, some Wi-Fis (like at
          school or a café) might block the direct connection because we only
          use a STUN server, not a TURN server (a kind of relay). If your chat
          doesn’t connect, try a different network or let us know!
        </p>

        <h2 className="text-xl font-semibold text-teal-400 mb-2">
          Keeping It Safe
        </h2>
        <p className="text-gray-200 mb-6">
          To keep things safer, use this app with friends you trust, and
          consider a VPN to hide your internet address. We’re using free public
          services to keep this simple, but that means they can see the
          “envelope” of your chat. If you want more privacy, we could add
          fancier features later—just say the word!
        </p>

        <button
          onClick={() => (window.location.href = "/")} // Adjust based on your routing
          className="w-full bg-teal-600 text-white font-semibold py-2 rounded-md hover:bg-teal-700 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default About;

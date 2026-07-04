import TpcLayout from "../../../design-system/components/TpcLayout";
import Card from "../../../design-system/components/Card";
import Button from "../../../design-system/components/Button";

const Home = () => {
  return (
    <TpcLayout title="Truly Private Chat">
      <Card>
        <h1 className="mb-4 text-2xl font-bold text-white">
          Peer-to-peer messaging
        </h1>
        <p className="mb-6 leading-relaxed text-zinc-400">
          Chat with a friend directly from your browser — no accounts, no
          sign-ups. Messages travel between browsers like a direct connection,
          not through a central chat server.
        </p>

        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          What you can do
        </h2>
        <ul className="mb-6 list-disc space-y-2 pl-5 text-zinc-300">
          <li>Share unique peer IDs to connect instantly</li>
          <li>Send and receive messages in a clean chat window</li>
          <li>Use on any device with a modern browser</li>
        </ul>

        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Your data, your control
        </h2>
        <p className="mb-8 leading-relaxed text-zinc-400">
          Messages are not stored by this app. Connections use public helper
          services (PeerJS signaling and a Google STUN server) to establish the
          link — they may see connection metadata, but not your message content.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button to="/tpc/chat">Start chatting</Button>
          <Button to="/tpc/about" variant="secondary">
            Privacy details
          </Button>
        </div>
      </Card>
    </TpcLayout>
  );
};

export default Home;

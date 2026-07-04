import { Link } from "react-router-dom";
import TpcLayout from "../../../design-system/components/TpcLayout";
import Card from "../../../design-system/components/Card";
import Button from "../../../design-system/components/Button";

const About = () => {
  return (
    <TpcLayout title="Privacy">
      <Card className="space-y-6">
        <div>
          <h1 className="mb-3 text-2xl font-bold text-white">
            About Truly Private Chat
          </h1>
          <p className="leading-relaxed text-zinc-400">
            Truly Private Chat connects your browser directly to a friend&apos;s
            using WebRTC. Your messages are the private contents; connection
            setup shares metadata — like who is talking and roughly where — with
            helper services.
          </p>
        </div>

        <section>
          <h2 className="mb-2 font-semibold text-white">What&apos;s metadata?</h2>
          <p className="leading-relaxed text-zinc-400">
            Think of messages as sealed letters. The post office can see sender,
            recipient, and postmark, but not the letter inside. Here, metadata
            is connection info — IDs, IP addresses, ports, and timing — not
            message bodies.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-white">What gets shared?</h2>
          <ul className="list-disc space-y-2 pl-5 text-zinc-300">
            <li>
              <strong className="text-zinc-200">Peer IDs</strong> — seen by the
              signaling server to match you with a friend
            </li>
            <li>
              <strong className="text-zinc-200">IP addresses & ports</strong> —
              used to establish the direct connection
            </li>
            <li>
              <strong className="text-zinc-200">Connection timing</strong> —
              when a session starts
            </li>
            <li>
              <strong className="text-zinc-200">ICE candidates</strong> —
              technical details about how browsers negotiate the link
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-white">What this means for you</h2>
          <p className="leading-relaxed text-zinc-400">
            Message content is encrypted in transit (DTLS) between browsers.
            Helper services can still see who connected and when. Some networks
            block direct peer connections without a TURN relay — if chat fails,
            try a different network.
          </p>
        </section>

        <div>
          <Button to="/tpc/home" variant="secondary">
            Back to home
          </Button>
        </div>
      </Card>
    </TpcLayout>
  );
};

export default About;

import usePageTitle from "../../design-system/hooks/usePageTitle";
import { Calendar, ExternalLink, MessageCircle } from "lucide-react";
import PageShell from "../../design-system/components/PageShell";
import Card from "../../design-system/components/Card";
import Button from "../../design-system/components/Button";

const links = [
  {
    label: "Schedule a call",
    description: "Book a 30-minute intro via Calendly.",
    href: "https://www.calendly.com/thomas-a-starks4",
    icon: Calendar,
    primary: true,
  },
  {
    label: "LinkedIn",
    description: "Connect professionally.",
    href: "https://www.linkedin.com/in/thomas-a-starks-jr",
    icon: MessageCircle,
    primary: false,
  },
  {
    label: "GitHub",
    description: "See my open-source work and projects.",
    href: "https://www.github.com/thomasstarks4",
    icon: ExternalLink,
    primary: false,
  },
];

export default function Contact() {
  usePageTitle(
    "Contact — Thomas Starks",
    "Get in touch with Thomas Starks for freelance, collaboration, or full-time opportunities.",
  );

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
          Contact
        </h1>
        <p className="mb-10 text-lg text-zinc-400">
          Open to freelance work, collaborations, and full-time opportunities.
          Reach out through any channel below.
        </p>

        <div className="space-y-4">
          {links.map(({ label, description, href, icon: Icon, primary }) => (
            <Card key={label} className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-2.5 text-zinc-300">
                  <Icon size={20} />
                </div>
                <div>
                  <h2 className="font-semibold text-white">{label}</h2>
                  <p className="mt-0.5 text-sm text-zinc-500">{description}</p>
                </div>
              </div>
              <Button
                href={href}
                variant={primary ? "primary" : "secondary"}
                size="sm"
                className="shrink-0"
              >
                Open
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

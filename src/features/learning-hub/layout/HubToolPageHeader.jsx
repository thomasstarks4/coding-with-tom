import { getToolGuide } from "../data/tool-guides";
import HubToolGuide from "./HubToolGuide";

export default function HubToolPageHeader({ toolId, actions, guideFooter }) {
  const guide = getToolGuide(toolId);

  if (!guide) {
    return null;
  }

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <header className="max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {guide.title}
          </h1>
          <p className="mt-2 text-base leading-relaxed text-slate-600 sm:text-lg">
            {guide.subtitle}
          </p>
        </header>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>

      <HubToolGuide toolId={toolId} footer={guideFooter} />
    </div>
  );
}

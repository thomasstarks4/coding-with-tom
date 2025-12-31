import { useMemo, useState } from "react";
import { toast } from "react-toastify";

const Tuner = ({ startersSelected, setStartersSelected }) => {
  const [localStarters, setLocalStarters] = useState(startersSelected);

  const entries = useMemo(() => Object.entries(localStarters), [localStarters]);
  const total = entries.length;
  const selected = useMemo(
    () => entries.filter(([, v]) => v.isShown).length,
    [entries]
  );

  const handleCheckboxChange = (key) => {
    setLocalStarters((prev) => ({
      ...prev,
      [key]: { ...prev[key], isShown: !prev[key].isShown },
    }));
  };

  const selectAll = () => {
    setLocalStarters((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([k, v]) => [k, { ...v, isShown: true }])
      )
    );
  };

  const clearAll = () => {
    setLocalStarters((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([k, v]) => [k, { ...v, isShown: false }])
      )
    );
  };

  const saveChanges = () => {
    setStartersSelected(localStarters);
    toast.success("Tuner settings saved successfully!");
  };

  return (
    <div className="mx-auto max-w-3xl p-6 sm:p-8">
      <div className="rounded-xl bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] p-6 shadow-lg sm:p-8">
        {/* Title */}
        <h1 className="relative mx-auto inline-block text-2xl font-bold text-gray-800 sm:text-3xl">
          Tuner
          <span className="absolute left-1/2 top-full block h-[3px] w-1/2 -translate-x-1/2 rounded bg-blue-500 transition-all duration-300 hover:w-full" />
        </h1>
        <h3 className="mt-3 text-base font-medium text-gray-700 sm:text-lg">
          Pick which sentence starters to use!
        </h3>

        {/* Toolbar */}
        <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="text-sm text-gray-600">
            Selected:{" "}
            <span className="font-semibold text-gray-800">{selected}</span> /{" "}
            {total}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="rounded-md border border-blue-500 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={saveChanges}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Save Tuner Settings
            </button>
          </div>
        </div>

        {/* List */}
        <div className="mt-6 flex flex-col items-stretch gap-4">
          {entries.map(([key, starter]) => (
            <div
              key={key}
              className="flex w-full items-center justify-between gap-4 rounded-lg bg-white p-4 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:px-6"
            >
              {/* Left side: checkbox + text */}
              <div className="flex w-full flex-1 items-center gap-3 md:gap-4">
                <input
                  id={`checkbox-${key}`}
                  type="checkbox"
                  checked={starter.isShown}
                  onChange={() => handleCheckboxChange(key)}
                  className="h-5 w-5 accent-blue-500"
                />
                <label
                  htmlFor={`checkbox-${key}`}
                  className="flex-1 text-left text-base text-gray-700 sm:text-lg"
                >
                  {starter.text}
                </label>
              </div>

              {/* Right side: partner type */}
              <span className="shrink-0 text-sm text-gray-500 md:text-base">
                ({starter.partnerType})
              </span>
            </div>
          ))}
        </div>

        {/* Mobile save button (duplicated for convenience at bottom on small screens) */}
        <div className="mt-6 sm:hidden">
          <button
            type="button"
            onClick={saveChanges}
            className="w-full rounded-lg bg-blue-500 px-4 py-3 text-base font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Save Tuner Settings
          </button>
        </div>
      </div>

      {/* Reduced motion preference */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Tuner;

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
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
    <motion.div
      className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 p-8 rounded-2xl shadow-xl mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-white text-center mb-2">
            🎚️ Sentence Tuner
          </h1>
          <p className="text-white/90 text-center text-lg">
            Customize which sentence starters to use!
          </p>
        </motion.div>

        <motion.div
          className="rounded-2xl bg-white shadow-xl p-6 sm:p-8 border border-gray-200"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
            <motion.div
              className="text-center sm:text-left"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-sm text-gray-600 mb-1">
                Selection Progress
              </div>
              <div className="text-2xl font-bold">
                <span className="text-green-600">{selected}</span>
                <span className="text-gray-400"> / {total}</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-teal-500 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(selected / total) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center gap-2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                type="button"
                onClick={selectAll}
                className="rounded-lg border-2 border-green-500 px-4 py-2 text-sm font-semibold text-green-600 hover:bg-green-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✓ Select All
              </motion.button>
              <motion.button
                type="button"
                onClick={clearAll}
                className="rounded-lg border-2 border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✗ Clear All
              </motion.button>
              <motion.button
                type="button"
                onClick={saveChanges}
                className="rounded-lg bg-gradient-to-r from-green-600 to-teal-600 px-6 py-2 text-sm font-bold text-white shadow-md hover:from-green-700 hover:to-teal-700 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                💾 Save Settings
              </motion.button>
            </motion.div>
          </div>

          {/* List */}
          <div className="flex flex-col items-stretch gap-3">
            {entries.map(([key, starter], index) => (
              <motion.div
                key={key}
                className={`flex w-full items-center justify-between gap-4 rounded-xl p-4 border-2 transition-all duration-300 cursor-pointer ${
                  starter.isShown
                    ? "bg-gradient-to-r from-green-50 to-teal-50 border-green-300 hover:border-green-400"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300"
                }`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.03 }}
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={() => handleCheckboxChange(key)}
              >
                {/* Left side: checkbox + text */}
                <div className="flex w-full flex-1 items-center gap-3 md:gap-4">
                  <motion.input
                    id={`checkbox-${key}`}
                    type="checkbox"
                    checked={starter.isShown}
                    onChange={() => handleCheckboxChange(key)}
                    className="h-6 w-6 rounded accent-green-600 cursor-pointer"
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label
                    htmlFor={`checkbox-${key}`}
                    className="flex-1 text-left text-base font-medium text-gray-800 cursor-pointer sm:text-lg"
                  >
                    {starter.text}
                  </label>
                </div>

                {/* Right side: partner type badge */}
                <span className="shrink-0 text-xs sm:text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                  {starter.partnerType}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Mobile save button (duplicated for convenience) */}
          <motion.div
            className="mt-6 sm:hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.button
              type="button"
              onClick={saveChanges}
              className="w-full rounded-lg bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4 text-base font-bold text-white shadow-lg hover:from-green-700 hover:to-teal-700 transition-all"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              💾 Save Settings
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Tuner;

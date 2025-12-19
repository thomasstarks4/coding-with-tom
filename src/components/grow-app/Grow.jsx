import React, { useEffect, useState } from "react";

function Grow() {
  //Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "" });

  useEffect(() => {
    if (!toast.show) return;
    const id = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
    return () => clearTimeout(id);
  }, [toast.show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Minimal: treat every submit as a success for UI/demo purposes
    setToast({ show: true, msg: "Login successful — welcome!" });
    setEmail("");
    setPassword("");
  };

  const Login = () => {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{
          background: "linear-gradient(180deg,#3b2b23 0%, #6b4a36 100%)",
        }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-8 relative"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))",
            boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
              Grow
            </h1>
            <p className="mt-1 text-sm text-green-200">
              Cannabis garden dashboard — sign in
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-green-50">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg px-4 py-2 bg-[#f6f4f1] text-[#1f2937] placeholder-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-[#2f9e44]"
                placeholder="you@domain.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-50">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg px-4 py-2 bg-[#f6f4f1] text-[#1f2937] placeholder-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-[#2f9e44]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-[#2f9e44] to-[#6bd36a] transform hover:scale-[1.02] transition duration-200 shadow-lg"
              style={{ boxShadow: "0 6px 20px rgba(47,158,68,0.25)" }}
            >
              Sign in
            </button>
          </form>

          {/* Minimalistic, built-in toast */}
          <div
            className={`fixed top-6 right-6 z-50 transform transition-all duration-300 ${
              toast.show
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 -translate-y-4 scale-95"
            }`}
            aria-live="polite"
          >
            <div
              className="max-w-sm w-full bg-[#2f9e44] text-white rounded-lg px-4 py-3 shadow-xl border border-white/10"
              style={{ boxShadow: "0 8px 30px rgba(47,158,68,0.18)" }}
            >
              <div className="font-semibold">{toast.msg}</div>
            </div>
          </div>

          {/* Decorative glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 rounded-2xl"
            style={{
              background:
                "radial-gradient(circle at 20% 10%, rgba(47,158,68,0.14), transparent 12%), radial-gradient(circle at 90% 80%, rgba(107,74,54,0.08), transparent 20%)",
            }}
          />
        </div>
      </div>
    );
  };

  return <Login />;
}

export default Grow;

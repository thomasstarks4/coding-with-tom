import { useState, useId, memo } from "react";
import { signInAndStore, registerThenSignIn } from "./api";

const VIEWS = {
  SIGN_IN: "signIn",
  REGISTER: "register",
  PICK: "pick",
  APP: "app",
};

export default function ProgressTracker({ initialView = VIEWS.PICK }) {
  const [view, setView] = useState(initialView);

  const onSignIn = async ({ username, password }) => {
    try {
      // username field is the email for login
      const user = await signInAndStore({ email: username, password });
      console.log("Signed in as:", user);
      // Optionally verify with /me:
      // const me = await api.me();
      // console.log("me:", me);
    } catch (e) {
      alert(e.message || "Sign-in failed");
    }
  };

  const onRegister = async ({ username, email, password }) => {
    try {
      const user = await registerThenSignIn({ username, email, password });
      console.log("Registered and signed in:", user);
    } catch (e) {
      alert(e.message || "Registration failed");
      console.log(e);
    }
  };
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center p-6">
      <header className="max-w-md w-full">
        <h1 className="text-3xl text-white font-extrabold text-center mb-6">
          Progress Tracker
        </h1>
      </header>

      <main className="w-full max-w-md">
        {view === VIEWS.SIGN_IN && (
          <SignInForm
            onBack={() => setView(VIEWS.PICK)}
            onSubmit={onSignIn}
            onSwap={() => setView(VIEWS.REGISTER)}
          />
        )}
        {view === VIEWS.REGISTER && (
          <RegisterForm
            onBack={() => setView(VIEWS.PICK)}
            onSubmit={onRegister}
            onSwap={() => setView(VIEWS.SIGN_IN)}
          />
        )}
        {view === VIEWS.PICK && (
          <PickView
            onSignIn={() => setView(VIEWS.SIGN_IN)}
            onRegister={() => setView(VIEWS.REGISTER)}
          />
        )}
      </main>
    </div>
  );
}

/** Shared UI **/
const Card = ({ title, children, footer }) => (
  <div className="bg-slate-800/70 backdrop-blur rounded-2xl shadow-lg p-4 sm:p-6 text-white">
    <div className="mb-4 text-lg sm:text-xl font-bold text-center bg-slate-700 rounded-lg py-2">
      {title}
    </div>
    <div className="space-y-3">{children}</div>
    {footer ? <div className="pt-4">{footer}</div> : null}
  </div>
);

const Field = ({ label, htmlFor, children, hint }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={htmlFor} className="text-sm font-medium text-slate-100">
      {label}
    </label>
    {children}
    {hint ? <p className="text-xs text-slate-300">{hint}</p> : null}
  </div>
);

const Input = memo(function Input({ className = "", ...props }) {
  return (
    <input
      className={
        "w-full rounded-lg bg-slate-900/80 text-white placeholder-slate-400 text-center py-2 px-3 outline-none ring-1 ring-slate-600 focus:ring-2 focus:ring-blue-500 transition " +
        className
      }
      {...props}
    />
  );
});

function PasswordField({
  id,
  value,
  onChange,
  show,
  setShow,
  placeholder,
  autoComplete,
}) {
  const btnId = useId();
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-describedby={btnId}
      />
      <button
        id={btnId}
        type="button"
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
        onClick={() => setShow((s) => !s)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs rounded-md bg-slate-600 hover:bg-slate-500 active:scale-95 px-2 py-1"
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}

/** Screens **/
function PickView({ onSignIn, onRegister }) {
  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={onRegister}
        className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[.98] text-white font-semibold rounded-xl px-4 py-2 transition"
      >
        Register
      </button>
      <button
        type="button"
        onClick={onSignIn}
        className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[.98] text-white font-semibold rounded-xl px-4 py-2 transition"
      >
        Sign In
      </button>
    </div>
  );
}

function SignInForm({ onSubmit, onSwap, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.({ username, password });
  };

  return (
    <Card
      title="Sign In"
      footer={
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBack}
            className="text-slate-300 hover:text-white text-sm"
          >
            Back
          </button>
          <div className="text-sm">
            Need an account?{" "}
            <button
              type="button"
              onClick={onSwap}
              className="underline decoration-dotted underline-offset-4 hover:text-white"
            >
              Register
            </button>
          </div>
        </div>
      }
    >
      <form onSubmit={submit} className="space-y-3">
        <Field label="Email" htmlFor="si-username">
          <Input
            id="si-username"
            name="username"
            placeholder="Enter your email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </Field>
        <Field label="Password" htmlFor="si-password">
          <PasswordField
            id="si-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            show={show}
            setShow={setShow}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </Field>
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-400 active:scale-[.98] text-black font-semibold rounded-xl px-4 py-2 transition"
          >
            Continue
          </button>
        </div>
      </form>
    </Card>
  );
}

function RegisterForm({ onSubmit, onSwap, onBack }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.({ username, email, password });
  };

  return (
    <Card
      title="Register"
      footer={
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBack}
            className="text-slate-300 hover:text-white text-sm"
          >
            Back
          </button>
          <div className="text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwap}
              className="underline decoration-dotted underline-offset-4 hover:text-white"
            >
              Sign in
            </button>
          </div>
        </div>
      }
    >
      <form onSubmit={submit} className="space-y-3">
        <Field label="Username" htmlFor="rg-username">
          <Input
            id="rg-username"
            name="username"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            minLength={3}
            required
          />
        </Field>
        <Field label="Email" htmlFor="rg-email">
          <Input
            id="rg-email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </Field>
        <Field
          label="Password"
          htmlFor="rg-password"
          hint="At least 8 characters recommended."
        >
          <PasswordField
            id="rg-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            show={show}
            setShow={setShow}
            placeholder="Create a password"
            autoComplete="new-password"
          />
        </Field>
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-400 active:scale-[.98] text-black font-semibold rounded-xl px-4 py-2 transition"
          >
            Create account
          </button>
        </div>
      </form>
    </Card>
  );
}

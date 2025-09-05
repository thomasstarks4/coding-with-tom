import { useState, useId, memo, useEffect } from "react";
import { signInAndStore, registerThenSignIn, projectsApi } from "./api";

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
      localStorage.setItem("username", user.username);
      setView("app");
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
      localStorage.setItem("username", user.username);
      setView(VIEWS.APP);
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
        {view === VIEWS.APP && <Dashboard />}
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

// Inputs
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

// Sign In Form
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

// Register Form
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

export function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null); // null=list view, id=detail
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newNotes, setNewNotes] = useState("");

  // load all projects (with tasks)
  useEffect(() => {
    (async () => {
      try {
        const { projects } = await projectsApi.list();
        setProjects(projects || []);
      } catch (e) {
        setError(e.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // CRUD helpers (shared by both views)
  async function createProject(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const { project } = await projectsApi.create({
        title: newTitle.trim(),
        notes: newNotes.trim() || null,
      });
      setProjects((p) => [project, ...p]);
      setNewTitle("");
      setNewNotes("");
      setShowCreate(false);
      // stay on Dashboard list per your spec
    } catch (e) {
      setError(e.message || "Create failed");
    }
  }

  async function saveProject(p) {
    try {
      const { project } = await projectsApi.update(p.id, {
        title: p.title,
        notes: p.notes ?? null,
      });
      setProjects((list) =>
        list.map((x) => (x.id === p.id ? { ...x, ...project } : x))
      );
    } catch (e) {
      setError(e.message || "Save failed");
    }
  }

  async function deleteProject(id) {
    try {
      await projectsApi.remove(id);
      setProjects((list) => list.filter((p) => p.id !== id));
      setSelectedId(null); // if we were in detail, go back to Dashboard
    } catch (e) {
      setError(e.message || "Delete failed");
    }
  }

  async function addTask(pid, title) {
    if (!title.trim()) return;
    const { task } = await projectsApi.addTask(pid, { title: title.trim() });
    setProjects((list) =>
      list.map((p) =>
        p.id === pid ? { ...p, tasks: [...(p.tasks || []), task] } : p
      )
    );
  }

  async function patchTask(tid, patch, pid) {
    await projectsApi.updateTask(tid, patch);
    setProjects((list) =>
      list.map((p) =>
        p.id === pid
          ? {
              ...p,
              tasks: (p.tasks || []).map((t) =>
                t.id === tid ? { ...t, ...patch } : t
              ),
            }
          : p
      )
    );
  }

  async function removeTask(tid, pid) {
    await projectsApi.deleteTask(tid);
    setProjects((list) =>
      list.map((p) =>
        p.id === pid
          ? {
              ...p,
              tasks: (p.tasks || []).filter((t) => t.id !== tid),
            }
          : p
      )
    );
  }

  // ===== Views =====
  // Detail view: show only the selected project (and a back button)
  if (selectedId != null) {
    const proj = projects.find((p) => p.id === selectedId);
    return (
      <div className="max-w-3xl w-full mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedId(null)}
            className="text-sm text-slate-300 hover:text-white underline underline-offset-4"
          >
            ← Go back to Dashboard
          </button>
          <span className="text-slate-200">
            Welcome, <b>{localStorage.getItem("username") || "friend"}</b>!
          </span>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-200 border border-red-500/40 rounded-lg p-3">
            {error}{" "}
            <button onClick={() => setError("")} className="underline ml-2">
              dismiss
            </button>
          </div>
        )}

        {proj ? (
          <ProjectCard
            project={proj}
            onChange={(next) =>
              setProjects((list) =>
                list.map((x) => (x.id === proj.id ? next : x))
              )
            }
            onSave={saveProject}
            onDelete={() => deleteProject(proj.id)}
            onAddTask={(title) => addTask(proj.id, title)}
            onPatchTask={(tid, patch) => patchTask(tid, patch, proj.id)}
            onRemoveTask={(tid) => removeTask(tid, proj.id)}
          />
        ) : (
          <div className="text-slate-300">Project not found.</div>
        )}
      </div>
    );
  }

  // Dashboard list view: Create button (collapsible form) + names of projects
  return (
    <div className="max-w-3xl w-full mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-slate-200">
          Welcome, <b>{localStorage.getItem("username") || "friend"}</b>!
        </span>
        <button
          onClick={() => {
            localStorage.removeItem("pt_token");
            window.location.reload();
          }}
          className="text-sm text-slate-300 hover:text-white underline underline-offset-4"
        >
          Sign out
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 text-red-200 border border-red-500/40 rounded-lg p-3">
          {error}{" "}
          <button onClick={() => setError("")} className="underline ml-2">
            dismiss
          </button>
        </div>
      )}

      {/* Create New Project (collapsed by default) */}
      <div className="bg-slate-800/70 rounded-2xl p-4 sm:p-6 shadow">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Dashboard</h2>
          <button
            onClick={() => setShowCreate((s) => !s)}
            className="bg-green-500 hover:bg-green-400 active:scale-[.98] text-black font-semibold rounded-xl px-4 py-2"
          >
            {showCreate ? "Close" : "Create New Project"}
          </button>
        </div>

        {showCreate && (
          <form onSubmit={createProject} className="grid gap-3 mt-4">
            <input
              className="rounded-lg bg-slate-900/80 text-white placeholder-slate-400 py-2 px-3 ring-1 ring-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Project title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <textarea
              className="rounded-lg bg-slate-900/80 text-white placeholder-slate-400 py-2 px-3 ring-1 ring-slate-600 focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
              placeholder="Notes (optional)"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
            />
            <div>
              <button className="bg-green-500 hover:bg-green-400 active:scale-[.98] text-black font-semibold rounded-xl px-4 py-2">
                Create project
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Project names only */}
      <div className="bg-slate-800/70 rounded-2xl p-4 sm:p-6 shadow">
        <h3 className="text-white font-semibold mb-3">Your Projects</h3>
        {loading ? (
          <div className="text-slate-300">Loading…</div>
        ) : projects.length === 0 ? (
          <div className="text-slate-300">No projects yet.</div>
        ) : (
          <ul className="divide-y divide-slate-700/60">
            {projects.map((p) => (
              <li key={p.id}>
                <button
                  className="w-full text-left py-3 hover:bg-slate-700/40 rounded-lg px-2 text-slate-100"
                  onClick={() => setSelectedId(p.id)}
                  title="Open project"
                >
                  {p.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  onChange,
  onSave,
  onDelete,
  onAddTask,
  onPatchTask,
  onRemoveTask,
}) {
  const [title, setTitle] = useState(project.title);
  const [notes, setNotes] = useState(project.notes ?? "");
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    setTitle(project.title);
    setNotes(project.notes ?? "");
  }, [project.id]);

  const dirty =
    title !== project.title || (notes ?? "") !== (project.notes ?? "");

  return (
    <div className="bg-slate-800/70 rounded-2xl p-4 sm:p-6 shadow">
      <div className="flex items-center gap-2">
        <input
          className="flex-1 rounded-lg bg-slate-900/80 text-white placeholder-slate-400 py-2 px-3 ring-1 ring-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => dirty && onSave({ ...project, title, notes })}
        />
        <button
          onClick={() => dirty && onSave({ ...project, title, notes })}
          disabled={!dirty}
          className={
            "px-3 py-2 rounded-lg text-sm font-semibold " +
            (dirty
              ? "bg-blue-500 text-black hover:bg-blue-400"
              : "bg-slate-700 text-slate-300 cursor-not-allowed")
          }
        >
          Save
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-2 rounded-lg text-sm font-semibold bg-red-500 text-black hover:bg-red-400"
        >
          Delete
        </button>
      </div>

      <div className="mt-3">
        <textarea
          className="w-full rounded-lg bg-slate-900/80 text-white placeholder-slate-400 py-2 px-3 ring-1 ring-slate-600 focus:ring-2 focus:ring-blue-500 outline-none min-h-[90px]"
          placeholder="Notes…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => dirty && onSave({ ...project, title, notes })}
        />
      </div>

      {/* Tasks */}
      <div className="mt-4 space-y-2">
        {(project.tasks || []).map((t) => (
          <div key={t.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!t.done}
              onChange={(e) =>
                onPatchTask(t.id, { done: e.target.checked ? 1 : 0 })
              }
              className="h-4 w-4 accent-green-500"
            />
            <input
              className={
                "flex-1 rounded-lg bg-slate-900/80 text-white py-1 px-2 ring-1 ring-slate-600 focus:ring-2 focus:ring-blue-500 outline-none " +
                (t.done ? "line-through text-slate-400" : "")
              }
              defaultValue={t.title}
              onBlur={(e) => {
                const v = e.target.value.trim();
                if (v && v !== t.title) onPatchTask(t.id, { title: v });
              }}
            />
            <button
              onClick={() => onRemoveTask(t.id)}
              className="text-slate-300 hover:text-red-300 text-sm"
              title="Delete task"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Add task */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onAddTask(newTask);
            setNewTask("");
          }}
          className="flex items-center gap-2 pt-2"
        >
          <input
            className="flex-1 rounded-lg bg-slate-900/80 text-white placeholder-slate-400 py-1.5 px-2 ring-1 ring-slate-600 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="New task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button className="px-3 py-1.5 rounded-lg bg-green-500 text-black hover:bg-green-400 font-semibold">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

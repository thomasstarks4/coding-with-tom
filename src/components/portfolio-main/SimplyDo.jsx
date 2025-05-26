import { useState } from "react";

export default function TodoApp() {
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleAddTask = () => {
    const trimmedTask = taskInput.trim();
    if (!trimmedTask) {
      alert("You haven't entered anything yet.");
      return;
    }
    setTasks([...tasks, { text: trimmedTask, id: Date.now() }]);
    setTaskInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTask();
    }
  };

  const handleSaveList = () => {
    if (tasks.length === 0) {
      alert("No tasks to save.");
      return;
    }
    const taskText = tasks.map((task) => task.text).join("\n");
    const blob = new Blob([taskText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "todo_list.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearList = () => {
    if (tasks.length === 0) {
      alert("The list is already empty!");
      return;
    }
    if (
      window.confirm(
        "Are you sure you want to clear the list? This action cannot be undone."
      )
    ) {
      setTasks([]);
      alert("Time to start fresh! :)");
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mx-auto w-full ">
      <h1 className="text-3xl font-bold text-center mb-2 text-white">
        Welcome to SimplyDo!
      </h1>
      <p className="text-center mb-6">
        Add tasks, check them off, and keep track of your progress.
      </p>
      <div className="flex flex-row mb-4 w-full ">
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's next on your list?"
          className="ml-auto p-2 rounded-l-md bg-gray-100 text-gray-800 border border-gray-100 focus:outline-none "
        />
        <button
          onClick={handleAddTask}
          className="p-2 bg-teal-500 text-white rounded-r-md hover:bg-teal-600 active:bg-teal-500 transform active:scale-95 transition-all mr-auto"
        >
          Add to list!
        </button>
      </div>
      <div className="flex justify-between mb-4">
        <button
          onClick={handleSaveList}
          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:bg-blue-600 transform hover:scale-105 active:scale-95 transition-all"
        >
          Save List
        </button>
        <button
          onClick={handleClearList}
          className="p-2 bg-gray-900 text-white rounded-md hover:bg-red-600 active:bg-gray-900 transform hover:scale-105 active:scale-95 transition-all"
        >
          Clear List
        </button>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center bg-gray-700 p-3 rounded-md border border-gray-600"
          >
            <input type="checkbox" className="mr-2" id={`checkbox${task.id}`} />
            <span>{task.text}</span>
            <button
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this task?")
                ) {
                  const tempTasks = tasks;
                  tempTasks.splice(tasks.indexOf(task), 1);
                  setTasks([...tempTasks]);
                }
              }}
              className="ml-auto text-white text-sm bg-red-600 p-2 hover:p-2.5 rounded-xl transfrom-all duration-300 ease-in-out"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


import './App.css';

import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = filter === "all"
          ? await axios.get("http://localhost:5000/tasks")
          : await axios.get(`http://localhost:5000/tasks/filter?status=${filter}`);
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, [filter]);

 
  const addTask = async () => {
    if (!newTask) return;
    try {
      const res = await axios.post("http://localhost:5000/tasks", { description: newTask });
      setTasks([...tasks, res.data]);
      setNewTask("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

 
  const toggleCompletion = async (id, completed) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, { completed: !completed });
      setTasks(tasks.map(task => task.id === id ? { ...task, completed: !completed } : task));
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

 
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>

    
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add a new task"
      />
      <button onClick={addTask}>Add Task</button>

     
      <div>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("incomplete")}>Incomplete</button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ textDecoration: task.completed ? "line-through" : "none" }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompletion(task.id, task.completed)}
            />
            {task.description}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

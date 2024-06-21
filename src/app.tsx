import React, { useState, useRef, useEffect } from "react";
import "./app.css";

interface Task {
  id: string;
  title: string;
  isDone: boolean;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputTask, setInputTask] = useState<string>("");
  const [filter, setFilter] = useState<string>("todos");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("https://my-json-server.typicode.com/EnkiGroup/DesafioReactFrontendJunior2024/todos");
      if (!response.ok) {
        throw new Error("Não foi possível recuperar as tarefas");
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Erro ao recuperar as tarefas:", error);
    }
  };

  const addTask = () => {
    const title = inputTask.trim();
    if (title !== "") {
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        title: title,
        isDone: false,
      };
      setTasks([newTask, ...tasks]);
      setInputTask("");
    }
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, isDone: !task.isDone } : task
    );
    setTasks(updatedTasks);
  };

  const removeTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const clearCompleted = () => {
    const remainingTasks = tasks.filter((task) => !task.isDone);
    setTasks(remainingTasks);
  };

  const markAllCompleted = () => {
    const updatedTasks = tasks.map((task) => ({
      ...task,
      isDone: true,
    }));
    setTasks(updatedTasks);
  };

  const countItemsLeft = () => {
    return tasks.filter((task) => !task.isDone).length;
  };

  const filteredTasks = () => {
    switch (filter) {
      case "ativos":
        return tasks.filter((task) => !task.isDone);
      case "completos":
        return tasks.filter((task) => task.isDone);
      default:
        return tasks;
    }
  };

  const getFilterButtonClass = (currentFilter: string) => {
    return filter === currentFilter ? "active" : "";
  };

  return (
    <div className="back">
      <div className="principal">
        <section className="title">
          <h1>Desafio React Front-end (Junior)</h1>
        </section>
      </div>

      <div className="todo-container">
        <h1 className="title-list">Lista de Tarefas</h1>
        <div className="input-container">
          <input
            ref={inputRef}
            className="title-pesquisa"
            placeholder="O que precisa ser feito?"
            value={inputTask}
            onChange={(e) => setInputTask(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addTask();
              }
            }}
          />
          <button className="alternar-button" onClick={markAllCompleted}>
            ▼
          </button>
        </div>

        <ul className="tasks-list">
          {filteredTasks().map((task) => (
            <li key={task.id} className={task.isDone ? "task-item completed" : "task-item"}>
              <div className="task-details">
                <input
                  type="checkbox"
                  checked={task.isDone}
                  onChange={() => toggleTask(task.id)}
                />
                <span
                  onDoubleClick={() => {
                    const newTitle = prompt("Edit task title:", task.title);
                    if (newTitle) {
                      setTasks(tasks.map(t => t.id === task.id ? { ...t, title: newTitle } : t));
                    }
                  }}
                >
                  {task.title}
                </span>
              </div>
              <button className="remove-button" onClick={() => removeTask(task.id)}>
                X
              </button>
            </li>
          ))}
        </ul>

        <div className="container-central">
          <span className="contagem-tarefas">
            <strong>{countItemsLeft()}</strong> itens restantes
          </span>

          <div className="filtros">
            <button
              className={`filtro-todos ${getFilterButtonClass("todos")}`}
              onClick={() => setFilter("todos")}
            >
              Todos
            </button>
            <button
              className={`filtro-ativos ${getFilterButtonClass("ativos")}`}
              onClick={() => setFilter("ativos")}
            >
              Ativos
            </button>
            <button
              className={`filtro-completos ${getFilterButtonClass("completos")}`}
              onClick={() => setFilter("completos")}
            >
              Completos
            </button>
          </div>

          <button className="limpar-todos" onClick={clearCompleted}>
            Limpar completos ({tasks.filter((task) => task.isDone).length})
          </button>
        </div>
      </div>
    </div>
  );
}

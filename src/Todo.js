// src/Todo.js
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import "./Todo.css";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState("");
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState(null);

  // Fetch todos from Firestore
  const fetchTodos = async () => {
    try {
      const todosCollection = collection(db, "todos");
      const todosSnapshot = await getDocs(todosCollection);
      const todosList = todosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(todosList);
    } catch (error) {
      setError("Failed to fetch todos.");
      console.error(error.message);
    }
  };

  // Handle form submission for adding/updating todos
  const handleTodoSubmit = async (e) => {
    e.preventDefault();
    if (!todoText.trim()) {
      setError("Todo cannot be empty.");
      return;
    }

    const newTodo = { text: todoText, completed: false };
    try {
      const todosCollection = collection(db, "todos");
      if (editMode) {
        await updateDoc(doc(db, "todos", currentTodoId), newTodo);
        setTodos(
          todos.map((todo) =>
            todo.id === currentTodoId ? { ...todo, ...newTodo } : todo
          )
        );
      } else {
        const docRef = await addDoc(todosCollection, newTodo);
        setTodos([...todos, { id: docRef.id, ...newTodo }]);
      }
      resetForm();
    } catch (error) {
      setError(`Failed to ${editMode ? "update" : "add"} todo.`);
      console.error(error.message);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, "todos", id));
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      setError("Failed to delete todo.");
      console.error(error.message);
    }
  };

  // Toggle completion status of a todo
  const toggleTodoCompletion = async (id) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);
    const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };

    try {
      await updateDoc(doc(db, "todos", id), {
        completed: updatedTodo.completed,
      });
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      setError("Failed to toggle todo completion.");
      console.error(error.message);
    }
  };

  // Start editing a todo
  const startEditTodo = (todo) => {
    setEditMode(true);
    setCurrentTodoId(todo.id);
    setTodoText(todo.text);
  };

  // Reset form fields
  const resetForm = () => {
    setTodoText("");
    setEditMode(false);
    setCurrentTodoId(null);
    setError("");
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="todo-container">
      <header className="todo-header">
        <h2 className="todo-title">Your Todo List</h2>
      </header>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleTodoSubmit}>
        <input
          type="text"
          className="todo-input"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          placeholder={editMode ? "Edit your todo..." : "Add a new todo..."}
          required
        />
        <button type="submit" className="add-button">
          {editMode ? "Save Todo" : "Add Todo"}
        </button>
      </form>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li className="todo-item" key={todo.id}>
            <div className="todo-item-content">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodoCompletion(todo.id)} // Toggle completion on checkbox change
              />
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.text}
              </span>
              <div>
                <button
                  className="edit-button"
                  onClick={() => startEditTodo(todo)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>{" "}
                {/* Use the delete-button class */}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;

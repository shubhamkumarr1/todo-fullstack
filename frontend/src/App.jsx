
import { useEffect, useState } from 'react'

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${API_URL}/todos`)

      if (!response.ok) {
        throw new Error('Failed to fetch todos')
      }

      const data = await response.json()
      setTodos(data)
    } catch (error) {
      setError('Backend connection failed.')
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (event) => {
    event.preventDefault()

    if (!title.trim()) {
      setError('Please enter a task title.')
      return
    }

    if (title.trim().length > 100) {
      setError('Task title cannot exceed 100 characters.')
      return
    }

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add todo')
      }

      const newTodo = await response.json()

      setTodos((previousTodos) => [...previousTodos, newTodo])
      setTitle('')
      setError('')
    } catch (error) {
      setError('Unable to add task.')
    }
  }

  const toggleTodo = async (todo) => {
    try {
      const response = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: todo.title,
          completed: !todo.completed,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update todo')
      }

      const updatedTodo = await response.json()

      setTodos((previousTodos) =>
        previousTodos.map((item) =>
          item.id === updatedTodo.id ? updatedTodo : item
        )
      )

      setError('')
    } catch (error) {
      setError('Unable to update task.')
    }
  }

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete todo')
      }

      setTodos((previousTodos) =>
        previousTodos.filter((todo) => todo.id !== id)
      )

      setError('')
    } catch (error) {
      setError('Unable to delete task.')
    }
  }

  const startEditing = (todo) => {
    setEditingId(todo.id)
    setEditTitle(todo.title)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditTitle('')
  }

  const saveEdit = async (todo) => {
    if (!editTitle.trim()) {
      setError('Task title cannot be empty.')
      return
    }

    try {
      const response = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          completed: todo.completed,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to edit todo')
      }

      const updatedTodo = await response.json()

      setTodos((previousTodos) =>
        previousTodos.map((item) =>
          item.id === updatedTodo.id ? updatedTodo : item
        )
      )

      cancelEditing()
      setError('')
    } catch (error) {
      setError('Unable to edit task.')
    }
  }

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h1 className="text-primary fw-bold">Todo List App</h1>
        <p className="text-muted">
          Manage your daily tasks easily.
        </p>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">My Tasks</h5>
        </div>

        <div className="card-body">
          <form onSubmit={addTodo} className="d-flex gap-2 mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter a new task..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <button type="submit" className="btn btn-primary">
              Add Task
            </button>
          </form>

          {error && (
            <p className="text-danger">{error}</p>
          )}

          {loading && (
            <p className="text-center">Loading tasks...</p>
          )}

          {!loading && todos.length === 0 && (
            <p className="text-center text-muted">
              No tasks found. Add your first task!
            </p>
          )}

          {!loading && todos.map((todo) => (
            <div
              key={todo.id}
              className="d-flex justify-content-between align-items-center border-bottom py-3 gap-3"
            >
              {editingId === todo.id ? (
                <div className="d-flex flex-grow-1 gap-2">
                  <input
                    type="text"
                    className="form-control"
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                  />

                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => saveEdit(todo)}
                  >
                    Save
                  </button>

                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo)}
                    />

                    <label
                      className={`form-check-label ${todo.completed
                          ? 'text-decoration-line-through text-muted'
                          : ''
                        }`}
                    >
                      {todo.title}
                    </label>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <span
                      className={`badge ${todo.completed
                          ? 'bg-success'
                          : 'bg-warning text-dark'
                        }`}
                    >
                      {todo.completed ? 'Completed' : 'Pending'}
                    </span>

                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => startEditing(todo)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App

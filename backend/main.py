
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import create_table, get_connection
from models import TodoCreate, TodoUpdate

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://todo-fullstack-sage-gamma.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    create_table()


@app.get("/")
def home():
    return {
        "message": "Todo List Backend is running successfully!"
    }


@app.post("/todos")
def create_todo(todo: TodoCreate):
    connection = get_connection()

    cursor = connection.execute(
        "INSERT INTO todos (title) VALUES (?)",
        (todo.title,)
    )

    connection.commit()
    todo_id = cursor.lastrowid
    connection.close()

    return {
        "id": todo_id,
        "title": todo.title,
        "completed": False,
        "message": "Todo created successfully!"
    }


@app.get("/todos")
def get_todos():
    connection = get_connection()

    todos = connection.execute(
        "SELECT * FROM todos"
    ).fetchall()

    connection.close()

    return [
        {
            "id": todo["id"],
            "title": todo["title"],
            "completed": bool(todo["completed"])
        }
        for todo in todos
    ]


@app.put("/todos/{todo_id}")
def update_todo(todo_id: int, todo: TodoUpdate):
    connection = get_connection()

    existing_todo = connection.execute(
        "SELECT * FROM todos WHERE id = ?",
        (todo_id,)
    ).fetchone()

    if existing_todo is None:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Todo not found"
        )

    connection.execute(
        """
        UPDATE todos
        SET title = ?, completed = ?
        WHERE id = ?
        """,
        (todo.title, todo.completed, todo_id)
    )

    connection.commit()
    connection.close()

    return {
        "id": todo_id,
        "title": todo.title,
        "completed": todo.completed,
        "message": "Todo updated successfully!"
    }


@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    connection = get_connection()

    existing_todo = connection.execute(
        "SELECT * FROM todos WHERE id = ?",
        (todo_id,)
    ).fetchone()

    if existing_todo is None:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Todo not found"
        )

    connection.execute(
        "DELETE FROM todos WHERE id = ?",
        (todo_id,)
    )

    connection.commit()
    connection.close()

    return {
        "message": "Todo deleted successfully!"
    }

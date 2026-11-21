cat > README.md <<'EOF'
# Full Stack Todo List Application

A simple and responsive Todo List application built using React, Bootstrap, Python, FastAPI, and SQLite.

## Features

- Add new tasks
- View all tasks
- Edit task titles
- Mark tasks as completed or pending
- Delete tasks
- Store tasks in an SQLite database
- Validate task titles
- Responsive user interface

## Tech Stack

### Frontend
- React
- JavaScript
- Bootstrap
- CSS
- Vite

### Backend
- Python
- FastAPI
- Pydantic
- SQLite

## Project Structure

todo-fullstack/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── index.html
├── .gitignore
└── README.md

## Run Locally

### 1. Clone the repository

git clone https://github.com/shubhamkumarr1/todo-fullstack.git

cd todo-fullstack

### 2. Start the Backend

cd backend

python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload

Backend: http://127.0.0.1:8000

API Documentation: http://127.0.0.1:8000/docs

### 3. Start the Frontend

Open a new terminal:

cd todo-fullstack/frontend

npm install

npm run dev

Frontend: http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /todos | Get all tasks |
| POST | /todos | Create a task |
| PUT | /todos/{todo_id} | Update a task |
| DELETE | /todos/{todo_id} | Delete a task |

## Database

SQLite is used to store tasks persistently.

## Author

Shubham Kumar

GitHub: https://github.com/shubhamkumarr1
EOF

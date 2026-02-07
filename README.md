# PhishGuard – Steps to Run the Project

## Prerequisites

- **Python 3.8+** installed on your system
- A terminal (PowerShell, Command Prompt, or bash)

---

## Step 1: Open the project folder

```bash
cd path\to\phishguard
```

Example (Windows):

```bash
cd C:\Users\manoj pawar\Desktop\phishguard
```

---

## Step 2: Create and activate a virtual environment (optional but recommended)

**Windows (PowerShell):**

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**

```cmd
python -m venv venv
venv\Scripts\activate.bat
```

**Linux / macOS:**

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## Step 3: Install backend dependencies

From the project root:

```bash
pip install -r backend\requirements.txt
```

On Linux/macOS:

```bash
pip install -r backend/requirements.txt
```

---

## Step 4: Initialize the database

Run the database setup script once:

```bash
python backend\init_db.py
```

On Linux/macOS:

```bash
python backend/init_db.py
```

You should see: `Database initialized successfully!`

---

## Step 5: Start the FastAPI backend server

You can run the backend **from the project root** (recommended):

**Option A – Run scripts (easiest):**

- **Windows:** Double-click `run_backend.bat` or in PowerShell run `.\run_backend.ps1`
- From project root: `python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000`

**Option B – From the backend folder:**

```bash
cd backend
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Keep this terminal open. You should see something like:

```
Uvicorn running on http://127.0.0.1:8000
```

---

## Step 6: Open the frontend in the browser

**Option A – Open the HTML file directly**

- Double-click: `frontend\index.html`  
  or  
- Run: `start frontend\index.html` (Windows)  
  or  
- Open `frontend/index.html` from your file manager

**Option B – Serve the frontend with a simple HTTP server (avoids some browser restrictions)**

From the project root in a **new** terminal:

```bash
# Python 3
python -m http.server 8080
```

Then open: **http://localhost:8080/frontend/index.html**

---

## Quick reference

| What              | URL or path                          |
|-------------------|--------------------------------------|
| Frontend          | `frontend/index.html` or http://localhost:8080/frontend/index.html |
| API docs (Swagger)| http://127.0.0.1:8000/docs           |
| API (ReDoc)       | http://127.0.0.1:8000/redoc          |
| Backend API       | http://127.0.0.1:8000                |

---

## Troubleshooting

- **“Module not found”**  
  Activate the virtual environment and install again:  
  `pip install -r backend\requirements.txt`

- **“File not found” for `.pkl` models**  
  Start the server from inside the `backend` folder:  
  `cd backend` then `uvicorn main:app --reload --host 127.0.0.1 --port 8000`

- **“Table users already exists”**  
  Database is already initialized; you can skip Step 4.

- **Port 8000 already in use**  
  Use another port:  
  `uvicorn main:app --reload --host 127.0.0.1 --port 8001`  
  Then in the frontend, change `http://127.0.0.1:8000` to `http://127.0.0.1:8001` in `frontend/script.js` (or use the same port everywhere).

- **CORS or “blocked by CORS”**  
  The backend allows all origins; if you still see issues, use Option B (HTTP server) for the frontend.

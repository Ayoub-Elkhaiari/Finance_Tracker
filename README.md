# Personal Finance Tracker

A full-stack personal finance app with modern UI, JWT auth, transaction management, budgets, goals, and analytics.

## What is fully working now

### Authentication
- Register with full name, email, password, and terms checkbox
- Login with JWT token
- Forgot password flow that **actually works**:
  - request reset token
  - reset password using token and new password

### Transactions
- Add income and expense transactions
- View transaction history
- Delete transactions
- Filter support on backend (date range/category/type)

### Categories, Budgets, Goals
- Categories: add/list/delete
- Budgets: add/list/delete
- Goals: add/list/delete with progress bar

### Dashboard
- Built with **Chart.js** (`react-chartjs-2`)
- Pie chart: income vs expense
- Bar chart: monthly income/expense evolution
- Line chart: balance trend

## Tech stack
- Backend: FastAPI + SQLAlchemy + Pydantic + JWT
- Frontend: React + TypeScript + Vite + Chart.js
- Database: PostgreSQL (recommended)

## Run locally

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Open:
- http://localhost:8000/docs
- http://localhost:8000/api/health

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open:
- http://localhost:5173

Frontend uses backend URL: `http://localhost:8000/api`

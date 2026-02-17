# Personal Finance Tracker

A full-stack Multi-container personal finance app with modern UI, JWT auth, transaction management, budgets, goals, and analytics.

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

<img width="1919" height="1009" alt="Screenshot 2026-02-18 003612" src="https://github.com/user-attachments/assets/02b28646-5c2f-4251-8368-ceb8740eb822" />


<img width="1919" height="1009" alt="Screenshot 2026-02-18 003623" src="https://github.com/user-attachments/assets/e84f861b-aabd-4efe-a3a9-28fdacd3f4dc" />

<img width="1913" height="1007" alt="Screenshot 2026-02-18 003437" src="https://github.com/user-attachments/assets/c407c64a-f5aa-44d8-b287-22990ed1b5ab" />

<img width="1919" height="950" alt="Screenshot 2026-02-18 003457" src="https://github.com/user-attachments/assets/b3603b3f-cc5e-4fb7-9e31-31ea9f3ccac7" />

<img width="1913" height="1007" alt="Screenshot 2026-02-18 003520" src="https://github.com/user-attachments/assets/ef2ca10a-5ccb-4312-bd45-96cf04609b31" />

<img width="1917" height="1009" alt="Screenshot 2026-02-18 003530" src="https://github.com/user-attachments/assets/507a0ad2-02d6-4bb6-88b2-d1111f5ce05b" />

<img width="1917" height="1009" alt="Screenshot 2026-02-18 003530" src="https://github.com/user-attachments/assets/60c5ebed-c40a-42df-80d7-c20ba3b4932d" />



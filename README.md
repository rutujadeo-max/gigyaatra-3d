# GigYaatra 3D

Step 1 scaffold for a production-oriented monorepo with:
- `client/` - React + Vite frontend
- `server/` - Express + MySQL backend
- `ai-service/` - FastAPI AI service

## Step 2 auth status
- Register and login flow is wired end to end
- Access tokens are returned from the backend
- Refresh tokens are stored in an HTTP-only cookie
- Protected frontend routing is active on `/dashboard`
- Google OAuth is currently a UI placeholder

## Step 3 database status
- MySQL connection lifecycle now exposes connection status on the server health endpoint
- `users` and `quests` tables bootstrap automatically for local development
- User records keep typed avatar, region score, and quest activity structures through JSON columns
- SQL-aware duplicate entry handling is in place for auth flows

## Current database
- The app now expects a local MySQL instance instead of MongoDB
- Default local settings target `127.0.0.1:3306` with database `gigyaatra`
- Update `server/.env` if your local MySQL username or password differs

## Quick start

### Client
```bash
cd client
npm install
npm run dev
```

### Server
```bash
cd server
npm install
npm run dev
```

### AI service
```bash
cd ai-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Environment setup
- Copy `client/.env.example` to `client/.env`
- Copy `server/.env.example` to `server/.env`
- Copy `ai-service/.env.example` to `ai-service/.env`
- Ensure local MySQL is running before starting the server

## Health endpoints
- Server: `GET http://localhost:5000/api/health`
- AI service: `GET http://localhost:8000/health`

## Auth endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

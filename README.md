# Career Links 🚀

## Quick Setup

1. **Copy .env**:
```
cp .env.example .env
```
Edit `.env` with your MongoDB URI, JWT secret, Gmail SMTP (App Password).

2. **Install & Run**:
```
npm install
npm start
```

3. **Seed Data** (login first):
```
curl -X POST http://localhost:5000/api/seed \\
  -H \"Authorization: Bearer YOUR_JWT_TOKEN\"
```

4. **Test Frontend**:
- Open `frontend/index.html`
- Register → Login → Search → Save → Dashboard

## API Endpoints
- `POST /api/register`, `/api/login`
- `GET /api/search?q=dev&domain=IT`
- `GET /api/internships?paid=true`
- Protected: `/api/saved`, `/api/save`, `/api/profile`, `/api/seed`

## Features
- Auth (JWT + roles)
- Search/Filter opps by domain/paid/type
- Save to dashboard
- Rate limited API
- Email notifications
- Dark mode + responsive

## Project Structure
```
.
├── backend/     # Node/Express/Mongo API
├── frontend/    # HTML/CSS/JS UI
├── client/      # React (future)
└── docs/
```

**Server**: http://localhost:5000/api/health

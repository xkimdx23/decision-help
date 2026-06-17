# Decision Help - Positive Decision Helper

Two versions available: **Full-stack app** (Node.js + React + MongoDB + Docker) and **Standalone HTML** (single file, zero deps).

---

## 🚀 Quick Start (Standalone HTML)

Open `standalone.html` in any browser. No setup needed.

## 🐳 Quick Start (Full-stack with Docker)

```bash
docker-compose up --build
```

Access: http://localhost:3000

## ⚡ Quick Start (Manual Dev)

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
decision-helper/
├── standalone.html       ← Single-file version (open in browser)
├── docker-compose.yml    ← Multi-container Docker setup
├── backend/              ← Express API (Node.js + MongoDB)
│   ├── src/
│   │   ├── controllers/  ← Auth + Decision logic
│   │   ├── models/       ← User, Decision, Report, Translation
│   │   ├── routes/       ← API routes
│   │   ├── middleware/   ← Auth, safety filter, error handler
│   │   └── utils/        ← Positive bias algorithm, email service
│   ├── server.js
│   └── seed.js
├── frontend/             ← React 18 + Vite
│   ├── src/
│   │   ├── pages/        ← Home, History, Profile, Community, About
│   │   ├── components/   ← Navbar, LanguageSwitcher
│   │   ├── styles/       ← Global CSS
│   │   └── translations/ ← Multi-language support
│   └── vite.config.js
└── README.md
```

## 🌍 Features

- **3 Decision Modes**: This or That, Yes or No, Pick from List
- **Positive Bias Algorithm**: Favors constructive choices
- **Safety Filter**: Blocks harmful content
- **Multi-Language**: 12 languages with Arabic RTL
- **Dark Mode**: Light/dark toggle
- **User System**: JWT + email verification + password reset
- **Decision History**: Paginated history with delete
- **Community**: Browse & like public decisions
- **Responsive**: Mobile/tablet/desktop

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/verify/:token` | Verify email |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password/:token` | Reset password |
| GET | `/api/auth/profile` | Get profile (auth) |
| PUT | `/api/auth/profile` | Update profile (auth) |
| DELETE | `/api/auth/account` | Delete account (auth) |
| POST | `/api/decide` | Make a decision |
| GET | `/api/decisions/history` | Get user history (auth) |
| DELETE | `/api/decisions/:id` | Delete decision (auth) |
| POST | `/api/decisions/:id/like` | Like a decision |
| GET | `/api/decisions/public` | Browse public decisions |

---

Made with ❤️ for positive decision making

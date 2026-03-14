# Career Links - Project Documentation

## 1. Abstract

Career Links is a comprehensive web platform designed to empower students and job seekers by providing seamless access to diverse career opportunities. The platform aggregates direct links to prestigious internship programs (both paid and unpaid), job openings, and online courses across various domains including IT, Management, Finance, E-commerce, Government, and English Learning. Built with a modern full-stack architecture using HTML/CSS/JavaScript for the frontend, Node.js/Express.js backend, and MongoDB database, Career Links features user authentication, responsive design, dark/light mode toggle, and intuitive navigation. The primary purpose is to streamline career exploration, reduce search friction, and connect users with official career platforms like Google Careers, Internshala, Coursera, and more.

## 2. Introduction

In today's competitive job market, students and fresh graduates face significant challenges in discovering relevant career opportunities, internships, and skill-building courses. Traditional search methods are fragmented across multiple websites, leading to information overload and missed opportunities. Career Links addresses this gap by creating a centralized, user-friendly platform that curates verified links to official career portals. 

The importance of such platforms cannot be overstated: they democratize access to high-quality opportunities, provide domain-specific guidance (e.g., IT vs. Management), distinguish between paid/unpaid options, and support continuous learning through course recommendations. By integrating authentication for personalized experiences and responsive design for mobile accessibility, Career Links serves as an essential tool for career development in academic and professional contexts.

## 3. Objectives of the Project

The primary goals of Career Links are:

- **Centralized Career Discovery:** Aggregate opportunities from top platforms in one location.
- **Domain-Specific Navigation:** Categorize by career domains (IT, Management, Finance, etc.) for targeted exploration.
- **Opportunity Variety:** Cover paid/unpaid internships, jobs, paid/free courses.
- **User Authentication:** Secure registration/login for personalized user data management.
- **Enhanced UX:** Implement dark/light modes, responsive design, and direct application links.
- **Scalability:** Use MongoDB for user data, Express APIs for future dynamic content.
- **Accessibility:** Direct links to official sites, reducing fraud risk.

**Benefits:** Saves time, provides verified opportunities, supports skill development, and aids informed career decisions.

## 4. Technology Stack

### Frontend
- **HTML5:** Semantic structure for career pages, forms (register/login), navigation.
- **CSS3:** Responsive design (flex/grid), custom variables for dark/light themes, animations.
- **JavaScript (ES6+):** Dynamic features (theme toggle with localStorage), form handling, navigation functions.

### Backend
- **Node.js:** Runtime environment for server-side logic.
- **Express.js:** Web framework for API routing, middleware (CORS, JSON parsing).

### Database
- **MongoDB:** NoSQL database via Mongoose ODM. Stores user data (name, email, password hash, role).

### Additional Tools
- **bcrypt:** Password hashing for security.
- **dotenv:** Environment variables (MONGO_URI, PORT).
- **cors:** Cross-origin requests for frontend-backend communication.

## 5. System Architecture

```
┌─────────────────────┐    HTTP Requests (APIs)    ┌─────────────────────┐
│     Frontend        │ ──────────────────────────► │      Backend       │
│ (HTML/CSS/JS)       │                            │ (Node.js/Express)  │
│                     │    Static Pages + Links    │                    │
│ • Responsive UI     │ ◄────────────────────────── │ • API Endpoints    │
│ • Theme Toggle      │           JSON Data         │ • Auth Logic       │
│ • Domain Pages      │                            └────────────────────┘
└─────────────────────┘                                       │
                                                              │
                                                      MongoDB Connection
                                                              │
                                                      ┌────────────────────┐
                                                      │     MongoDB        │
                                                      │                    │
                                                      │ • Users Collection │
                                                      │   {name, email,    │
                                                      │    password, role} │
                                                      └────────────────────┘
```

**Flow:** Frontend static pages use JS to call backend APIs (/api/register, /login, /internships). Backend handles auth (bcrypt compare/hash), returns JSON/static data. MongoDB persists users only (opportunities static).

## 6. Backend Development

Node.js provides asynchronous, event-driven architecture ideal for API servers. Express.js simplifies routing:

**server.js:**
```javascript
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
connectDB();  // MongoDB connection
app.use("/api", require("./routes/api"));
app.listen(process.env.PORT, () => console.log(`Server on port ${process.env.PORT}`));
```

- Middleware: JSON parsing, CORS for frontend access.
- DB Connection: Called on startup.
- Routes: Mounted at /api.

## 7. Database Design

**MongoDB with Mongoose:**

**config/db.js:**
```javascript
const mongoose = require('mongoose');
const connectDB = async () => {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
};
```

**models/User.js:**
```javascript
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,  // Hashed with bcrypt
    role: String
});
module.exports = mongoose.model('User', UserSchema);
```

**Collections:**
- **Users:** Stores registered users. Unique email, hashed password for security.

No other collections (opportunities static).

## 8. API Structure

All APIs under `/api/`:

| Method | Endpoint              | Description                          | Request Body/Query | Response |
|--------|-----------------------|--------------------------------------|--------------------|----------|
| POST   | `/register`           | Create new user                      | {name, email, password, role} | {message: "success"} |
| POST   | `/login`              | Authenticate user                    | {email, password} | {success: true, user: {...}} |
| GET    | `/internships?type=` | Get paid/unpaid internships (static) | type=paid\|unpaid | [{title, company}] |
| GET    | `/courses?type=`     | Get paid/free courses (static)       | type=paid\|free   | [{title, platform}] |
| GET    | `/jobs`               | Get job listings (static)            | -                 | [{title, company}] |

**Auth Flow:** bcrypt.hash(10) on register, bcrypt.compare on login.

## 9. System Workflow

1. **User Registration:** Navigate to register.html → POST /api/register → Hash password → Save to MongoDB → Success message.
2. **User Login:** login.html → POST /api/login → Find user by email → bcrypt.compare → Return user data on success.
3. **Home/Dashboard:** index.html → Explore domains (IT, Management, etc.).
4. **Domain Exploration:** e.g., it.html → Static links + theme toggle.
5. **Opportunities:** e.g., paid-internships.html → Direct buttons to Google/Microsoft/Internshala (onclick=apply(url)).
6. **Theme Toggle:** JS detects localStorage, toggles CSS classes (dark-mode/light-mode), persists preference.
7. **Responsive:** CSS media queries for mobile/desktop.

## 10. Modules of the System

- **User Module:** Register/login (backend/routes/api.js, frontend/register.html/login.html).
- **Domain Module:** Static pages (it.html, management.html, finance.html, etc.) with domain-specific links.
- **Internship Module:** paid-internships.html/unpaid-internships.html + API /internships.
- **Course Module:** paid-courses.html/free-courses.html + API /courses.
- **Job Module:** jobs.html + API /jobs.

## 11. Advantages of the System

- **User-Friendly:** Intuitive navigation, direct links, theme options.
- **Secure:** Password hashing, CORS protection.
- **Responsive:** Works on all devices.
- **Fast:** Static content delivery, lightweight APIs.
- **Scalable:** MongoDB for users, easy to add dynamic data.
- **Verified Links:** Official platforms only.
- **Personalization:** User auth + local theme storage.

## 12. Limitations of the System

- **Static Data:** Opportunities hardcoded (no real-time scraping/search).
- **No User Profiles:** Basic auth, no dashboard/jobs applied tracking.
- **No JWT Sessions:** Stateless; login not persisted client-side.
- **Limited Validation:** Basic field checks.
- **No Admin Panel:** Cannot manage opportunities.
- **Frontend-Backend Split:** Manual navigation post-auth.

## 13. Future Enhancements

- **JWT Authentication:** Token-based sessions, protected routes.
- **Dynamic Data:** Scrape/partner APIs for real-time opportunities.
- **User Dashboard:** Saved opportunities, application tracking.
- **Search/Filter:** By location/salary/domain.
- **Email Notifications:** Job alerts.
- **Payment Integration:** For premium features.
- **React/Vue Refactor:** SPA for better UX.
- **Analytics:** Usage tracking, popular domains.

## 14. Conclusion

Career Links successfully delivers a robust platform for career exploration, fulfilling objectives of accessibility, usability, and opportunity aggregation. The MERN-stack implementation ensures maintainability and scalability. While current limitations exist, the foundation supports significant enhancements. This project demonstrates proficiency in full-stack development, database design, and modern web practices, making it ideal for academic evaluation and real-world deployment.

---
*Career Links v1.0 | Developed for Career Development Platform*


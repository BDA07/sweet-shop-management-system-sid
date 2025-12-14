.

🍬 Sweet Shop Management System
SIDHARTH – Sweets & Savouries

A production-ready full-stack Sweet Shop Management System built with React, TypeScript, Node.js, and Express.
The application supports secure authentication, role-based access (Admin/User), inventory management, and a modern admin dashboard, developed using clean architecture and TDD principles.

🚀 Features
🔐 Authentication & Authorization
User Registration & Login

Password hashing using bcrypt

JWT-based authentication

Role-based access control (USER, ADMIN)

Protected routes (Frontend & Backend)

🍭 Sweet Management
Add new sweets (Admin only)

Update sweet details

Delete sweets

Restock inventory

Prevent purchase when stock is 0

Search sweets by name

Filter by category and price

🧑‍💼 Admin Dashboard
Dedicated admin panel

Inventory control

Role-protected admin routes

Admin login option from login page

🎨 Frontend UI
Modern, clean UI inspired by luxury Indian sweet brands

Responsive design

Sweet cards with live stock updates

Loading & error states

Role-based UI rendering

🧪 Testing (TDD)
Unit & integration tests

Jest + Supertest

Red → Green → Refactor workflow

API endpoint coverage

🛠️ Tech Stack
Frontend
React

TypeScript

Vite

React Router

Axios

Backend
Node.js

Express.js

TypeScript

PostgreSQL (SQLite for local development)

JWT Authentication

Testing
Jest

Supertest
<img width="1742" height="886" alt="Screenshot 2025-12-14 181504" src="https://github.com/user-attachments/assets/b28ab2f8-51ca-4200-8e83-d4d3f2645d83" />
<img width="1912" height="933" alt="Screenshot 2025-12-14 181302" src="https://github.com/user-attachments/assets/f8524edd-b4e3-4158-9073-2bf132b7f2dc" />
<img width="1821" height="828" alt="Screenshot 2025-12-14 181337" src="https://github.com/user-attachments/assets/1df1df18-91f2-4ef8-a058-622383288660" />
<img width="1820" height="903" alt="Screenshot 2025-12-14 181414" src="https://github.com/user-attachments/assets/d538ad1a-4e04-4840-b498-9d0b4d88ad70" />
<img width="1742" height="886" alt="Screenshot 2025-12-14 181504" src="https://github.com/user-attachments/assets/2a8dc309-7bf3-42b7-90f7-c8ad31b209d7" />



🔑 User Roles
Role	Permissions
USER	View sweets, purchase sweets
ADMIN	Add, update, delete, restock sweets

🔄 API Endpoints (Backend)
Auth
POST /api/auth/register

POST /api/auth/login

Sweets (Protected)
GET /api/sweets

POST /api/sweets (Admin)

PUT /api/sweets/:id (Admin)

DELETE /api/sweets/:id (Admin)

PATCH /api/sweets/:id/restock (Admin)

GET /api/sweets/search?name=

▶️ Getting Started
1️⃣ Clone the Repository
bash
Copy code
git clone https://github.com/your-username/sweet-shop-management-system.git
cd sweet-shop-management-system
2️⃣ Backend Setup
bash
Copy code
cd backend
npm install
npm run dev
Create a .env file:

env
Copy code
PORT=5000
JWT_SECRET=your_secret_key
3️⃣ Frontend Setup
bash
Copy code
cd frontend
npm install
npm run dev
4️⃣ Run Tests
bash
Copy code
cd backend
npm test
🔐 Authentication Flow
User logs in

Backend returns JWT + role

Token stored in localStorage

Role used for:

Route protection

Admin UI access

Unauthorized access → redirected to login

🧠 Architecture Decisions
Separation of concerns (Controllers, Services, Routes)

Stateless JWT authentication

Role-based middleware

Reusable frontend components

Clean and scalable folder structure

📌 Future Improvements
Order history

Payment integration

Analytics dashboard

Refresh token support

Dockerized deployment

CI/CD pipeline

👨‍💻 Author
Sidharth Pundir
Bachelor’s in Computer Science (Big Data & Analytics)
Full-Stack Developer | Backend Enthusiast

⭐ Why This Project?
This project demonstrates:

Real-world full-stack development

Secure authentication practices

Clean architecture

Test-driven development

Admin & user role separation

Perfect for interviews, portfolio, and production-level learning.


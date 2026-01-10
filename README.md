# FitWithPravinn - Elite Fitness Platform

This project is a high-end personal training and fitness coaching platform. It features a modern, cinematic React frontend and a robust Node.js/Express backend with MongoDB.

## 🚀 Getting Started

To run the full-stack application, you need to start both the **Backend** and the **Frontend** separately.

---

### 1. Backend Setup & Run
The backend handles product data, monthly slot limits, order creation (Razorpay), and automated notifications.

**Prerequisites:**
- Node.js installed
- MongoDB installed and running locally

**Steps:**
1. Open a new terminal.
2. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. **Environment Variables:**
   Open `backend/.env` and ensure the values are correct. For testing, you can leave the Razorpay/Mail keys as they are since we have mock success enabled.
5. **Seed the Database:**
   Run this once to populate the products (4 courses, 2 ebooks) and the current month's slots:
   ```bash
   npm run seed
   ```
6. **Start the Server:**
   ```bash
   npm run dev
   ```
   *The backend will run on `http://localhost:5000`.*

---

### 2. Frontend Setup & Run
The frontend is a premium React application using Tailwind CSS v4 and Framer Motion.

**Steps:**
1. Open another terminal in the **root** directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. **Start the Frontend:**
   ```bash
   npm run dev
   ```
   *The frontend will typically run on `http://localhost:5173`.*

---

## 🛠️ Key Features
- **Atomic Slot Tracking:** Courses allow exactly 20 enrollments per month (global cap).
- **Mock Payment Mode:** Bypasses real Razorpay signature verification for testing flow (triggered by sending `mock_success`).
- **Automated Fulfillment:** Backend is configured to send automated Emails (Nodemailer) and WhatsApp messages (Twilio/API) on payment success.
- **Responsive Elite UI:** Optimized for mobile and desktop with cinematic animations and a premium custom cursor.

## 📁 Folder Structure
- `/src`: React frontend source code.
- `/backend`: Node.js server, Mongoose models, and Razorpay/Notification logic.
- `/backend/utils/seed.js`: Database initialization script.

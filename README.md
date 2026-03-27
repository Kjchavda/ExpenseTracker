# 📊 Full-Stack Expense Tracker

[![Live Deployment](https://img.shields.io/badge/Live_Deployment-Available_Now-success?style=for-the-badge)](https://expense-tracker-rose-psi.vercel.app)
[![Watch Demo](https://img.shields.io/badge/Demo-View_GIF_Below-blue?style=for-the-badge)](#-gallery)

A full-stack, decoupled financial management application that aggregates, categorizes, and visualizes personal expenses and income. Built to provide users with real-time financial insights through interactive dashboards, secured with JWT authentication, and scaled with cloud-based media storage.

-----

## 🚀 Core Engineering Features

### 1\. Dynamic Data Visualization Pipeline

Implemented a real-time analytics dashboard that transforms raw relational data into actionable financial insights.

  * **The Challenge:** Fetching and formatting raw SQL rows of transactions into a structure usable by frontend charting libraries without causing heavy client-side processing bottlenecks.
  * **The Solution:** Built optimized FastAPI endpoints that aggregate income and expense data, feeding directly into **Recharts** to render interactive, responsive graphs that update instantly when new transactions are logged.

### 2\. Cloud-Native Media Management

Solved the limitations of local file storage by integrating a decoupled, cloud-based media pipeline for user profile customization.

  * **The Flow:** React frontend securely captures user images via hidden multipart inputs. The FastAPI backend intercepts the stream, validates the file type, and securely uploads it to **Cloudinary** using environment-protected API keys.
  * **The Result:** The database only stores a lightweight, secure URL, drastically reducing database bloat while serving high-speed CDN images to the client frontend.

### 3\. Secure JWT Authentication & Global State

  * Implemented a robust **OAuth2 password flow** with FastAPI, securing endpoints with Bearer tokens and hashing passwords using `bcrypt`.
  * Managed complex frontend session states using React's **Context API**, ensuring seamless UI updates (like profile picture changes and transaction logs) across decoupled components without prop drilling.
  * Built Axios interceptors to automatically attach authorization headers, gracefully handling `401 Unauthorized` states and token expiration.

### 4\. Relational Data Modeling

Designed a strict, highly relational **PostgreSQL** schema using SQLAlchemy and Pydantic:

  * **One-to-Many Relationships:** Securely linking independent Income and Expense ledgers to unique, authenticated Users.
  * **Schema Validation:** Enforced strict Pydantic models (e.g., `UserOut`, `ExpenseCreate`) to ensure data integrity between the client requests and database commits, preventing null-reference crashes and injection vulnerabilities.

-----

## 💻 Tech Stack

**Client-Side (Frontend)**

  * React.js (Vite)
  * Tailwind CSS
  * Recharts (Data Visualization)
  * React Router DOM
  * Axios (API Client)
  * Lucide React / React Icons

**Server-Side (Backend)**

  * FastAPI (Python)
  * PostgreSQL (Hosted on Neon)
  * SQLAlchemy (ORM)
  * Pydantic (Data Validation)
  * Passlib & python-jose (JWT Auth & Cryptography)

**Third-Party Services**

  * Cloudinary (Cloud Media Storage)

-----

## 📸 Gallery

<details>
  <summary>Click to view Interactive Dashboard</summary>
  <br>
  <img src="docs/dashboard-demo.gif" alt="Dashboard Screenshot">
</details>

<details>
  <summary>Click to view Cloudinary Profile Upload in Action</summary>
  <br>
  <img src="docs/profile-upload.gif" alt="Profile Upload GIF">
</details>

<details>
  <summary>Click to view Transaction Management</summary>
  <br>
  <img src="docs/transactions-demo.gif" alt="Transaction Management GIF">
</details>
-----

## 🛠️ Local Development Setup

Follow these steps to run the project locally.

### Prerequisites

  * Python 3.10+
  * Node.js 18+
  * PostgreSQL database (Local or Cloud like Neon)
  * Cloudinary Account (Free tier)

### 1\. Backend Setup

Navigate to the root directory and create a virtual environment:

python -m venv .venv
source .venv/bin/activate  https://www.google.com/search?q=%23 On Windows: .venv\\Scripts\\activate

Install the dependencies:

pip install -r backend/requirements.txt

Create a `.env` file in the `backend` directory:

DATABASE\_URL=postgresql://user:password@localhost/dbname
SECRET\_KEY=your\_super\_secret\_jwt\_key
ALGORITHM=HS256
CLOUD\_NAME=your\_cloudinary\_name
API\_KEY=your\_cloudinary\_api\_key
API\_SECRET=your\_cloudinary\_api\_secret

Run the FastAPI server:

cd backend
uvicorn main:app --reload

### 2\. Frontend Setup

Open a new terminal and navigate to the frontend directory:

cd frontend/expense-tracker
npm install

Create a `.env` file in the `frontend/expense-tracker` directory:

VITE\_API\_BASE\_URL=http://localhost:8000

Start the Vite development server:

npm run dev

-----

*Designed and engineered by Kulanjay Chavda.*
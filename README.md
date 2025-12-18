# Sosyal Kütüphane Platformu

A premium, full-stack social library platform for discovering, reviewing, and interacting with books and movies. Users can create lists, follow others, rate content, and engage in discussions within a visually stunning interface.

## 🚀 Features

- **User Authentication**: Secure login, registration, and password recovery systems.
- **Dynamic Content Discovery**: Search and explore a vast collection of books and movies with real-time data fetching.
- **Social Ecosystem**: Follow other enthusiasts, like reviews, and share your own ratings and thoughts.
- **Personalized Library**: Organize your favorite content into custom manageable lists.
- **Interactive Feed**: Stay updated with user activities, trending reviews, and personalized recommendations.
- **3D & Motion UI**: A high-end user experience powered by Three.js and sophisticated animations.

## 🛠 Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Security**: JWT (python-jose), Bcrypt
- **Database**: MySQL (mysql-connector-python)
- **Utilities**: python-dotenv, requests, fastapi-mail

### Frontend
- **Framework**: React 19 (Vite)
- **Animations**: GSAP, Framer Motion
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Routing**: React Router 7
- **Icons**: React Icons

## ⚙️ Setup Instructions

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **MySQL Server**

### 1. Backend & Environment Setup
1. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### 2. Database Setup
1. Configure your database connection in `backend/func/db/connection/create_db_connection.py` or via a `.env` file (copied from `.envexample`).
2. Run the table creation script from the root directory:
   ```bash
   python database/create_tables.py
   ```
3. (Optional) Populate with mock data:
   ```bash
   python database/insert_users_data.py
   python database/insert_library_data.py
   ```

### 3. Running the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Start the FastAPI server:
   ```bash
   uvicorn api.main_api:api --reload
   ```
   *API will be available at `http://localhost:8000`*

### 4. Frontend Setup
1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```
   *The application will be accessible at `http://localhost:5173`*

## 📁 Project Structure

- `backend/`: FastAPI application logic and API endpoints.
- `Frontend/`: React application with Three.js components.
- `database/`: SQL schemas and Python data injection scripts.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.

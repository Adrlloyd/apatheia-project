# Apatheia

Apatheia delivers a carefully selected Stoic quote each day to inspire reflection and mindful journaling. Designed as a modern alternative to traditional journaling, the app offers a convenient way to capture and carry your thoughts anywhere.

Each user receives one unique quote every 24 hours, ensuring no quote repeats within a year. Your daily response is saved automatically and can be updated throughout the day. All entries are organized in an archive, allowing you to revisit and review your personal growth over time. Apatheia supports sustained introspection with a simple, elegant interface grounded in Stoic wisdom.

---

## 🛠️ Tech Stack

- **Frontend**: React (JavaScript) ![React](https://img.shields.io/badge/React-JavaScript-61DAFB?logo=react&logoColor=white&style=flat)

- **Backend**: Node.js, Express ![Node.js](https://img.shields.io/badge/Node.js-JavaScript-339933?logo=nodedotjs&logoColor=white&style=flat)
![Express](https://img.shields.io/badge/Express.js-Backend-000000?logo=express&logoColor=white&style=flat)

- **Database**: PostgreSQL with Sequelize ORM ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql&logoColor=white&style=flat)
![Sequelize](https://img.shields.io/badge/Sequelize-ORM-52B0E7?logo=sequelize&logoColor=white&style=flat)


---

## Getting Started

### 1. Clone the Repository
git clone https://github.com/your-username/apatheia.git
cd apatheia

### 2. Set Up PostgreSQL
Ensure PostgreSQL is installed and running locally.
Create a new database manually (e.g., apatheia_dev).

### 3. Install Dependencies
Backend
- cd server
- npm install

Frontend
- cd client
- npm install

### 4. Configure Environment Variables
In the server directory, create a .env file:

DB_NAME=apatheia_dev

DB_USER=your_db_username

DB_PASSWORD=your_db_password

DB_HOST=localhost

JWT_SECRET=your_jwt_secret

Update these values with your PostgreSQL credentials and a JWT secret.


#### 🌱 Seed the Database
To populate the app with sample data, run:
- cd server
- node seed.js

This will create:

A test user:
Username: testuser
Password: testpassword

Five quotes (three dated in the past, each with a journal entry).

#### ⚙️ Usage
Start the Backend Server
- cd server
- nodemon index.js
  
Start the Frontend Client
In a separate terminal:
- cd client
- npm run dev
The app should now be running at:
http://localhost:5173

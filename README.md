# Cyberjiutsu Attendance System

Welcome to the Cyberjiutsu Attendance System! This repository contains a comprehensive solution for managing teacher and student attendance. The project is divided into two main components:
- **Frontend** (User Interface)
- **Backend** (API and Business Logic)

This README will guide you on how to access, set up, and use both parts of the project. Please read through for detailed instructions.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Branches](#branches)
- [Frontend](#frontend)
  - [Features](#frontend-features)
  - [Getting Started](#frontend-getting-started)
  - [Sample Screenshots](#frontend-sample-screenshots)
- [Backend](#backend)
  - [Features](#backend-features)
  - [Getting Started](#backend-getting-started)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

Cyberjiutsu Attendance System is designed to streamline the process of attendance tracking for teachers and students. The system includes a modern web-based user interface (frontend) and a robust backend API for data management. The project is organized into two separate branches for clear separation of concerns.

---

## Branches

- **frontend**: Contains all code, assets, and instructions for the user interface.
- **newbackend**: Contains all backend logic, database models, and API endpoints.

You can switch between branches using the following Git command:

```bash
git checkout frontend      # For frontend code
git checkout newbackend   # For backend code
```

---

## Frontend

### Features

- **Modern Login Portal**: Secure login for teachers and administrators.
- **Attendance Dashboard**: Easily manage student sign-ins and sign-outs.
- **Class Selection**: View and manage attendance by class.
- **Search Functionality**: Quickly find students using the search bar.
- **User-friendly Design**: Clean and intuitive interface for efficient workflow.

### Getting Started

> **Note:** All frontend-related files and instructions are in the `frontend` branch.

#### 1. Clone the Repository

```bash
git clone https://github.com/vidakpop/attendance.git
cd attendance
git checkout frontend
```

#### 2. Install Dependencies

I am using React for my frontend tech stack:

```bash
npm install
```

Check the `package.json` for exact requirements.

#### 3. Run the Development Server

```bash
npm start
```

#### 4. Access the App

By default, the app will run at [http://localhost:5173](http://localhost:5173) 

---

### Sample Screenshots

#### Login Page

![Screenshot From 2025-06-21 11-59-25](https://github.com/user-attachments/assets/87dc4996-13ff-4cf4-80db-b6aa5b8590c7)


- **Description**: The login screen for teachers to securely access the attendance portal.

#### Attendance Dashboard

![Screenshot From 2025-06-21 12-02-15](https://github.com/user-attachments/assets/f32f2e58-5047-48a6-8518-33f3fbccfa2d)


- **Description**: Dashboard view for managing sign-ins and sign-outs, searching students, and filtering by class.

---

## Backend

### Features

- **RESTful API**: Endpoints for managing users, classes, and attendance records.
- **Authentication**: Secure login and session management.
- **Database Integration**: Persistent storage for all attendance data.
- **Role Management**: Support for teachers, admins, and other user roles.
- **Extensible Design**: Easy to add new features and endpoints.

### Getting Started

> **Note:** All backend-related files and instructions are in the `newbackend` branch.

#### 1. Switch to the Backend Branch

```bash
git checkout newbackend
```

#### 2. Set Up Python Environment

It's recommended to use a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

#### 3. Install Dependencies

```bash
pip install -r requirements.txt
```



#### 5. Run Database Migrations

I am using Django:

```bash

python manage.py migrate
```

#### 6. Start the Backend Server

```bash
python manage.py runserver
```

The backend will listen at [http://127.0.0.1:8000](http://127.0.0.1:8000) or as configured.

---

## Contributing

Contributions are welcome! Please open issues and pull requests against the appropriate branch (`frontend` or `newbackend`). Make sure to follow the repository's coding guidelines and include detailed descriptions.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for more information.

---

## Contact

For questions or support, please open an issue or contact me [@vidakpop](https://github.com/vidakpop/) .

---

Enjoy using the Cyberjiutsu Attendance System!

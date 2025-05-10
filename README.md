# Period Relief Platform

A full-stack web application for managing period product distribution between donors, organizations, and individuals in need.

## Project Overview

The Period Relief Platform connects:
- **Individual Recipients** who need period products
- **Organizations** that help coordinate distribution
- **Donors** who contribute supplies
- **Distribution Centers** that manage inventory and handle pickup

## Technology Stack

### Backend
- Django & Django REST Framework
- SQLite (development) / PostgreSQL (production)
- User authentication with Django AllAuth

### Frontend
- React 19
- Vite build tool
- TailwindCSS for styling
- React Router for navigation

## Getting Started

### Prerequisites
- Python 3.x
- Node.js and npm/yarn
- Git

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/period_relief_project.git
   cd period_relief_project
   ```

2. Set up the backend:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   ```

3. Set up the frontend:
   ```
   cd frontend
   npm install
   ```

### Running the Development Server

1. Start the Django backend:
   ```
   python manage.py runserver
   ```

2. In a separate terminal, start the frontend:
   ```
   cd frontend
   npm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/api/
   - Admin panel: http://localhost:8000/admin/

## Deployment

The application can be deployed using the provided scripts:
- `build.sh` - Builds the frontend and copies assets to Django static
- `deploy.sh` - Handles deployment to production server

## Project Structure

- `/frontend` - React application
- `/backend` - Django project settings
- `/api` - Django app with models, views, and business logic
- `/manage.py` - Django management script

## Features

- User registration and role-based access control
- Product request management
- Inventory tracking for distribution centers
- Organization management
- Donor contribution tracking
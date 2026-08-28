# Genzicon Foundation Django REST Backend

A production-ready **Django REST Framework (DRF)** backend for Genzicon Foundation with support for **MySQL** (recommended), **PostgreSQL**, or **SQLite**.

---

## 📁 Project Structure

```
backend/
├── genzicon_core/         # Main Django settings & WSGI configuration
│   ├── __init__.py        # PyMySQL bootstrap
│   ├── settings.py        # Database (MySQL/Postgres/SQLite), CORS, Auth, Rest Framework
│   ├── urls.py            # Root URL routing
│   └── wsgi.py            # Web Server Gateway Interface (Gunicorn/uWSGI)
├── api/                   # Genzicon Foundation REST API Application
│   ├── models.py          # Clothes, Volunteers, Projects, Donations, CMS, Contacts
│   ├── serializers.py     # DRF Serializers with progress percentage & nested validation
│   ├── views.py           # ModelViewSets & Admin dashboard endpoints
│   ├── urls.py            # API Router endpoints (/api/projects/, /api/clothes/, etc.)
│   ├── admin.py           # Django Admin panel configuration with search & filters
│   └── management/
│       └── commands/
│           └── seed_data.py # Initial database seeder script
├── requirements.txt       # Python dependencies (Django, DRF, PyMySQL, psycopg2, whitenoise)
├── .env.example           # Environment template
└── manage.py              # Django management CLI
```

---

## 🚀 Quick Setup Instructions

### 1. Create Python Virtual Environment & Install Dependencies
```bash
cd backend
python -m venv venv

# On Linux / macOS:
source venv/bin/activate

# On Windows (Command Prompt / PowerShell):
venv\Scripts\activate

# Install required packages
pip install -r requirements.txt
```

### 2. Configure Your Database (MySQL)

Create your `.env` file from the provided template:
```bash
cp .env.example .env
```

In your MySQL client, create the database:
```sql
CREATE DATABASE genzicon_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Update your `.env` file:
```env
DEBUG=True
SECRET_KEY=your-secure-random-secret-key
DB_ENGINE=mysql
DB_NAME=genzicon_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=127.0.0.1
DB_PORT=3306
```

*(Note: If you want to switch to PostgreSQL or SQLite, simply change `DB_ENGINE=postgresql` or `DB_ENGINE=sqlite` in `.env`)*

### 3. Run Migrations & Seed Initial Foundation Data
```bash
python manage.py makemigrations api
python manage.py migrate
python manage.py seed_data
```

### 4. Create an Admin User
```bash
python manage.py createsuperuser
```

### 5. Start Development Server
```bash
python manage.py runserver 8000
```

---

## 📡 REST API Endpoints

| Method | Endpoint | Description | Permissions |
|---|---|---|---|
| `POST` | `/api/auth/login/` | Admin Token Login | Public |
| `GET` | `/api/dashboard/overview/` | Summary KPI metrics for Admin Overview | Admin Only |
| `GET/POST` | `/api/projects/` | Field programs & ground initiatives | Public Read, Admin Write |
| `GET/POST` | `/api/clothes/` | Clothes Bank pickup requests & drop-offs | Public Create, Admin Full |
| `GET/POST` | `/api/volunteers/` | Youth volunteer registration portal | Public Create, Admin Full |
| `GET/POST` | `/api/donations/` | QR slips & bank donation records | Public Create, Admin Full |
| `GET/POST` | `/api/contacts/` | Citizen queries & partnership forms | Public Create, Admin Full |
| `GET/PUT` | `/api/site-content/current/` | Hero banner and public CMS content | Public Read, Admin Write |
| `GET/POST` | `/api/impact-stats/` | Public homepage live counter metrics | Public Read, Admin Write |

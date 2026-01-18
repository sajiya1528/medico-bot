# Medico Bot - Python Backend

## Setup

1. **Install Python 3.9+**
2. **Create Virtual Environment:**
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   # source venv/bin/activate # Mac/Linux
   ```
3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Seed Database:**
   ```bash
   python seed.py
   ```
   *Creates `medico.db` and users: `admin@test.com` (admin123), `doctor@test.com` (doctor123), `patient@test.com` (patient123)*

5. **Run Server:**
   ```bash
   uvicorn app.main:app --reload
   ```
   Server runs at `http://127.0.0.1:8000`.

## API Documentation
Go to `http://127.0.0.1:8000/docs` for Swagger UI.

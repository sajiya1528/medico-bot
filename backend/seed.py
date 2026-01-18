from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine, Base
from app.models import models
from app.core.security import get_password_hash

def seed_db():
    db = SessionLocal()
    try:
        # Create Tables
        Base.metadata.create_all(bind=engine)
        
        # Check if users exist
        if db.query(models.User).first():
            print("Database already seeded.")
            return

        # Users to seed
        users = [
            {
                "email": "admin@test.com",
                "password": "admin123",
                "role": "admin",
                "name": "Admin User"
            },
            {
                "email": "doctor@test.com",
                "password": "doctor123",
                "role": "doctor",
                "name": "Dr. Sarah"
            },
            {
                "email": "patient@test.com",
                "password": "patient123",
                "role": "patient",
                "name": "John Doe"
            }
        ]

        for u in users:
            user = models.User(
                email=u["email"],
                hashed_password=get_password_hash(u["password"]),
                name=u["name"],
                role=u["role"]
            )
            db.add(user)
        
        db.commit()
        print("Database seeded!")
    except Exception as e:
        print(f"Error seeding DB: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()

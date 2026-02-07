# Backend API logic will go here

from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel, EmailStr
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

import joblib
import pandas as pd
import sqlite3
import hashlib
import uuid
import json
import os

# Base directory (backend folder) - ensures paths work when run from project root or backend
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = FastAPI()

# ==== Load Models ====
phish_model = joblib.load(os.path.join(BASE_DIR, "phishing_model", "phish_model.pkl"))
malware_model = joblib.load(os.path.join(BASE_DIR, "file_malware", "rf_model.pkl"))
email_sms_model = joblib.load(os.path.join(BASE_DIR, "email_sms_model", "email_sms_model.pkl"))
vectorizer = joblib.load(os.path.join(BASE_DIR, "email_sms_model", "vectorizer.pkl"))

# ==== CORS Configuration ====
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==== Helper Function: API Key Validation ====
async def validate_api_key(x_api_key: str = Header(...)):
    conn = sqlite3.connect(os.path.join(BASE_DIR, "phishguard.db"))
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id FROM users WHERE api_key = ?",
        (x_api_key,)
    )
    result = cursor.fetchone()

    conn.close()

    if not result:
        raise HTTPException(status_code=401, detail="Invalid API key")

    return True

# ==========================
# URL PHISHING PREDICTION
# ==========================

class URLInput(BaseModel):
    url: str


@app.post("/predict/url")
async def predict_url(data: URLInput):
    url = data.url

    features = [
        len(url),
        url.count("@"),
        url.count("-"),
        url.count("https"),
        url.count("http"),
        url.count("."),
        url.startswith("https"),
        url.startswith("http"),
        int(any(char.isdigit() for char in url)),
    ]

    df = pd.DataFrame([features])
    result = phish_model.predict(df)[0]

    return {"phishing": bool(result)}

# ==========================
# FILE MALWARE PREDICTION
# ==========================

class FileInput(BaseModel):
    file_size: int
    file_type: int
    entropy: float
    strings_count: int
    suspicious_strings: int


@app.post("/predict/file")
async def predict_file(data: FileInput):
    df = pd.DataFrame([data.dict()])
    result = malware_model.predict(df)[0]

    return {"malicious": bool(result)}

# ==========================
# EMAIL / SMS PHISHING
# ==========================

class EmailSMSInput(BaseModel):
    message: str


@app.post("/predict/email_sms")
async def predict_email_sms(data: EmailSMSInput):
    message_vector = vectorizer.transform([data.message])
    result = email_sms_model.predict(message_vector)[0]

    return {"phishing": bool(result)}

# ==========================
# USER REGISTRATION
# ==========================

class UserRegistration(BaseModel):
    email: EmailStr
    password: str


@app.post("/register")
async def register_user(user: UserRegistration):
    try:
        password_hash = hashlib.sha256(user.password.encode()).hexdigest()
        api_key = str(uuid.uuid4())

        conn = sqlite3.connect(os.path.join(BASE_DIR, "phishguard.db"))
        cursor = conn.cursor()

        cursor.execute(
            "SELECT email FROM users WHERE email = ?",
            (user.email,)
        )

        if cursor.fetchone():
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        cursor.execute(
            "INSERT INTO users (email, password_hash, api_key) VALUES (?, ?, ?)",
            (user.email, password_hash, api_key)
        )

        conn.commit()
        conn.close()

        return {
            "message": "Registration successful",
            "api_key": api_key
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==========================
# USER LOGIN
# ==========================

class UserLogin(BaseModel):
    email: EmailStr
    password: str


@app.post("/login")
async def login_user(user: UserLogin):
    try:
        password_hash = hashlib.sha256(user.password.encode()).hexdigest()

        conn = sqlite3.connect(os.path.join(BASE_DIR, "phishguard.db"))
        cursor = conn.cursor()

        cursor.execute(
            "SELECT api_key FROM users WHERE email = ? AND password_hash = ?",
            (user.email, password_hash)
        )

        result = cursor.fetchone()
        conn.close()

        if not result:
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )

        return {
            "message": "Login successful",
            "api_key": result[0]
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

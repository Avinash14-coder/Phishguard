# Backend API logic will go here
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel, EmailStr
import joblib
import pandas as pd
import os
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import hashlib
import uuid
import json
from typing import Optional

app = FastAPI()

# ==== Load Models ====
phish_model = joblib.load("phishing_model/phish_model.pkl")
malware_model = joblib.load("file_malware/rf_model.pkl")
email_sms_model = joblib.load("email_sms_model/email_sms_model.pkl")
vectorizer = joblib.load("email_sms_model/vectorizer.pkl")

# Allow CORS for specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function to validate API key
async def validate_api_key(x_api_key: str = Header(...)):
    conn = sqlite3.connect('phishguard.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE api_key = ?", (x_api_key,))
    result = cursor.fetchone()
    conn.close()
    
    if not result:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return True

# ==== URL Request ====
class URLInput(BaseModel):
    url: str

@app.post("/predict/url")
async def predict_url(data: URLInput ):
# async def predict_url(data: URLInput, x_api_key: str = Header(...)):
    # Validate API key
    # await validate_api_key(x_api_key)
    
    url = data.url
    features = [
        len(url),
        url.count('@'),
        url.count('-'),
        url.count('https'),
        url.count('http'),
        url.count('.'),
        url.startswith("https"),
        url.startswith("http"),
        int(any(char.isdigit() for char in url))
    ]
    df = pd.DataFrame([features])
    result = phish_model.predict(df)[0]
    return {"phishing": bool(result)}


# ==== File Malware Request ====
class FileInput(BaseModel):
    file_size: int
    file_type: int
    entropy: float
    strings_count: int
    suspicious_strings: int

@app.post("/predict/file")
async def predict_file(data: FileInput):
# async def predict_file(data: FileInput, x_api_key: str = Header(...)):
    # Validate API key
    # await validate_api_key(x_api_key)
    
    df = pd.DataFrame([data.dict()])
    result = malware_model.predict(df)[0]
    return {"malicious": bool(result)}


# Input data schema for Email/SMS content
class EmailSMSInput(BaseModel):
    message: str

# Prediction endpoint
@app.post("/predict/email_sms")
async def predict_email_sms(data: EmailSMSInput):
    # Transform the message using the vectorizer
    message_vector = vectorizer.transform([data.message])
    
    # Make prediction using the loaded model
    result = email_sms_model.predict(message_vector)[0]
    
    # Return the prediction result
    return {"phishing": bool(result)}

# User registration model
class UserRegistration(BaseModel):
    email: EmailStr
    password: str

@app.post("/register")
async def register_user(user: UserRegistration):
    try:
        # Hash the password using SHA256
        password_hash = hashlib.sha256(user.password.encode()).hexdigest()
        
        # Generate a unique API key
        api_key = str(uuid.uuid4())
        
        # Connect to the database
        conn = sqlite3.connect('phishguard.db')
        cursor = conn.cursor()
        
        # Check if user already exists
        cursor.execute("SELECT email FROM users WHERE email = ?", (user.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Insert new user
        cursor.execute(
            "INSERT INTO users (email, password_hash, api_key) VALUES (?, ?, ?)",
            (user.email, password_hash, api_key)
        )
        conn.commit()
        conn.close()
        
        return {"message": "Registration successful", "api_key": api_key}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# User login model
class UserLogin(BaseModel):
    email: EmailStr
    password: str

@app.post("/login")
async def login_user(user: UserLogin):
    try:
        # Hash the provided password
        password_hash = hashlib.sha256(user.password.encode()).hexdigest()
        
        # Connect to the database
        conn = sqlite3.connect('phishguard.db')
        cursor = conn.cursor()
        
        # Check credentials
        cursor.execute(
            "SELECT api_key FROM users WHERE email = ? AND password_hash = ?",
            (user.email, password_hash)
        )
        result = cursor.fetchone()
        conn.close()
        
        if not result:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        return {"message": "Login successful", "api_key": result[0]}
        
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

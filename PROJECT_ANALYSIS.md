# PhishGuard Project Analysis

## 📋 Project Overview
PhishGuard is a comprehensive security scanning application that detects phishing URLs, malicious files, and suspicious email/SMS messages using machine learning models.

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI 0.68.1
- **Server**: Uvicorn 0.15.0 (ASGI server)
- **Language**: Python 3.x
- **Database**: SQLite3 (phishguard.db)
- **Location**: `backend/`

### Frontend
- **Technology**: Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS (via CDN)
- **Libraries**: 
  - html5-qrcode@2.3.8 (for QR code scanning)
- **Location**: `frontend/`

### Machine Learning
- **Framework**: scikit-learn 0.24.2
- **Data Processing**: pandas 1.3.3
- **Model Serialization**: joblib 1.0.1
- **Models**:
  1. **Phishing URL Model** (`phishing_model/phish_model.pkl`)
  2. **File Malware Model** (`file_malware/rf_model.pkl`)
  3. **Email/SMS Phishing Model** (`email_sms_model/email_sms_model.pkl`)
  4. **Text Vectorizer** (`email_sms_model/vectorizer.pkl`)

## 🔌 API Endpoints

### Prediction Endpoints
1. **POST `/predict/url`**
   - Input: `{ "url": "string" }`
   - Output: `{ "phishing": boolean }`
   - Features extracted: URL length, special characters, protocol, digits

2. **POST `/predict/file`**
   - Input: `{ "file_size": int, "file_type": int, "entropy": float, "strings_count": int, "suspicious_strings": int }`
   - Output: `{ "malicious": boolean }`
   - Analyzes file characteristics for malware detection

3. **POST `/predict/email_sms`**
   - Input: `{ "message": "string" }`
   - Output: `{ "phishing": boolean }`
   - Uses text vectorization and ML model for classification

### Authentication Endpoints
4. **POST `/register`**
   - Input: `{ "email": "string", "password": "string" }`
   - Output: `{ "message": "string", "api_key": "uuid" }`
   - Creates user account with SHA256 password hashing

5. **POST `/login`**
   - Input: `{ "email": "string", "password": "string" }`
   - Output: `{ "message": "string", "api_key": "uuid" }`
   - Returns API key for authenticated requests

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    api_key TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## 🔒 Security Features

1. **Password Hashing**: SHA256 (Note: Consider upgrading to bcrypt/argon2 for production)
2. **API Key Authentication**: UUID-based API keys (currently commented out in endpoints)
3. **CORS**: Configured to allow all origins (consider restricting in production)
4. **Input Validation**: Pydantic models for request validation

## 📁 Project Structure

```
phishguard/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── init_db.py              # Database initialization
│   ├── phishguard.db           # SQLite database
│   ├── requirements.txt        # Python dependencies
│   ├── phishing_model/         # URL phishing detection model
│   ├── file_malware/           # File malware detection model
│   └── email_sms_model/        # Email/SMS phishing detection model
├── frontend/
│   ├── index.html              # Main application page
│   ├── script.js               # Frontend logic
│   ├── about.html              # About page
│   ├── contact.html            # Contact page
│   ├── pricing.html            # Pricing page
│   └── developer.html          # Developer page
├── datasets/                   # Training datasets
└── venv/                       # Python virtual environment
```

## 🚀 Running the Project

### Backend Setup
```bash
cd backend
python init_db.py  # Initialize database (if not already done)
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend
- Open `frontend/index.html` in a web browser
- Or serve using a local web server (e.g., `python -m http.server`)

### API Documentation
- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

## 🔍 Code Analysis

### Backend Highlights
- **Async/Await**: All endpoints use async functions for better performance
- **Error Handling**: HTTPException for proper error responses
- **Model Loading**: ML models loaded at application startup
- **CORS Middleware**: Configured for cross-origin requests

### Frontend Highlights
- **Tab-based UI**: Multiple scanning modes (URL, File, Email/SMS, QR Code)
- **File Processing**: Client-side file analysis (entropy, string detection)
- **QR Code Scanning**: Camera-based and file upload support
- **Responsive Design**: Mobile-friendly with Tailwind CSS

## ⚠️ Notes & Recommendations

1. **API Key Authentication**: Currently disabled in prediction endpoints (commented out)
2. **Password Security**: SHA256 is fast but not ideal for password hashing; consider bcrypt
3. **CORS Configuration**: Currently allows all origins; restrict in production
4. **Error Handling**: Could be more granular with specific error types
5. **Model Paths**: Uses relative paths; ensure running from backend directory
6. **Database Connection**: Creates new connection per request; consider connection pooling

## 📊 Dependencies

### Backend Requirements
- fastapi==0.68.1
- uvicorn==0.15.0
- pydantic==1.8.2
- joblib==1.0.1
- pandas==1.3.3
- scikit-learn==0.24.2

### Frontend Dependencies (CDN)
- Tailwind CSS (via CDN)
- html5-qrcode@2.3.8

## 🎯 Features

1. **URL Phishing Detection**: Analyzes URL characteristics
2. **File Malware Detection**: Scans files for malicious patterns
3. **Email/SMS Phishing Detection**: Text-based phishing detection
4. **QR Code Scanning**: Scan QR codes and check URLs
5. **User Authentication**: Registration and login system
6. **API Key Management**: Generate and manage API keys

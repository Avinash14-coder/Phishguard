# URL phishing model training script placeholder
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os 

# Load dataset
dataset_path = os.path.abspath("../../datasets/phishing_site_urls.csv")
df = pd.read_csv(dataset_path)

df.columns = ['url', 'label']
df['label'] = df['label'].map({'bad': 1, 'good': 0})

# Feature extraction
def extract_features(url):
    return [
        len(url),                             # URL length
        url.count('@'),                       # '@' symbol count
        url.count('-'),                       # dash count
        url.count('https'),                   # https usage
        url.count('http'),                    # http usage
        url.count('.'),                       # number of dots
        url.startswith("https"),              # starts with https
        url.startswith("http"),               # starts with http
        int(any(char.isdigit() for char in url))  # contains digits
    ]

# Apply feature extraction
features = df['url'].apply(extract_features)
X = pd.DataFrame(features.tolist())
y = df['label']

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate model
y_pred = model.predict(X_test)
print("✅ Model Trained")
print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# Save model
model_output_path = os.path.abspath("phish_model.pkl")
joblib.dump(model, model_output_path)
print(f"✅ Model saved at {model_output_path}")

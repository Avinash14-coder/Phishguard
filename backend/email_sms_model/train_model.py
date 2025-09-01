# Email/SMS phishing model training script placeholder convert this code to create pkl file
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
import pickle
import os

# Create models directory if it doesn't exist
os.makedirs('models', exist_ok=True)

# Load and preprocess data
df = pd.read_csv('spam (1).csv')
df['spam'] = df['Category'].apply(lambda x: 1 if x == 'spam' else 0)
df.head()

# Split data
from sklearn.model_selection import train_test_split
x_test, x_train, y_test, y_train = train_test_split(df.Message, df.spam, test_size=0.2, random_state=42)

# Create and fit vectorizer
from sklearn.feature_extraction.text import CountVectorizer
v = CountVectorizer()
X_train_count = v.fit_transform(x_train.values)
X_train_count.toarray()[:2]

# Train model
from sklearn.naive_bayes import MultinomialNB
model = MultinomialNB()
model.fit(X_train_count, y_train)

# Save model and vectorizer
with open('models/email_sms_model.pkl', 'wb') as f:
    pickle.dump(model, f)

with open('models/vectorizer.pkl', 'wb') as f:
    pickle.dump(v, f)

# Print model accuracy
x_test_count = v.transform(x_test)
accuracy = model.score(x_test_count, y_test)
print(f"Model accuracy: {accuracy:.2f}")

# Test with sample emails
test_emails = [
    'Hello myname is Vedant',
    'The Meta information files you requested are now available to download. You can find your files on the download your information page.'
]

test_emails_count = v.transform(test_emails)
predictions = model.predict(test_emails_count)
print("\nTest predictions:")
for email, pred in zip(test_emails, predictions):
    print(f"Email: {email[:50]}... | Prediction: {'Spam' if pred == 1 else 'Not Spam'}")
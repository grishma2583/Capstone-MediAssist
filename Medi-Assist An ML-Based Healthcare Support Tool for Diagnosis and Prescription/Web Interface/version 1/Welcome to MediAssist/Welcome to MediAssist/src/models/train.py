import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, confusion_matrix
from sklearn.ensemble import RandomForestClassifier, StackingClassifier
from xgboost import XGBClassifier
from sklearn.linear_model import LogisticRegression
import joblib

print("All libraries imported successfully!")

# Load dataset
dataset = pd.read_csv("src/data/Training_data.csv")
print(f"Dataset loaded successfully! Shape: {dataset.shape}")

# Data preprocessing
dataset.columns = dataset.columns.str.lower().str.strip()
dataset = dataset.dropna()

# Encode categorical features
le = LabelEncoder()
for col in dataset.columns:
    if dataset[col].dtype == 'object':
        dataset[col] = le.fit_transform(dataset[col])

print("Data preprocessing completed.")

# Split data
X = dataset.drop('prognosis', axis=1)
y = dataset['prognosis']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

print("Data split completed.")

# Build hybrid model
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
xgb_model = XGBClassifier(n_estimators=200, learning_rate=0.05, max_depth=6, random_state=42, use_label_encoder=False, eval_metric='mlogloss')

hybrid_model = StackingClassifier(
    estimators=[('rf', rf_model), ('xgb', xgb_model)],
    final_estimator=LogisticRegression(max_iter=1000),
    cv=5,
    n_jobs=-1
)

print("Training the Hybrid Model...")
hybrid_model.fit(X_train, y_train)

# Save model
joblib.dump(hybrid_model, "src/models/hybrid_model.pkl")
print("Model saved as hybrid_model.pkl")

# Evaluate
y_pred = hybrid_model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, average='macro')
recall = recall_score(y_test, y_pred, average='macro')

print(f"Accuracy: {accuracy * 100:.2f}%")
print(f"Precision: {precision:.4f}")
print(f"Recall: {recall:.4f}")

# Load additional data
description = pd.read_csv("src/data/description.csv")
precautions = pd.read_csv("src/data/precautions_df.csv")
medications = pd.read_csv("src/data/medications.csv")

# Create symptoms and diseases dictionaries
symptoms_dict = {symptom: idx for idx, symptom in enumerate(X.columns)}
diseases_list = {idx: disease for idx, disease in enumerate(le.classes_)}

# Save dictionaries
joblib.dump(symptoms_dict, "src/models/symptoms_dict.pkl")
joblib.dump(diseases_list, "src/models/diseases_list.pkl")

print("Training completed and model saved.")

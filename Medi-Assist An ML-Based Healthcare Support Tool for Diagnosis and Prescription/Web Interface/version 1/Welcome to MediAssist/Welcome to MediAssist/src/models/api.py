from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load training data and dictionaries
dataset = pd.read_csv("src/data/Training_data.csv")
symptoms_dict = joblib.load("src/models/symptoms_dict.pkl")
diseases_list = joblib.load("src/models/diseases_list.pkl")

# Load additional data
description = pd.read_csv("src/data/description.csv")
precautions = pd.read_csv("src/data/precautions_df.csv")
medications = pd.read_csv("src/data/medications.csv")

def get_disease_details(disease):
    desc = description.loc[description['Disease'] == disease, 'Description'].values
    pre = precautions.loc[precautions['Disease'] == disease].drop(columns=['Disease'], errors='ignore').values.tolist()
    med = medications.loc[medications['Disease'] == disease].drop(columns=['Disease'], errors='ignore').values.flatten().tolist()

    desc_text = desc[0] if len(desc) > 0 else "Description not available."
    precautions_list = pre[0] if len(pre) > 0 else ["No precautions available."]

    # Process medications to ensure it's a list
    if len(med) > 0:
        if isinstance(med[0], str):
            # If it's a comma-separated string, split it
            medications_list = [m.strip() for m in med[0].split(',') if m.strip()]
        else:
            # If it's already a list or other format, convert to list
            medications_list = [str(m).strip() for m in med if str(m).strip()]
    else:
        medications_list = ["No medications available."]

    return desc_text, precautions_list, medications_list

def predict_disease(symptoms_list):
    """
    Takes a list of symptoms and returns the predicted disease name
    based on maximum symptom matches (1's) from the dataset.
    """
    print(f"DEBUG: Symptoms sent for prediction: {symptoms_list}")

    # --- Identify Disease column automatically ---
    disease_col = None
    for col in dataset.columns:
        if col.lower() in ['disease', 'prognosis', 'label', 'diagnosis']:
            disease_col = col
            break

    if disease_col is None:
        raise KeyError(" Could not find disease column in dataset!")

    symptom_columns = [col for col in dataset.columns if col != disease_col]
    dataset_copy = dataset.copy()

    # --- Compute match score for each row ---
    match_scores = []
    for _, row in dataset_copy.iterrows():
        score = sum(row[sym] == 1 for sym in symptoms_list if sym in symptom_columns)
        match_scores.append(score)

    dataset_copy['match_score'] = match_scores

    # --- Find best match row ---
    best_match = dataset_copy.loc[dataset_copy['match_score'].idxmax()]
    raw_prediction = best_match[disease_col]

    # --- Convert numeric code to actual disease name ---
    if isinstance(raw_prediction, (int, float)) and raw_prediction in diseases_list:
        predicted_disease = diseases_list[int(raw_prediction)]
    else:
        predicted_disease = str(raw_prediction)

    print(f" Predicted disease: {predicted_disease}")
    return predicted_disease

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})

    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        symptoms = data.get('symptoms', [])
        if not symptoms:
            return jsonify({'error': 'No symptoms provided'}), 400

        user_symptoms = [s.strip().lower() for s in symptoms]

        predicted_disease = predict_disease(user_symptoms)
        desc, pre, med = get_disease_details(predicted_disease)

        result = {
            'disease': predicted_disease,
            'description': desc,
            'precautions': pre,
            'medications': med
        }

        return jsonify(result)
    except Exception as e:
        print(f"Error in predict endpoint: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Disease Prediction API is running!'})

@app.route('/welcome', methods=['GET'])
def welcome():
    return jsonify({'message': 'Welcome to the Disease Prediction API!'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

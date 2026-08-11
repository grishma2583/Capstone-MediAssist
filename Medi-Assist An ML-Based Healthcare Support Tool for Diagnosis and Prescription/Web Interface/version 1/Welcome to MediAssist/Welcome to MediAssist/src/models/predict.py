import pandas as pd
import joblib
import numpy as np
import sys

# Load model and dictionaries
hybrid_model = joblib.load("src/models/hybrid_model.pkl")
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
    medications_list = med if len(med) > 0 else ["No medications available."]

    return desc_text, precautions_list, medications_list

def predict_disease(symptoms_list):
    # Create input vector
    input_vector = np.zeros(len(symptoms_dict))
    for symptom in symptoms_list:
        if symptom in symptoms_dict:
            input_vector[symptoms_dict[symptom]] = 1

    # Predict
    prediction = hybrid_model.predict([input_vector])[0]
    predicted_disease = diseases_list[prediction]

    return predicted_disease

if __name__ == "__main__":
    if len(sys.argv) > 1:
        symptoms = sys.argv[1]
    else:
        symptoms = input("Enter your symptoms (comma-separated): ")
    user_symptoms = [s.strip().lower() for s in symptoms.split(',')]

    predicted_disease = predict_disease(user_symptoms)
    desc, pre, med = get_disease_details(predicted_disease)

    print(f"Predicted disease: {predicted_disease}")
    print(f"Description: {desc}")
    print(f"Precautions: {pre}")
    print(f"Medications: {med}")

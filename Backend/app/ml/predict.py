import os
import joblib
import pandas as pd
from app.ml.train import FEATURE_COLUMNS, train_model

MODEL_DATA = None

def get_model():
    global MODEL_DATA
    if MODEL_DATA is not None:
        return MODEL_DATA

    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    model_path = os.path.join(base_dir, 'app', 'ml', 'model.pkl')

    if not os.path.exists(model_path):
        train_model()

    MODEL_DATA = joblib.load(model_path)
    return MODEL_DATA

def predict_student(student_data: dict) -> dict:
    model_dict = get_model()
    model = model_dict['model']
    classes = list(model.classes_)

    input_df = pd.DataFrame([student_data])[FEATURE_COLUMNS]

    prediction = model.predict(input_df)[0]
    probabilities_raw = model.predict_proba(input_df)[0]

    prob_dict = {cls.lower(): float(prob) for cls, prob in zip(classes, probabilities_raw)}

    # Ensure all required probability fields are present
    probabilities = {
        'at_risk': round(prob_dict.get('at_risk', 0.0), 2),
        'needs_attention': round(prob_dict.get('needs_attention', 0.0), 2),
        'on_track': round(prob_dict.get('on_track', 0.0), 2)
    }

    return {
        'prediction': prediction,
        'probabilities': probabilities,
        'is_temporary': False,
        'note': 'ML prediction computed by trained Random Forest Model.'
    }

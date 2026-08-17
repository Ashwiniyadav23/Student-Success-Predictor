import os
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier

FEATURE_COLUMNS = [
    'attendance',
    'assignment_completion',
    'test_average',
    'coding_hours',
    'goals_completed',
    'projects_completed',
    'interview_practice_hours'
]

def train_model(csv_path: str = None, save_path: str = None):
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    if csv_path is None:
        csv_path = os.path.join(base_dir, 'data', 'students.csv')
    if save_path is None:
        save_path = os.path.join(base_dir, 'app', 'ml', 'model.pkl')

    df = pd.read_csv(csv_path)
    X = df[FEATURE_COLUMNS]
    y = df['label']

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)

    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    joblib.dump({
        'model': model,
        'feature_names': FEATURE_COLUMNS,
        'classes': list(model.classes_)
    }, save_path)

    print(f"Model successfully trained and saved to {save_path}")
    return model

if __name__ == '__main__':
    train_model()

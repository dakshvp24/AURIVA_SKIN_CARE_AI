"""
AURIVA Clinical Dermatology ML Training Pipeline
=================================================
Trains a Random Forest classifier on clinical skin records to diagnose
dermatological conditions, assess risk severity, and serialize the trained
model, preprocessor, and validation metrics for the FastAPI inference service.
"""

import os
from typing import Dict, Any, List, Tuple
import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder

# ==============================================================================
# Pipeline Configuration & Constants
# ==============================================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_SAVE_PATH = os.path.join(BASE_DIR, "model.joblib")

DATASET_CANDIDATE_PATHS = [
    os.path.join(BASE_DIR, "..", "public", "datasets", "dermaai_skin_dataset.csv"),
    os.path.join(BASE_DIR, "..", "public", "dermaai_skin_dataset.csv"),
    os.path.join(BASE_DIR, "dermaai_skin_dataset.csv"),
]

FEATURE_COLS = [
    "skin_type",
    "sensitivity_level",
    "oil_level",
    "dryness_level",
    "redness_level",
    "pigmentation_level",
    "acne_severity",
    "symptoms",
    "affected_area",
    "age",
]

CATEGORICAL_COLS = [
    "skin_type",
    "sensitivity_level",
    "oil_level",
    "dryness_level",
    "redness_level",
    "pigmentation_level",
    "acne_severity",
    "symptoms",
    "affected_area",
]

NUMERICAL_COLS = ["age"]

TARGET_COL = "target_condition"

RANDOM_STATE = 42
TEST_SPLIT_RATIO = 0.20
N_ESTIMATORS = 150
MAX_DEPTH = 12


# ==============================================================================
# Helper & Training Functions
# ==============================================================================

def resolve_dataset_path() -> str:
    """Finds and returns the absolute path to the clinical skin dataset."""
    for path in DATASET_CANDIDATE_PATHS:
        normalized = os.path.normpath(path)
        if os.path.exists(normalized):
            return normalized
    raise FileNotFoundError(
        f"Clinical skin dataset could not be found. Checked candidate paths:\n"
        + "\n".join(f" - {os.path.normpath(p)}" for p in DATASET_CANDIDATE_PATHS)
    )


def load_and_validate_dataset(csv_path: str) -> pd.DataFrame:
    """Loads CSV dataset and verifies presence of all required columns."""
    print(f"[*] Loading clinical skin dataset from: {csv_path}")
    df = pd.read_csv(csv_path)
    print(f"[OK] Dataset loaded successfully. Total records: {len(df):,}")

    missing_features = [col for col in FEATURE_COLS if col not in df.columns]
    if missing_features:
        raise ValueError(f"Dataset missing required feature columns: {missing_features}")

    if TARGET_COL not in df.columns:
        raise ValueError(f"Dataset missing target column: '{TARGET_COL}'")

    return df


def build_preprocessor() -> ColumnTransformer:
    """Constructs the ColumnTransformer for categorical and numerical features."""
    return ColumnTransformer(
        transformers=[
            ("num", "passthrough", NUMERICAL_COLS),
            (
                "cat",
                OneHotEncoder(handle_unknown="ignore", sparse_output=False),
                CATEGORICAL_COLS,
            ),
        ]
    )


def train_and_evaluate(
    df: pd.DataFrame,
) -> Tuple[RandomForestClassifier, ColumnTransformer, Dict[str, Any]]:
    """Trains the Random Forest model and computes comprehensive evaluation metrics."""
    X = df[FEATURE_COLS].copy()
    y = df[TARGET_COL].copy()

    preprocessor = build_preprocessor()

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=TEST_SPLIT_RATIO,
        random_state=RANDOM_STATE,
        stratify=y,
    )

    print(f"[*] Training split: {len(X_train):,} samples | Test split: {len(X_test):,} samples")

    X_train_trans = preprocessor.fit_transform(X_train)
    X_test_trans = preprocessor.transform(X_test)

    clf = RandomForestClassifier(
        n_estimators=N_ESTIMATORS,
        max_depth=MAX_DEPTH,
        random_state=RANDOM_STATE,
    )
    clf.fit(X_train_trans, y_train)

    y_pred = clf.predict(X_test_trans)

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, average="weighted", zero_division=0))
    rec = float(recall_score(y_test, y_pred, average="weighted", zero_division=0))
    f1 = float(f1_score(y_test, y_pred, average="weighted", zero_division=0))
    conf_mat = confusion_matrix(y_test, y_pred).tolist()
    classes_list = [str(c) for c in clf.classes_]

    print("\n" + "=" * 55)
    print("           MODEL EVALUATION METRICS")
    print("=" * 55)
    print(f"  Accuracy:       {acc * 100:.2f}%")
    print(f"  Precision:      {prec * 100:.2f}% (weighted)")
    print(f"  Recall:         {rec * 100:.2f}% (weighted)")
    print(f"  F1-Score:       {f1 * 100:.2f}% (weighted)")
    print(f"  Target Classes: {classes_list}")
    print("=" * 55 + "\n")

    metrics_payload = {
        "accuracy": round(acc * 100, 2),
        "precision": round(prec * 100, 2),
        "recall": round(rec * 100, 2),
        "f1_score": round(f1 * 100, 2),
        "confusion_matrix": conf_mat,
        "classes": classes_list,
        "total_samples": len(df),
    }

    return clf, preprocessor, metrics_payload


def save_model_artifact(
    clf: RandomForestClassifier,
    preprocessor: ColumnTransformer,
    metrics: Dict[str, Any],
    save_path: str = MODEL_SAVE_PATH,
) -> None:
    """Serializes the model, preprocessor, and metrics to disk."""
    payload = {
        "model": clf,
        "preprocessor": preprocessor,
        "feature_cols": FEATURE_COLS,
        "target_classes": metrics["classes"],
        "metrics": metrics,
    }
    joblib.dump(payload, save_path)
    print(f"[OK] Model artifact successfully serialized to:\n     {save_path}")


def train_skin_condition_model() -> Dict[str, Any]:
    """Orchestrates the end-to-end dataset loading, training, and artifact serialization."""
    csv_path = resolve_dataset_path()
    df = load_and_validate_dataset(csv_path)
    clf, preprocessor, metrics = train_and_evaluate(df)
    save_model_artifact(clf, preprocessor, metrics)
    return metrics


# ==============================================================================
# Script Entry Point
# ==============================================================================

if __name__ == "__main__":
    train_skin_condition_model()

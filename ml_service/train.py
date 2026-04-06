"""
Optional offline training: fits a small classifier on synthetic data and saves
`artifacts/model.joblib` (same featurization as `app.py`).

For a real LSTM pipeline, replace this with sequence data + Keras/TF and load
weights in `app.py` instead of sklearn — structure is intentionally separate.
"""

from __future__ import annotations

import hashlib
import os
import sys

import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib


def featurize(data: object) -> np.ndarray:
    raw = str(data).encode()
    digest = hashlib.sha256(raw).digest()
    return np.array(
        [
            [
                float(len(raw) % 1000),
                float(sum(raw[: min(len(raw), 128)]) % 1000),
                float(int.from_bytes(digest[:8], "big") % 10000) / 10000.0,
            ]
        ],
        dtype=np.float64,
    )


def main() -> None:
    rng = np.random.RandomState(42)
    n = 500
    xs = []
    ys = []
    for _ in range(n):
        payload = rng.bytes(int(rng.randint(16, 256)))
        label = int((sum(payload) % 17) > 8)  # synthetic noisy label
        xs.append(featurize(payload)[0])
        ys.append(label)

    X = np.vstack(xs)
    y = np.array(ys)

    clf = RandomForestClassifier(n_estimators=40, random_state=42, max_depth=8)
    clf.fit(X, y)

    out_dir = os.path.join(os.path.dirname(__file__), "artifacts")
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, "model.joblib")
    joblib.dump(clf, path)
    print(f"Wrote {path}", file=sys.stderr)


if __name__ == "__main__":
    main()

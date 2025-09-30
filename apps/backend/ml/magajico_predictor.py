import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler


class MagajiCoMLPredictor:

    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100,
                                            max_depth=10,
                                            random_state=42)
        self.scaler = StandardScaler()
        self._train_model()

    def _train_model(self):
        np.random.seed(42)
        X_train = np.random.rand(1000, 7)  # 7 features
        y_train = []

        for features in X_train:
            home_strength = features[0] + features[3] - features[4]
            away_strength = features[1] + features[5] - features[6]

            if home_strength > away_strength + 0.3:
                y_train.append(0)  # home win
            elif away_strength > home_strength + 0.3:
                y_train.append(2)  # away win
            else:
                y_train.append(1)  # draw

        X_train_scaled = self.scaler.fit_transform(X_train)
        self.model.fit(X_train_scaled, y_train)

    def predict(self, features: list[float]):
        features_array = np.array([features])
        features_scaled = self.scaler.transform(features_array)

        probabilities = self.model.predict_proba(features_scaled)[0]
        prediction_index = np.argmax(probabilities)
        outcomes = ['home', 'draw', 'away']

        return {
            'prediction': outcomes[prediction_index],
            'confidence': float(np.max(probabilities)),
            'probabilities': {
                'home': float(probabilities[0]),
                'draw': float(probabilities[1]),
                'away': float(probabilities[2])
            }
        }

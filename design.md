
Project: RAYZA – A Digital Psychological Support System for Students

---

## 1. Model Objective
The goal of the RAYZA model is to:
- Detect psychological risk signals
- Avoid false alerts caused by repetitive or casual keyword usage
- Identify sudden deviations in user behavior

---

## 2. Input Signals

Each user message contributes the following signals:

- Emotional intensity score (0–1)
- Keyword severity weight
- Message frequency
- Historical behavioral context

---

## 3. Session Risk Calculation

For each message:

Session Risk =  
(Emotion Score × Emotion Weight)  
+ (Keyword Severity × Keyword Weight)

This produces a **temporary risk score** for the session.

---

## 4. Behavioral Baseline (EMA)

### 4.1 Purpose
To understand what is *normal* for a specific user and avoid overreacting to repeated behavior.

### 4.2 Method
The system uses **Exponential Moving Average (EMA)**:

EMAₜ = α × Current Risk + (1 − α) × EMAₜ₋₁

Where:
- EMAₜ = updated baseline
- α (alpha) = smoothing factor (e.g., 0.1–0.3)

---

## 5. Deviation Detection

Deviation =  
Current Session Risk − EMA Baseline

- Small deviation → normal behavior
- Large deviation → abnormal psychological signal

---

## 6. Spam & Habitual Keyword Handling

To prevent misuse:
- Repeated identical keywords reduce their weight
- High-frequency usage lowers incremental risk
- Only **novel or intensified patterns** increase alerts

This ensures:
- Casual misuse does not trigger alerts
- Genuine distress patterns are still detected

---

## 7. Alert Logic

Alerts are triggered when:
- Deviation exceeds predefined thresholds
- Risk remains elevated across multiple sessions

### Alert Levels:
- Low: mild deviation
- Medium: sustained abnormal behavior
- High: sudden or extreme deviation

---

## 8. Output

The model outputs:
- Updated EMA baseline
- Current risk score
- Alert status (if any)

---

## 9. Limitations
- Relies on textual input only
- Cultural and linguistic nuances may affect accuracy

---

## 10. Future Improvements
- ML-based emotion classifiers
- Context-aware transformers
- Adaptive threshold learning

---

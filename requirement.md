
Project: RAYZA – A Digital Psychological Support System for Students

---

## 1. Introduction

### 1.1 Purpose
This document defines the functional and non-functional requirements of **RAYZA**, a system designed to monitor students’ psychological well-being through conversational analysis and dynamic risk evaluation.

### 1.2 Scope
RAYZA provides:
- AI-assisted emotional support via chat
- Behavioral risk analysis
- Early warning alerts for potential mental distress

The system does not perform medical diagnosis and does not replace professional care.

---

## 2. Users

### 2.1 Target Users
- Students (primary users)
- Counselors / mentors
- System administrators

---

## 3. Functional Requirements

### FR-1 User Interaction
- The system shall accept text-based messages from users.
- The system shall respond with supportive, empathetic messages.

### FR-2 Emotion Analysis
- The system shall analyze user messages to detect emotional signals.
- The system shall assign an emotion intensity score to each message.

### FR-3 Risk Scoring
- The system shall calculate a risk score per interaction.
- Risk scores shall be normalized on a fixed scale (e.g., 0–100).

### FR-4 Behavioral Baseline
- The system shall maintain a personalized behavioral baseline for each user.
- Baseline shall be updated dynamically using Exponential Moving Average (EMA).

### FR-5 Spam & Repetition Handling
- The system shall detect repeated or habitual keyword usage.
- Repetitive behavior shall have reduced impact on risk escalation.

### FR-6 Alert Generation
- The system shall trigger alerts when abnormal risk deviations occur.
- Alerts shall be classified into levels (Low / Medium / High).

### FR-7 Data Storage
- The system shall store user interaction metadata securely.
- Sensitive content shall be anonymized where applicable.

---

## 4. Non-Functional Requirements

### 4.1 Performance
- Average response time ≤ 2 seconds.
- Support concurrent users.

### 4.2 Security
- Secure authentication mechanisms.
- Encrypted storage and communication.

### 4.3 Reliability
- System uptime target: 99%.

### 4.4 Privacy & Ethics
- User data confidentiality must be preserved.
- No misuse of psychological data.

---

## 5. Constraints
- Text-based analysis only (initial version).
- No clinical diagnosis or treatment recommendation.

---

## 6. Future Enhancements
- Voice input analysis
- Multilingual support
- Advanced ML-based personalization

---

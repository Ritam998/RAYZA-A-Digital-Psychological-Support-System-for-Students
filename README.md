# RAYZA  
### A Digital Psychological Support System for Higher Education Students

RAYZA is a full-stack, AI-assisted digital mental health and psychological support platform designed to provide accessible, stigma-free, and institution-integrated mental health assistance for students in higher education.

The system addresses the growing mental health challenges faced by college students, including anxiety, depression, academic stress, burnout, sleep disorders, and social isolation, particularly in rural and semi-urban educational institutions where access to mental health resources is limited.

---

## Problem Statement

Mental health concerns among college students have increased significantly in recent years. Despite this, most higher education institutions lack a structured, scalable, and stigma-free psychological support system.

Key challenges include:
* Absence of early detection and preventive mental health tools
* Under-utilization of counselling services due to stigma or lack of awareness
* Lack of centralized, data-driven insights for institutional decision-making
* Limited availability of culturally contextualized and region-specific resources

Existing mental health applications are often generic, paid, or not institution-specific, making them unsuitable for integration within college ecosystems.

---

## Proposed Solution

RAYZA provides a **customizable, institution-centric digital platform** that combines AI-driven psychological first aid, peer support, professional counselling integration, and anonymized analytics to support both students and institutional stakeholders.

The platform is designed to be:
* Confidential and stigma-free
* Culturally adaptable and region-aware
* Scalable across institutions
* Data-informed without compromising privacy

---

## Core Features

### 1. AI-Guided Psychological First Aid
* Interactive chat-based support system
* Sentiment analysis–driven responses
* Immediate coping strategies and emotional regulation techniques
* Smart escalation to professional support when risk thresholds are detected

### 2. Sentiment Analysis & Screening Tools
* Machine learning–based sentiment analysis model
* Integration of standard psychological screening instruments:
  - PHQ-9 (Depression)
* Early identification of mental health risk patterns

### 3. Confidential Counselling & Booking System
* Secure appointment scheduling with on-campus counsellors or mental health helplines
* Privacy-preserving design to reduce fear of judgment
* Institution-specific customization

### 4. Psychoeducational Resource Hub
* Mental wellness guides, videos, and relaxation audio
* Content tailored to student mental health needs
* Support for regional languages and cultural context

### 5. Peer Support Platform
* Moderated peer-to-peer support forum
* Trained student volunteers
* Safe discussion spaces under supervision

### 6. Administrative Analytics Dashboard
* Built using Streamlit
* Anonymous, aggregated mental health trend analysis
* Helps authorities identify stress patterns and plan interventions
* No individual-level identification or tracking

---

## System Architecture Overview

RAYZA follows a modular, full-stack architecture:

* **Frontend**:  
  Built with **React + Vite**, providing a responsive and user-friendly interface for students.

* **Backend & Database**:  
  Backend services integrated with **MongoDB** for flexible, schema-less data storage.  
  Database interactions and internal tools are handled using **Python and Streamlit** where applicable.

* **Machine Learning Layer**:  
  Custom sentiment analysis model developed for psychological text analysis.  
  Screening tools implemented as independent ML modules for reuse and scalability.

* **Dashboard & Analytics**:  
  Administrative dashboard developed using **Streamlit**, offering real-time anonymized insights.

Each module is designed to function independently while remaining seamlessly integrated into the overall system.

---

## Technology Stack

* **Frontend**: React, Vite
* **Backend / Services**: Python
* **Database**: MongoDB
* **Machine Learning**: Python (custom NLP & sentiment analysis models)
* **Dashboard & Visualization**: Streamlit
* **Version Control**: Git & GitHub

---

## Data Handling & Privacy

* No real student data is used in this repository
* All datasets are anonymized or mock samples
* Screening results and sentiment outputs are aggregated
* The system is designed to prioritize privacy, ethical AI use, and institutional responsibility

---

## Team Information

**Project Name:** RAYZA  
**Team Name:** Nemesis  

This project was collaboratively developed by Team Nemesis, with responsibilities distributed across:
* Machine learning and sentiment analysis
* Backend development and database integration
* Frontend interface development
* Dashboard design and analytics
* UI/UX research and design

Individual contributions are documented through version control and modular ownership.

---

## Future Scope

* Mobile application integration
* Multilingual NLP expansion
* Deployment within real institutional environments
* Integration with national and regional mental health helplines
* Advanced risk prediction and alert systems

---

## Disclaimer

RAYZA is an academic and research-oriented project intended to support mental health awareness and institutional planning.  
It is **not a replacement for professional medical or psychological treatment**.

---







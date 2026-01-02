import os
import pandas as pd
import streamlit as st
import plotly.express as px


# PAGE CONFIG

st.set_page_config(
    page_title="Mental Health Dashboard",
    page_icon="🧠",
    layout="wide"
)

st.title("🧠 Mental Health Analysis Dashboard")
st.markdown("Interactive dashboard for Mental Health Dataset")


# LOAD DATA (CORRECT FILE NAME)

@st.cache_data
def load_data():
    file_path = os.path.join(os.getcwd(), "mental_health_dataset.csv")

    if not os.path.exists(file_path):
        st.error("❌ mental_health_dataset.csv not found in project folder")
        st.stop()

    df = pd.read_csv(file_path)
    return df

df = load_data()


# DATA PREVIEW

with st.expander("📂 View Dataset"):
    st.dataframe(df, use_container_width=True)


# SIDEBAR FILTERS

st.sidebar.header("🔎 Filters")

# Gender filter
gender_filter = st.sidebar.multiselect(
    "Gender",
    df["gender"].unique(),
    default=df["gender"].unique()
)
df = df[df["gender"].isin(gender_filter)]

# Employment status
employment_filter = st.sidebar.multiselect(
    "Employment Status",
    df["employment_status"].unique(),
    default=df["employment_status"].unique()
)
df = df[df["employment_status"].isin(employment_filter)]

# Age filter
age_min, age_max = int(df["age"].min()), int(df["age"].max())
age_range = st.sidebar.slider(
    "Age Range",
    age_min,
    age_max,
    (age_min, age_max)
)
df = df[(df["age"] >= age_range[0]) & (df["age"] <= age_range[1])]


# KPI METRICS

st.subheader("📌 Key Metrics")

k1, k2, k3 = st.columns(3)

k1.metric("Total Participants", len(df))
k2.metric("Average Stress Level", round(df["stress_level"].mean(), 2))
k3.metric("Average Sleep Hours", round(df["sleep_hours"].mean(), 2))

st.divider()


# VISUALIZATIONS

st.subheader("📊 Visual Analysis")

c1, c2 = st.columns(2)

# Stress level by gender
with c1:
    fig1 = px.box(
        df,
        x="gender",
        y="stress_level",
        title="Stress Level by Gender"
    )
    st.plotly_chart(fig1, use_container_width=True)

# Sleep hours distribution
with c2:
    fig2 = px.histogram(
        df,
        x="sleep_hours",
        nbins=20,
        title="Sleep Hours Distribution"
    )
    st.plotly_chart(fig2, use_container_width=True)


c3, c4 = st.columns(2)

with c3:
    fig3 = px.scatter(
        df,
        x="stress_level",
        y="depression_score",
        color="gender",
        title="Stress vs Depression"
    )
    st.plotly_chart(fig3, use_container_width=True)

with c4:
    fig4 = px.scatter(
        df,
        x="stress_level",
        y="anxiety_score",
        color="gender",
        title="Stress vs Anxiety"
    )
    st.plotly_chart(fig4, use_container_width=True)


st.subheader("📋 Filtered Data")
st.dataframe(df, use_container_width=True)


st.markdown("---")
st.markdown("📘 **Project:** Mental Health Dashboard")
st.markdown("🛠 **Tools:** Python, Pandas, Streamlit, Plotly")

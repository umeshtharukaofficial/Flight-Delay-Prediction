# ✈️ Flight Delay Prediction: Regression Modeling with XGBoost, LSTM, and Random Forest

## 📌 Project Overview

Flight delays affect millions of passengers and cost the aviation industry billions of dollars annually. Accurate prediction of arrival delays can enable better scheduling, improved passenger experience, and optimized resource allocation for airlines and airports. This project presents a comprehensive machine learning pipeline for **predicting total arrival delay (in minutes)** based on historical aggregated airline delay data from U.S. domestic flights.

---

## 🎯 Objective

The primary objective is to **build predictive models that estimate total flight arrival delays** using various causes of delay (carrier, weather, NAS, security, late aircraft) and contextual features (airport, airline, year, month). We evaluate and compare multiple regression models, including:

- 📈 **XGBoost Regressor**  
- 🧠 **LSTM Neural Network (Deep Learning)**  
- 🌲 **Random Forest Regressor**

---

## 📂 Dataset

- **Source**: Kaggle - Airline Delay Dataset (`sriharshaeedala/airline-delay`)
- **Data Type**: Monthly aggregated arrival statistics per airport/carrier
- **Features**:
  - `year`, `month`, `airport`, `carrier`
  - Delay causes: `carrier_delay`, `weather_delay`, `nas_delay`, `security_delay`, `late_aircraft_delay`
  - Counts: `arr_flights`, `arr_cancelled`, `arr_diverted`, `arr_del15`
  - Target: `arr_delay` (total delay in minutes)

---

## 🧠 Key Features

### 🔍 Data Preprocessing
- Automatic extraction of zipped dataset
- Data validation and missing value imputation
- Feature engineering: `delay_ratio` (arr_del15 / arr_flights)
- One-hot encoding for categorical variables (`airport`, `carrier`)
- Standard scaling for numerical features

### 🤖 Machine Learning Models
- **XGBoost Regressor**: Gradient-boosted trees optimized for speed and accuracy
- **LSTM Neural Network**: Deep sequential model trained on reshaped time-step feature matrix
- **Random Forest Regressor**: Ensemble learning for robustness and feature ranking

### 📈 Model Evaluation Metrics
- Mean Absolute Error (MAE)
- Root Mean Squared Error (RMSE)
- R² Score
- Mean Absolute Percentage Error (MAPE)
- Visualizations:
  - Residual plots
  - Error distributions
  - Actual vs. Predicted plots

---

## 📊 Model Explainability

To increase trust and interpretability, the following explainability techniques are used:

- **Feature Importance (XGBoost and Random Forest)**  
- **Permutation Feature Importance**  
- **SHAP (SHapley Additive Explanations)**  
  - Beeswarm summary plot
  - Dependence plots for top predictors

---

## 📉 Exploratory Data Analysis

- Trend analysis of arrival delays over time
- Delay breakdown by:
  - Airport
  - Carrier
  - Cause
  - Year/month
- Heatmaps of feature correlations
- Distribution and pattern visualizations for `arr_delay` and other metrics

---

## 🧪 Insights and Operational Use Cases

- Airlines can proactively **adjust scheduling or staffing** during peak delay months
- Airports can **identify root causes** (e.g., weather vs. late aircraft) and take preventative steps
- **Passengers or travel platforms** could benefit from delay forecasts in real-time itinerary planning

---

## 🔮 Future Work

- Integrate real-time features (e.g., weather forecasts, live traffic)
- Build classification thresholds: On-time, Minor Delay, Major Delay
- Convert the models into an API with Flask/FastAPI
- Apply deep learning attention models or transformers for sequential delay patterns
- Validate on a separate dataset (e.g., by year or region) for generalization

---

## 💻 Technologies Used

- Python, NumPy, pandas, Matplotlib, Seaborn
- Scikit-learn
- TensorFlow/Keras
- XGBoost
- SHAP
- Google Colab

---

---

## 📌 Skills Demonstrated

- Data preprocessing and feature engineering
- Regression modeling (ML & DL)
- Evaluation metrics and visual diagnostics
- Model explainability and SHAP analysis
- Real-world domain understanding (aviation industry)
- Data visualization and trend exploration

---

## 👨‍💻 Author

**Umesh Tharuka Malaviarachchi**  

---

## 📜 License

This project is open-source and available under the MIT License.



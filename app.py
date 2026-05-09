from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

app = Flask(__name__)
CORS(app)

# DATABASE CONNECTION
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="1234",
    database="crypto_db"
)

# ==============================
# MAIN CRYPTO DATA API
# ==============================

@app.route('/crypto')
def get_crypto():

    cursor = db.cursor(dictionary=True)

    query = """
    SELECT 
        coin_name,
        full_date,
        price,
        price_change,
        moving_avg,
        volatility
    FROM crypto_prices
    ORDER BY full_date ASC
    """

    cursor.execute(query)

    data = cursor.fetchall()

    return jsonify(data)

# ==============================
# MACHINE LEARNING PREDICTION API
# ==============================

@app.route('/prediction')
def prediction():

    cursor = db.cursor(dictionary=True)

    query = """
    SELECT 
        full_date,
        price
    FROM crypto_prices
    WHERE coin_name='bitcoin'
    ORDER BY full_date ASC
    """

    cursor.execute(query)

    data = cursor.fetchall()

    # CONVERT TO DATAFRAME
    df = pd.DataFrame(data)

    # CREATE DAY INDEX
    df['day'] = np.arange(len(df))

    # FEATURES
    X = df[['day']]
    y = df['price']

    # TRAIN MODEL
    model = LinearRegression()
    model.fit(X, y)

    # FUTURE DAY PREDICTION
    future_day = np.array([[len(df) + 1]])

    predicted_price = model.predict(future_day)

    return jsonify({
        "coin": "Bitcoin",
        "predicted_next_price": round(float(predicted_price[0]), 2)
    })

# ==============================
# ANALYTICS API
# ==============================

@app.route('/analytics')
def analytics():

    cursor = db.cursor(dictionary=True)

    query = """
    SELECT 
        coin_name,
        AVG(price) as avg_price,
        MAX(price) as highest_price,
        MIN(price) as lowest_price,
        AVG(volatility) as avg_volatility
    FROM crypto_prices
    GROUP BY coin_name
    """

    cursor.execute(query)

    data = cursor.fetchall()

    return jsonify(data)

# ==============================
# PORTFOLIO MOCK API
# ==============================

@app.route('/portfolio')
def portfolio():

    portfolio_data = [
        {
            "coin": "Bitcoin",
            "holdings": 0.5,
            "value": 35000
        },
        {
            "coin": "Ethereum",
            "holdings": 2,
            "value": 6000
        },
        {
            "coin": "Solana",
            "holdings": 20,
            "value": 3000
        }
    ]

    return jsonify(portfolio_data)

# ==============================
# SETTINGS API
# ==============================

@app.route('/settings')
def settings():

    settings_data = {
        "theme": "dark",
        "notifications": True,
        "currency": "USD"
    }

    return jsonify(settings_data)

# ==============================
# RUN APP
# ==============================

if __name__ == '__main__':
    app.run(debug=True)
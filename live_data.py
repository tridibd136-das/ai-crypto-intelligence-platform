import requests
import mysql.connector
from datetime import datetime


db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="1234",
    database="crypto_db"
)

cursor = db.cursor()


url = "https://api.coingecko.com/api/v3/coins/markets"

params = {
    "vs_currency": "usd",
    "ids": "bitcoin,ethereum,solana,dogecoin",
    "order": "market_cap_desc",
    "per_page": 4,
    "page": 1,
    "sparkline": False
}

response = requests.get(url, params=params)

data = response.json()


for coin in data:

    coin_name = coin["name"]

    price = coin["current_price"]

    price_change = coin["price_change_percentage_24h"]

    moving_avg = price * 0.95

    volatility = abs(price_change) * 0.5

    full_date = datetime.now()

    query = """
    INSERT INTO crypto_prices
    (coin_name, full_date, price, price_change, moving_avg, volatility)
    VALUES (%s, %s, %s, %s, %s, %s)
    """

    values = (
        coin_name,
        full_date,
        price,
        price_change,
        moving_avg,
        volatility
    )

    cursor.execute(query, values)

db.commit()

print("Live crypto data inserted successfully!")
import requests
import pandas as pd
from sqlalchemy import create_engine
from datetime import datetime
import time



engine = create_engine(
    "mysql+pymysql://root:1234@localhost/crypto_insights"
)


url = "https://api.coingecko.com/api/v3/coins/markets"



while True:

    params = {
        "vs_currency": "usd",
        "order": "market_cap_desc",
        "per_page": 20,
        "page": 1
    }

    response = requests.get(url, params=params)

    data = response.json()

    rows = []

    for coin in data:

        rows.append({

            "coin_name": coin["name"],

            "symbol": coin["symbol"],

            "current_price": coin["current_price"],

            "market_cap": coin["market_cap"],

            "total_volume": coin["total_volume"],

            "price_change_24h":
                coin["price_change_percentage_24h"],

            "timestamp": datetime.now()
        })

    df = pd.DataFrame(rows)

  

    df.to_sql(
        "crypto_prices",
        engine,
        if_exists="append",
        index=False
    )

    print("✅ Data Inserted Successfully")

   

    time.sleep(60)
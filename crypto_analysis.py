import pandas as pd
import matplotlib.pyplot as plt
from sqlalchemy import create_engine
engine = create_engine(
    "mysql+pymysql://root:1234@localhost/crypto_insights"
)
query = "SELECT * FROM crypto_prices"

df = pd.read_sql(query, engine)

print(df.head())



print("Total Records:", len(df))



print("Average Price:")
print(df["current_price"].mean())



highest = df.loc[df["current_price"].idxmax()]

print("Highest Price Coin:")
print(highest["coin_name"])



top_gainers = df.sort_values(
    by="price_change_24h",
    ascending=False
).head(5)

print(top_gainers[
    ["coin_name", "price_change_24h"]
])

top_gainers.plot(
    x="coin_name",
    y="price_change_24h",
    kind="bar",
    figsize=(10, 5)
)

plt.title("Top Crypto Gainers")

plt.ylabel("24H Change %")

plt.show()
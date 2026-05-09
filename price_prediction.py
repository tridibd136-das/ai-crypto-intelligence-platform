import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np
import mysql.connector


db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="1234",
    database="crypto_db"
)

query = """
SELECT full_date, price
FROM crypto_prices
WHERE coin_name='bitcoin'
ORDER BY full_date
"""

df = pd.read_sql(query, db)


df['day'] = np.arange(len(df))

X = df[['day']]
y = df['price']


model = LinearRegression()
model.fit(X, y)


future_days = np.array([[len(df) + 1]])

prediction = model.predict(future_days)

print("Predicted Next Bitcoin Price:")
print(prediction[0])
import React, { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

import "./App.css";

import Chart from "react-apexcharts";

import {
  FaArrowUp,
  FaArrowDown,
  FaBitcoin,
  FaChartLine,
} from "react-icons/fa";

function App() {

  const [data, setData] = useState([]);

  const [selectedCoin, setSelectedCoin] = useState("bitcoin");

  const [activePage, setActivePage] = useState("Dashboard");

  // ==============================
  // AUTO REFRESH LIVE DATA
  // ==============================

  useEffect(() => {

    const fetchData = () => {

      fetch("http://127.0.0.1:5000/crypto")

        .then((res) => res.json())

        .then((result) => {

          setData(result);

        })

        .catch((err) => console.log(err));

    };

    // INITIAL LOAD
    fetchData();

    // AUTO REFRESH EVERY 30 SECONDS
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);

  }, []);

  // ==============================
  // FILTER DATA
  // ==============================

  const filteredData = data.filter(
    (coin) =>
      coin.coin_name &&
      coin.coin_name.toLowerCase() === selectedCoin.toLowerCase()
  );

  // ==============================
  // KPI VALUES
  // ==============================

  const totalRecords = filteredData.length;

  const highestPrice =
    filteredData.length > 0
      ? Math.max(...filteredData.map((coin) => coin.price || 0))
      : 0;

  const latestVolatility =
    filteredData.length > 0
      ? filteredData[filteredData.length - 1].volatility
      : 0;

  // ==============================
  // AI BUY/SELL SIGNAL
  // ==============================

  const latestPriceChange =
    filteredData.length > 0
      ? filteredData[filteredData.length - 1].price_change
      : 0;

  let aiSignal = "HOLD";

  if (latestPriceChange > 5) {

    aiSignal = "BUY";

  }

  else if (latestPriceChange < -5) {

    aiSignal = "SELL";

  }

  let marketSentiment = "NEUTRAL";

if (latestPriceChange > 5) {

  marketSentiment = "BULLISH";

}

else if (latestPriceChange < -5) {

  marketSentiment = "BEARISH";

}

const rsiValue = Math.min(
  100,
  Math.max(
    0,
    50 + latestPriceChange * 5
  )
);

  // ==============================
  // PIE DATA
  // ==============================

  const pieData = filteredData.slice(0, 5).map((coin, index) => ({
    name: `Day ${index + 1}`,
    value: coin.price,
  }));

  const candleSeries = [

  {
    data: filteredData.slice(-10).map((coin, index) => ({

      x: new Date(coin.full_date),

      y: [

        coin.price * 0.95,

        coin.price * 1.05,

        coin.price * 0.90,

        coin.price

      ]

    }))
  }
];

const candleOptions = {

  chart: {
    type: "candlestick",
    background: "#111827",
    toolbar: {
      show: false
    }
  },

  theme: {
    mode: "dark"
  },

  xaxis: {
    type: "datetime"
  },

  yaxis: {
    tooltip: {
      enabled: true
    }
  }

};

  const COLORS = [
    "#00E5FF",
    "#00C853",
    "#FF5252",
    "#FFD600",
    "#AA00FF"
  ];

  return (

    <div className="app">

      {/* SIDEBAR */}

      <div className="sidebar">

        <h1>🚀 CryptoAI</h1>

        <ul className="menu">

          <li
            className={activePage === "Dashboard" ? "active" : ""}
            onClick={() => setActivePage("Dashboard")}
          >
            📊 Dashboard
          </li>

          <li
            className={activePage === "Analytics" ? "active" : ""}
            onClick={() => setActivePage("Analytics")}
          >
            📈 Analytics
          </li>

          <li
            className={activePage === "Predictions" ? "active" : ""}
            onClick={() => setActivePage("Predictions")}
          >
            🤖 Predictions
          </li>

          <li
            className={activePage === "Portfolio" ? "active" : ""}
            onClick={() => setActivePage("Portfolio")}
          >
            💼 Portfolio
          </li>

          <li
            className={activePage === "Settings" ? "active" : ""}
            onClick={() => setActivePage("Settings")}
          >
            ⚙️ Settings
          </li>

        </ul>

      </div>

      {/* MAIN */}

      <div className="main">

        {/* TOPBAR */}

        <div className="topbar">

          <div>

            <h1>Real-Time Crypto Intelligence</h1>

            <p>AI Powered Fintech Analytics Platform</p>

            {/* LIVE STATUS */}

            <p className="live-status">

              🟢 LIVE DATA STREAM ACTIVE

            </p>

          </div>

          {/* DROPDOWN */}

          <select
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
          >

            <option value="bitcoin">Bitcoin</option>

            <option value="ethereum">Ethereum</option>

            <option value="dogecoin">Dogecoin</option>

            <option value="solana">Solana</option>

          </select>

        </div>

        {/* ==============================
            DASHBOARD PAGE
        ============================== */}

        {activePage === "Dashboard" && (

          <>

            {/* KPI CARDS */}

            <div className="cards">

              <div className="card">

                <h3>Total Records</h3>

                <h1>{totalRecords}</h1>

              </div>

              <div className="card">

                <h3>Selected Coin</h3>

                <h1>{selectedCoin}</h1>

              </div>

              <div className="card">

                <h3>Highest Price</h3>

                <h1>${highestPrice.toFixed(2)}</h1>

              </div>

              <div className="card">

                <h3>Volatility</h3>

                <h1>{latestVolatility.toFixed(2)}</h1>

              </div>

              <div className="card">

  <h3>Market Sentiment</h3>

  <h1>

    {marketSentiment === "BULLISH" && "🚀 BULLISH"}

    {marketSentiment === "BEARISH" && "📉 BEARISH"}

    {marketSentiment === "NEUTRAL" && "⚖️ NEUTRAL"}

  </h1>

</div>

<div className="card">

  <h3>Fear & Greed Index</h3>

  <h1>

    {Math.floor(Math.random() * 100)}

  </h1>

</div>

<div className="card">

  <h3>Trading Momentum</h3>

  <h1>

    {(latestVolatility * 10).toFixed(0)}%

  </h1>

</div>

<div className="card">

  <h3>RSI Indicator</h3>

  <h1>

    {rsiValue.toFixed(0)}

  </h1>

</div>

              {/* AI SIGNAL CARD */}

              <div className="card">

                <h3>AI Signal</h3>

                <h1>

                  {aiSignal === "BUY" && "🟢 BUY"}

                  {aiSignal === "SELL" && "🔴 SELL"}

                  {aiSignal === "HOLD" && "🟡 HOLD"}

                </h1>

              </div>

            </div>

            {/* CHART SECTION */}

            <div className="chart-section">
              <div className="market-grid">

  {/* TOP GAINERS */}

  <div className="market-box">

    <h2>
      <FaArrowUp /> Top Gainers
    </h2>

    <div className="market-item">
      <FaBitcoin /> Bitcoin +8.4%
    </div>

    <div className="market-item">
      Ethereum +5.2%
    </div>

    <div className="market-item">
      Solana +12.7%
    </div>

  </div>

  {/* TOP LOSERS */}

  <div className="market-box">

    <h2>
      <FaArrowDown /> Top Losers
    </h2>

    <div className="market-item">
      Dogecoin -4.2%
    </div>

    <div className="market-item">
      XRP -2.7%
    </div>

    <div className="market-item">
      Cardano -3.5%
    </div>

  </div>

</div>

              {/* LINE CHART */}

              <div className="chart-box">

                <h2>{selectedCoin} Price Trend</h2>

                <ResponsiveContainer width="100%" height={300}>

                  <LineChart data={filteredData}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="full_date" hide />

                    <YAxis />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#00E5FF"
                      strokeWidth={3}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

              <div className="chart-box">

  <h2>📈 Candlestick Trading Chart</h2>

  <Chart
    options={candleOptions}
    series={candleSeries}
    type="candlestick"
    height={300}
  />

</div>

              {/* AI INSIGHTS */}

              <div className="insight-box">

                <h2>AI Insights</h2>

                <div className="insight-card">

                  📈 Market momentum increasing

                </div>

                <div className="insight-card">

                  🚀 Whale transactions detected

                </div>

                <div className="insight-card">

                  ⚠️ Volatility rising

                </div>

                <div className="insight-card">

  RSI Level:
  {rsiValue > 70 && " Overbought Zone ⚠️"}

  {rsiValue < 30 && " Oversold Zone 🚀"}

  {rsiValue >= 30 && rsiValue <= 70 && " Neutral Momentum"}

</div>

              </div>

            </div>

          </>

        )}

        {/* ==============================
            ANALYTICS PAGE
        ============================== */}

        {activePage === "Analytics" && (

          <div className="analytics-grid">

            {/* BAR CHART */}

            <div className="chart-box">

              <h2>Price Change Analysis</h2>

              <ResponsiveContainer width="100%" height={300}>

                <BarChart data={filteredData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="full_date" hide />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="moving_avg"
                    fill="#00E5FF"
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

            {/* PIE CHART */}

            <div className="chart-box">

              <h2>Market Distribution</h2>

              <ResponsiveContainer width="100%" height={300}>

                <PieChart>

                  <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius={100}
                    label
                  >

                    {pieData.map((entry, index) => (

                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />

                    ))}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        )}

        {/* ==============================
            PREDICTIONS PAGE
        ============================== */}

        {activePage === "Predictions" && (

          <div className="prediction-box">

            <h1>🤖 AI Predictions</h1>

            <div className="prediction-card">

              Bitcoin expected bullish continuation

            </div>

            <div className="prediction-card">

              Ethereum accumulation zone detected

            </div>

            <div className="prediction-card">

              Solana breakout likely

            </div>

          </div>

        )}

        {/* ==============================
            PORTFOLIO PAGE
        ============================== */}

        {activePage === "Portfolio" && (

          <div className="portfolio-box">

            <h1>💼 Portfolio Overview</h1>

            <table>

              <thead>

                <tr>

                  <th>Coin</th>

                  <th>Price</th>

                  <th>Volatility</th>

                </tr>

              </thead>

              <tbody>

                {filteredData.slice(0, 5).map((coin, index) => (

                  <tr key={index}>

                    <td>{coin.coin_name}</td>

                    <td>${coin.price}</td>

                    <td>{coin.volatility}</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

        {/* ==============================
            SETTINGS PAGE
        ============================== */}

        {activePage === "Settings" && (

          <div className="settings-box">

            <h1>⚙️ Settings</h1>

            <div className="setting-card">

              Dark Theme Enabled

            </div>

            <div className="setting-card">

              Real-Time Streaming Active

            </div>

            <div className="setting-card">

              AI Prediction Engine Enabled

            </div>

          </div>

        )}

      </div>

    </div>

  );
}

export default App;
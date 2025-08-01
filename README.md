# Fincraft - Real-Time Stock Tracker & Trade Analyzer

Fincraft is a full-stack finance web application that empowers users to track real-time stock prices, simulate trades, analyze profits, and connect with financial advisors. Built with CSS, JavaScript, EJS, Node.js, Express, and MongoDB, it provides a comprehensive platform for managing your simulated investment portfolio.

## ✨ Features

### Authentication

  * **User Registration:** Securely create an account.
  * **Login/Logout:** Manage user sessions.
  * **Password Security:** Passwords are stored using bcrypt hashing for enhanced security.

### Dashboard

Get a quick overview of your financial performance:

  * **Profit/Loss Summary:** Track your overall profits and losses for various timeframes (all-time, 1 year, 1 month, 1 week, today).
  * **Trade List:** View a summary of your recent simulated trades.
  * **Watchlist:** Keep an eye on stocks you're interested in.
     
### Stocks Page (`/stocks`)

  * **Search & View Stocks:** Easily find and explore different stocks.
  * **Watchlist Management:** Add or remove stocks from your personalized watchlist.

### Individual Stock Page (`/stock/:symbol`)

  * **Real-time Data:** View live stock prices and interactive charts.
      * **Known Issue:** Currently, the individual stock page may not display real-time data correctly. This is an ongoing issue being addressed.
  * **Trade Simulation:**
      * **Buy/Sell Actions:** Simulate buying and selling stocks.
      * **Trade Logging:** Automatically log trade details including price, timestamp, and calculated profit/loss.
      * **Known Issue:** After making a trade from the individual stock page, the dashboard may display an error. This is an ongoing issue being investigated.
  * **Recommendations:** Get general recommendations (BUY/HOLD/SELL) based on market data.

### Trade History (`/history`)

  * **Complete Record:** Access a comprehensive record of all your simulated trades.
  * **Filtering Options:** Filter trades by specific stock or time period for detailed analysis.
  * **Trade Details:** View entry/exit price, trade type (buy/sell), date, and profit/loss for each trade.

### Brokers Page (`/brokers`)

  * **Financial Advisors:** Browse a list of simulated financial advisors with basic information. This list can be static or dynamically stored in MongoDB.

### Market News page (`/news`)

  * **Financial News:** News that can effects the market and the ones that are popular among the people in the market is getting displayed with the help of finnhub API.

## ⚠️ Known Issues
  * **Dashboard Error After Trade:** When a trade is made from the individual stock page, the dashboard often responds with an error. I am working to fix this interaction.

## 🚀 Getting Started

### Prerequisites

  * Node.js (LTS version recommended)
  * MongoDB
  * Finnhub API Key

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd Fincraft
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the following:

    ```
    DB_URI=your_mongodb_connection_string
    FINNHUB_API_KEY=your_finnhub_api_key
    SESSION_SECRET=a_strong_secret_key_for_sessions
    ```

      * Replace `your_mongodb_connection_string` with your MongoDB URI (e.g., `mongodb://localhost:27017/Fincraft`).
      * Replace `your_finnhub_api_key` with your actual API key from Finnhub.
      * Replace `a_strong_secret_key_for_sessions` with a long, random string for session encryption.

4.  **Run the application:**

    ```bash
    npm start
    ```

    The application will be accessible at `http://localhost:3000`.

## 📂 Folder Structure

```
.
├── models/             # Mongoose schemas (User.js, Trade.js, Broker.js)
├── routes/             # Express routes (auth.js, stocks.js, trades.js, dashboard.js, news.js)
├── views/              # EJS templates (login.ejs, dashboard.ejs, stocks.ejs, stock.ejs, history.ejs, brokers.ejs)
├── public/             # Static assets (css/, js/, images/)
│   ├── css/            # CSS stylesheets
│   ├── js/             # Client-side JavaScript
│   └── images/         # Images
├── .env                # Environment variables
└── server.js           # Main application entry point
```

## 🌐 API for Stock Data

Fincraft utilizes the Finnhub API for real-time stock prices, historical data, and indicators.

### ✅ Finnhub API (Recommended)

  * **Website:** [https://finnhub.io](https://finnhub.io)
  * **Free Tier:** 60 requests/minute
  * **Features:** Real-time quotes, candlestick data, recommendations.
  * **Example Endpoints:**
      * `GET /quote?symbol=AAPL&token=YOUR_API_KEY`
      * `GET /stock/candle?symbol=AAPL&resolution=1&from=TIMESTAMP&to=TIMESTAMP&token=YOUR_API_KEY`

## 🤝 Contributing

Contributions are welcome\! If you'd like to improve Fincraft, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add your feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

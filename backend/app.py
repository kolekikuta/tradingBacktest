from flask import Flask
from backtest import backtest_strategy, download_spy_data, calculate_ema_macd
import pandas as pd
from flask import jsonify
from flask_cors import CORS
from flask import request


app = Flask(__name__)
CORS(app)


@app.route('/api/data', methods=['GET'])
def home():

    try:
        today = pd.Timestamp.today().normalize()
        start_date = today - pd.DateOffset(years=5)
        end_date = today
        df = download_spy_data(start_date, end_date)
    except Exception as e:
        print(f"Error in data retrieval: {e}")
        return jsonify({"error": str(e)}), 500

    df = calculate_ema_macd(df)
    df = backtest_strategy(df)
    data = {
        "dates": df["Date"].dt.strftime('%Y-%m-%d').tolist(),
        "open": df["Open"].tolist(),
        "close": df["Close"].tolist(),
        "high": df["High"].tolist(),
        "low": df["Low"].tolist(),
        "ema12": df["EMA12"].tolist(),
        "ema26": df["EMA26"].tolist(),
        "macd": df["MACD"].tolist(),
        "signal": df["Signal"].tolist(),
        "hist_difference": df["hist_difference"].tolist(),
        "ema200": df["EMA200"].tolist(),
        "trendDirection": df["trendDirection"].tolist(),
        "buy_signals": df["Buy_Signal"].tolist(),
        "portfolio_values": df["Portfolio"].tolist(),
        "buy_and_hold_values": df["Buy_and_Hold"].tolist()
    }
    return jsonify(data)

@app.route('/api/backtest', methods=['POST'])
def backtest():
    settings = request.json
    try:
        today = pd.Timestamp.today().normalize()
        start_date = today - pd.DateOffset(years=5)
        end_date = today
        df = download_spy_data(start_date, end_date)
    except Exception as e:
        print(f"Error in data retrieval: {e}")
        return jsonify({"error": str(e)}), 500

    df = calculate_ema_macd(df)
    df = backtest_strategy(df, settings)
    data = {
        "dates": df["Date"].dt.strftime('%Y-%m-%d').tolist(),
        "open": df["Open"].tolist(),
        "close": df["Close"].tolist(),
        "high": df["High"].tolist(),
        "low": df["Low"].tolist(),
        "ema12": df["EMA12"].tolist(),
        "ema26": df["EMA26"].tolist(),
        "macd": df["MACD"].tolist(),
        "signal": df["Signal"].tolist(),
        "hist_difference": df["hist_difference"].tolist(),
        "ema200": df["EMA200"].tolist(),
        "trendDirection": df["trendDirection"].tolist(),
        "buy_signals": df["Buy_Signal"].tolist(),
        "portfolio_values": df["Portfolio"].tolist(),
        "buy_and_hold_values": df["Buy_and_Hold"].tolist()
    }
    return jsonify(data)



if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask
from backtest import backtest_strategy, download_spy_data, calculate_ema_macd
import pandas as pd
from flask import jsonify, request
from flask_cors import CORS
from models import db, Spy



app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://admin:password123@localhost:3306/tradingReturnsdb"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


@app.route('/api/data', methods=['GET', 'POST'])
def home():

    try:
        today = pd.Timestamp.today().normalize()
        start_date = today - pd.DateOffset(years=5)
        end_date = today
        df = download_spy_data(start_date, end_date)


    except Exception as e:
        print(f"Error in data retrieval: {e}")
        return jsonify({"error": str(e)}), 500

    stop_loss_pct = 0.05
    take_profit_pct = 0.1

    if request.method == 'POST':
        stop_loss_pct = request.json.get('stop_loss_pct', stop_loss_pct)
        take_profit_pct = request.json.get('take_profit_pct', take_profit_pct)

    df = calculate_ema_macd(df)
    df, strategy_return, bh_return, rel, win_rate = backtest_strategy(df, stop_loss_pct=stop_loss_pct, take_profit_pct=take_profit_pct)

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
        "buy_and_hold_values": df["Buy_and_Hold"].tolist(),
        "strategy_return": strategy_return,
        "buy_and_hold_return": bh_return,
        "relative_performance": rel,
        "win_rate": win_rate
    }
    return jsonify(data), 200

@app.route('/api/backtest', methods=['POST'])
def backtest():
    stop_loss_pct = request.json.get('stop_loss_pct', 0.02)
    profit_ratio = request.json.get('take_profit_pct', 1.5)

    df, strategy_return, bh_return, rel, win_rate = backtest_strategy(df, stop_loss_pct=stop_loss_pct, profit_ratio=profit_ratio)


    return jsonify({"message": "Backtest endpoint"}), 200



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
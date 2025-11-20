import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import yfinance as yf
import matplotlib.dates as mdates
import os
from datetime import datetime
from models import Spy
from sqlalchemy.exc import SQLAlchemyError


# get spy data from yfinance and return as dataframe
def download_spy_data(start_date, end_date, file_path="spy_data.csv"):
    today = datetime.today().date()
    df = pd.DataFrame()
    # query database for existing data
    try:
        records = Spy.query.all()
        data = [{
            "Date": record.date,
            "Open": record.open,
            "High": record.high,
            "Low": record.low,
            "Close": record.close,
            "Volume": record.volume
        } for record in records]
        df = pd.DataFrame(data)
    except Exception as e:
        print(f"Error querying database: {e}")
        return pd.DataFrame()


    if df.empty:
        print("No existing records. Downloading full data.")
        ticker = yf.Ticker("SPY")
        df = ticker.history(start=start_date, end=end_date, auto_adjust=True).reset_index()
        insert_spy_data_to_db(df)
        return df

    # Case 3: Last date is not up to today
    last_date = df["Date"].max()
    if today - last_date > pd.Timedelta(days=2):
        print(f"Data outdated. Last date: {last_date}. Downloading updated SPY data...")
        try:
            ticker = yf.Ticker("SPY")
            df = ticker.history(start=start_date, end=end_date, auto_adjust=True).reset_index()
            insert_spy_data_to_db(df)
        except Exception as e:
            print(f"Error downloading SPY data: {e}")
            return pd.DataFrame()


    df["Date"] = pd.to_datetime(df["Date"])

    # Database is valid and current
    print("Database is up to date.")
    return df


def insert_spy_data_to_db(df):
    from app import db  # Import here to avoid circular imports
    try:
        for _, row in df.iterrows():
            record = Spy(
                date=row["Date"].date(),
                open=row["Open"],
                high=row["High"],
                low=row["Low"],
                close=row["Close"],
                volume=row["Volume"]
            )
            db.session.add(record)
        db.session.commit()
        print("SPY data inserted into database successfully.")
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Error inserting SPY data into database: {e}")



#calculate EMAs and MACDs
def calculate_ema_macd(df, ema_fast, ema_slow, signal_len, ema_trend):
    df['EMA_fast'] = df['Close'].ewm(span=ema_fast, adjust=False).mean()
    df['EMA_slow'] = df['Close'].ewm(span=ema_slow, adjust=False).mean()
    df['MACD'] = df['EMA_fast'] - df['EMA_slow']
    df['Signal'] = df['MACD'].ewm(span=signal_len, adjust=False).mean()
    df['hist_difference'] = df['MACD'] - df['Signal']
    df['EMA_trend'] = df['Close'].ewm(span=ema_trend, adjust=False).mean()
    df['trendDirection'] = np.where(df['Close'] > df['EMA_trend'], 'up', 'down')

    # Calculate Buy Signals
    df['Buy_Signal'] = 0
    for i in range(1, len(df)):
        if (
            df['hist_difference'].iloc[i-1] < 0 and df['hist_difference'].iloc[i] > 0 and
            df['MACD'].iloc[i] < 0 and df['Signal'].iloc[i] < 0 and
            df['trendDirection'].iloc[i] == "up"
        ):
            df.loc[df.index[i], 'Buy_Signal'] = 1

    return df

def backtest_strategy(df, stop_loss_pct, take_profit_pct):

    #Portfolio Simulation
    initial_cash = 1000
    cash = initial_cash
    in_trade = False
    entry_price = 0
    entry_date = None
    trades = []
    portfolio_values = []


    for i in range(len(df)):
        price = df['Close'].iloc[i]
        date = df['Date'].iloc[i]

        if not in_trade:
            if df['Buy_Signal'].iloc[i] == 1:
                entry_price = price
                stop_price = entry_price * (1 - stop_loss_pct)
                target_price = entry_price * (1 + take_profit_pct)
                entry_date = date
                in_trade = True
        else:
            if price >= target_price:
                cash = cash * (target_price / entry_price)
                trades.append((entry_date, date, entry_price, target_price, 'win'))
                in_trade = False
            elif price <= stop_price:
                cash = cash * (stop_price / entry_price)
                trades.append((entry_date, date, entry_price, stop_price, 'loss'))
                in_trade = False

        portfolio_values.append(cash)
    # record portfolio values for every row (even if no trades occurred)
    df['Portfolio'] = portfolio_values

    # Accuracy scoring
    if len(trades) > 0:
        total_trades = len(trades)
        wins = sum(1 for t in trades if t[4] == 'win')
        win_rate = (wins / total_trades) * 100

    # Buy-and-hold comparison: buy as many shares as possible at first available price
    initial_cash = initial_cash if 'initial_cash' in locals() else 1000
    first_valid_idx = df['Close'].first_valid_index()
    if first_valid_idx is not None and df['Close'].iloc[first_valid_idx] > 0:
        first_price = df['Close'].iloc[first_valid_idx]
        bh_shares = initial_cash / first_price
        df['Buy_and_Hold'] = df['Close'] * bh_shares
    else:
        df['Buy_and_Hold'] = np.nan

    # Final comparison prints
    try:
        final_strategy = df['Portfolio'].iloc[-1]
        final_bh = df['Buy_and_Hold'].iloc[-1]
        strategy_return = (final_strategy / initial_cash - 1) * 100
        bh_return = (final_bh / initial_cash - 1) * 100
        if final_bh != 0:
            rel = (final_strategy / final_bh - 1) * 100
    except Exception:
        pass

    df = df.round(2)

    return df, strategy_return, bh_return, rel, win_rate

def plot(df):
    fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(12, 10), sharex=True)
    # Plot 1: Close Price and EMA200
    ax1.plot(df["Date"], df["Close"], color="#00BFFF", linewidth=1.5, label="Close Price")
    ax1.plot(df["Date"], df["EMA_trend"], color="#FF5555", linestyle="--", linewidth=1.2, label="EMA Trend")
    buy_points = df[df['Buy_Signal'] == 1]
    ax1.scatter(buy_points['Date'], buy_points["Close"], color="#00FF88", marker="^", s=100, label="Buy Signal", zorder=5)
    ax1.set_title('SPY Close Price')
    ax1.legend(loc="upper left", fontsize=10)
    ax1.set_ylabel("Price ($)")
    ax1.grid(True, linestyle="--", alpha=0.3)


    # Plot 2: MACD and Signal Line
    ax2.plot(df["Date"], df["MACD"], color="#1E90FF", linewidth=1.2, label="MACD")
    ax2.plot(df["Date"], df["Signal"], color="#FFB347", linewidth=1.2, label="Signal")
    ax2.axhline(0, color="#888888", linestyle="--", linewidth=1)
    for i in buy_points.index:
        ax2.annotate('↑', (df['Date'].iloc[i], df['MACD'].iloc[i]), color='#00FF88', fontsize=12, ha='center')

    ax2.legend(loc="upper left", fontsize=9)
    ax2.set_ylabel("MACD")
    ax2.grid(True, linestyle="--", alpha=0.3)

    # Plot 3: Histogram
    colors = ["#00FF88" if h >= 0 else "#FF5555" for h in df["hist_difference"]]
    ax3.bar(df["Date"], df["hist_difference"], color=colors, width=1)
    ax3.axhline(0, color="#666666", linestyle="--", linewidth=1)
    ax3.set_ylabel("Histogram")
    ax3.set_xlabel("Date")
    ax3.grid(True, linestyle="--", alpha=0.3)

    ax3.xaxis.set_major_locator(mdates.YearLocator())
    ax3.xaxis.set_major_formatter(mdates.DateFormatter('%Y'))
    fig.autofmt_xdate()
    plt.tight_layout()
    os.makedirs("figures", exist_ok=True)
    fig.savefig('figures/figure1_trading_strategy.png', dpi=300, bbox_inches='tight')
    plt.show()

    #figure 2: Portfolio Value
    fig2, ax4 = plt.subplots(figsize=(16, 9))
    ax4.plot(df["Date"], df["Portfolio"], color="#9370DB", linewidth=2.5, label="Simulated Strategy")
    # plot buy-and-hold if available
    if 'Buy_and_Hold' in df.columns:
        ax4.plot(df["Date"], df["Buy_and_Hold"], color="#2ECC71", linewidth=2.0, linestyle='--', label="Buy and Hold")
    ax4.set_title("Portfolio Value Over Time", color="white", fontsize=16)
    ax4.set_xlabel("Date", color="white")
    ax4.set_ylabel("Portfolio Value ($)", color="white")
    ax4.grid(True, linestyle="--", alpha=0.3)
    ax4.legend(facecolor="#111111", edgecolor="#222222", fontsize=10, loc="upper left")
    ax4.xaxis.set_major_locator(mdates.YearLocator())
    ax4.xaxis.set_major_formatter(mdates.DateFormatter('%Y'))
    fig2.autofmt_xdate()
    plt.tight_layout()

    # Save the second figure
    fig2.savefig("figures/figure2_portfolio_value.png", dpi=200, bbox_inches='tight')
    plt.show()

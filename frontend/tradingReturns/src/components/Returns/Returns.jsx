export default function Returns({ data, returns }) {
    if (!data || data.length === 0 || !returns) return null;

    const start = data[0].portfolio;
    const end = data[data.length - 1].portfolio;

    const diff = end - start;

    const startDate = new Date(data[0].date);
    const endDate = new Date(data[data.length - 1].date);
    const years = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365.25);

    const annualized = ((Math.pow(end / start, 1 / years) - 1) * 100).toFixed(2);

    const numberOfTrades = data.filter(d => d.buy === 1).length;

    const averageReturnPerTrade =
        numberOfTrades > 0 ? (diff / numberOfTrades).toFixed(2) : 0;

    return (
        <>
            <div>
                <h1>Returns</h1>
                <p>Total: {returns.strategy_return.toFixed(2)}%</p>
                <p>Annualized: {annualized}%</p>
                <p>Avg Return per Trade: ${averageReturnPerTrade}</p>
                <p>Win Rate: {returns.win_rate.toFixed(2)}%</p>
                <p>Number of Trades: {numberOfTrades}</p>
                <p>Buy and Hold Return: {returns.buy_and_hold_return.toFixed(2)}%</p>
            </div>

            <div>
                <h1>Portfolio</h1>
                <p>Start Value: ${start.toFixed(2)}</p>
                <p>End Value: ${end.toFixed(2)}</p>
                <p>Profit/Loss: ${diff.toFixed(2)}</p>
            </div>
        </>
    );
}

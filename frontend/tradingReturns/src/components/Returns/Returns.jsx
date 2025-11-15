
export default function Returns({ data }) {
    if (!data || data.length === 0) return null;

    const start = data[0].portfolio;
    const end = data[data.length - 1].portfolio;

    const diff = (end - start).toFixed(2);

    const startDate = new Date(data[0].date);
    const endDate = new Date(data[data.length - 1].date);
    const years = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365.25);
    const annualized = ((Math.pow(end / start, 1 / years) - 1) * 100).toFixed(2);
    const numberOfTrades = data.filter(d => d.buy === 1).length;
    const averageReturnPerTrade = (diff / numberOfTrades).toFixed(2);

    return (
        <>
            <h1>Returns</h1>
            <p>Total: ${diff}</p>
            <p>Annualized: {annualized}%</p>
            <p>Average Return per Trade: {averageReturnPerTrade}</p>
            <p>Win Rate: </p>
            <p>Number of Trades: {numberOfTrades}</p>
        </>
    )
}
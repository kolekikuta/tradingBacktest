import { useState, useEffect } from 'react';
import axios from 'axios';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import './HomePage.css';
import StrategyBuilder from '../StrategyBuilder/StrategyBuilder.jsx';
import Returns from '../Returns/Returns.jsx';
import Charts from '../Charts/Charts.jsx';

export default function HomePage() {

    const [data, setData] = useState(null);

    /*
        RESPONSE DATA STRUCTURE:
        "dates"
        "open"
        "close"
        "high"
        "low"
        "ema12"
        "ema26"
        "macd"
        "signal"
        "hist_difference"
        "ema200"
        "trendDirection"
        "buy_signals"
        "portfolio_values"
        "buy_and_hold_values"
    */

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://localhost:5000/api/data');
                const json = response.data;

                const formatted = json.dates.map((date, i) => ({
                    date,
                    open: json.open[i],
                    close: json.close[i],
                    high: json.high[i],
                    low: json.low[i],
                    ema12: json.ema12[i],
                    ema26: json.ema26[i],
                    macd: json.macd[i],
                    signal: json.signal[i],
                    hist: json.hist_difference[i],
                    ema200: json.ema200[i],
                    trendDirection: json.trendDirection[i],
                    buy: json.buy_signals[i],
                    portfolio: json.portfolio_values[i],
                    buyHold: json.buy_and_hold_values[i]
                }));

                setData(formatted);

            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();

    }, []);

    return (
        <PanelGroup direction="horizontal" style={{ width: '100vw', height: '95vh' }}>
            <Panel defaultSize={90}>
                <PanelGroup direction="vertical">
                    <Panel defaultSize={70} className="panel">
                        <div className="panel-fill">
                            <Charts data={data}/>
                        </div>
                    </Panel>
                    <PanelResizeHandle />
                    <Panel defaultSize={30} className="panel">
                        <div className="panel-container">
                            <StrategyBuilder />
                        </div>

                    </Panel>
                </PanelGroup>
            </Panel>
            <PanelResizeHandle />
            <Panel defaultSize={10} className="panel">
                <Returns />
            </Panel>

        </PanelGroup>

    )


}
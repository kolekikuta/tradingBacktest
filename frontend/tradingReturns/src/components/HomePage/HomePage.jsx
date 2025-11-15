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
        try {
            const response = axios.get('http://localhost:5000/api/data').then((response) => {
                setData(response.data);
            });
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    return (
        <PanelGroup direction="horizontal" style={{ width: '100vw', height: '95vh' }}>
            <Panel defaultSize={90}>
                <PanelGroup direction="vertical">
                    <Panel defaultSize={70} className="panel">
                        <Charts />
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
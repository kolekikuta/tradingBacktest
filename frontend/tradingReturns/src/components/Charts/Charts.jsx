import { useState } from 'react';
import './Charts.css';
import PriceChart from './PriceChart';
import StrategyChart from './StrategyChart';
import HistogramChart from './HistorgramChart';
import EquityChart from './EquityChart';

export default function Charts({ data }) {
    const [activeTab, setActiveTab] = useState('price');
    const [buySignals, setBuySignals] = useState(true);



    return (
        <div style={{ height: '100%', width: '100%' }}>
            <div className="charts-header">
                <h1>Charts</h1>
                <div className="charts-tabs">
                    <button
                        className={activeTab === 'price' ? 'active-tab' : 'inactive-tab'}
                        onClick={() => setActiveTab('price')}
                    >Price
                    </button>
                    <button
                        className={activeTab === 'strategy' ? 'active-tab' : 'inactive-tab'}
                        onClick={() => setActiveTab('strategy')}
                    >Strategy
                    </button>
                    <button
                        className={activeTab === 'histogram' ? 'active-tab' : 'inactive-tab'}
                        onClick={() => setActiveTab('histogram')}
                    >Histogram
                    </button>
                    <button
                        className={activeTab === 'equity' ? 'active-tab' : 'inactive-tab'}
                        onClick={() => setActiveTab('equity')}
                    >Equity
                    </button>
                </div>
            </div>
            {activeTab === 'price' && <PriceChart data={data} buySignals={buySignals} />}
            {activeTab === 'strategy' && <StrategyChart data={data} buySignals={buySignals} />}
            {activeTab === 'histogram' && <HistogramChart data={data} />}
            {activeTab === 'equity' && <EquityChart data={data} />}
            {(activeTab === 'price' || activeTab === 'strategy') &&
                <label>
                    <input
                        type="checkbox"
                        checked={buySignals}
                        onChange={e => setBuySignals(e.target.checked)}
                    /> Show Buy Signals
                </label>
            }
        </div>
    )
}
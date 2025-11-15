import { useState } from 'react';
import './Charts.css';
import PriceChart from './PriceChart';

export default function Charts({ data }) {
    const [activeTab, setActiveTab] = useState('price');



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

            <PriceChart data={data} activeTab={activeTab} />

        </div>
    )
}
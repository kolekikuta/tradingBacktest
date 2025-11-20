import { useState } from 'react';
import './StrategyBuilder.css';
import axios from 'axios';

export default function StrategyBuilder({ formatData }) {
    const [settings, setSettings] = useState({
        ema_fast: 12,
        ema_slow: 26,
        signal_len: 9,
        ema_trend: 200,
        require_macd_below_zero: true,
        stop_loss_pct: 0.05,
        take_profit_pct: 0.1,
    });

    async function handleBacktest() {
        try {
            const response = await axios.post('http://localhost:5000/api/data', settings);
            console.log('Backtest results:', response.data);
            formatData(response.data);
        } catch (error) {
            console.error('Error running backtest:', error);
        }
    }


    return (
        <div className="strategy-builder-container">
            <div className="strategy-builder-header">
                <h1>Strategy Builder</h1>
                <button onClick={handleBacktest}>Backtest</button>
            </div>

            <div className="strategy-builder-settings">
                <div className="strategy-signals">
                    <h2>Buy Signals</h2>
                    <div>
                        <label>Fast EMA Period: </label>
                        <input
                            type="number"
                            min="1"
                            value= {settings.ema_fast}
                            onChange={e =>
                                setSettings(prev => ({
                                    ...prev,
                                    ema_fast: Number(e.target.value)
                                }))
                            }
                        />
                    </div>
                    <div>
                        <label>Slow EMA Period: </label>
                        <input
                            type="number"
                            min="1"
                            value= {settings.ema_slow}
                            onChange={e =>
                                setSettings(prev => ({
                                    ...prev,
                                    ema_slow: Number(e.target.value)
                                }))
                            }
                        />
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.require_macd_below_zero}
                                onChange={e =>
                                    setSettings(prev => ({
                                        ...prev,
                                        require_macd_below_zero: e.target.checked
                                    }))
                                }
                            />
                            Require MACD Below Zero
                        </label>
                    </div>
                </div>
                <div className="strategy-signals">
                    <h2>Sell Signals</h2>
                    <div>
                        <label>Stop Loss: </label>
                        <input
                            type="number"
                            min="0"
                            max="1"
                            step="0.01"
                            value={settings.stop_loss_pct}
                            onChange={e =>
                                setSettings(prev => ({
                                    ...prev,
                                    stop_loss_pct: parseFloat(e.target.value)
                                }))
                            }
                        />
                    </div>
                    <div>
                        <label>Take Profit: </label>
                        <input
                            type="number"
                            min="0"
                            max="1"
                            step="0.01"
                            value={settings.take_profit_pct}
                            onChange={e =>
                                setSettings(prev => ({
                                    ...prev,
                                    take_profit_pct: parseFloat(e.target.value)
                                    }))
                                }
                            />
                    </div>

                </div>

            </div>


        </div>
    )
}
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Scatter, ReferenceDot } from "recharts";

export default function PriceChart({ data, buySignals }) {
    if (!data || data.length === 0) return <div>Loading...</div>;
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid />
                <XAxis dataKey="date"/>
                <YAxis />
                <Tooltip />

                <Line type="monotone" dataKey="close" stroke="blue" dot={false} />
                <Line type="monotone" dataKey="ema_trend" stroke="orange" dot={false} />

                {buySignals && data.map((d, i) =>
                    d.buy === 1 ? (
                        <ReferenceDot
                        key={i}
                        x={d.date}
                        y={d.close}
                        r={6}
                        fill="green"
                        stroke="none"
                        />
                    ) : null
                )}

            </LineChart>

        </ResponsiveContainer>
  );
}

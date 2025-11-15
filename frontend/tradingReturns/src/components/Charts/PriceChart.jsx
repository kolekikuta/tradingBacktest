import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export default function PriceChart({ data }) {
    if (!data || data.length === 0) return null;
    return (
        <ResponsiveContainer width="100%" height="90%">
            <LineChart data={data}>
                <CartesianGrid />
                <XAxis dataKey="date"/>
                <YAxis />
                <Tooltip />

                <Line type="monotone" dataKey="close" stroke="blue" dot={false} />
                <Line type="monotone" dataKey="ema200" stroke="orange" dot={false} />
            </LineChart>

        </ResponsiveContainer>
  );
}

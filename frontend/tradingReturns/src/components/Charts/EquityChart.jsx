import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Scatter, ReferenceDot } from "recharts";

export default function EquityChart({ data }) {
    if (!data || data.length === 0) return <div>Loading...</div>;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid />
                <XAxis dataKey="date"/>
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="portfolio" stroke="purple" dot={false} />
                <Line type="monotone" dataKey="buyHold" stroke="blue" dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
}
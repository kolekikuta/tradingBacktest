import { useMemo } from "react";
import { ResponsiveContainer, ReferenceLine, Bar, CartesianGrid, XAxis, YAxis, Tooltip, BarChart } from "recharts";

export default function HistogramChart({ data }) {
    if (!data || data.length === 0) return <div>Loading...</div>;

    const histData = useMemo (() => {
        return data.map(d => ({
            date: d.date,
            pos: d.hist > 0 ? d.hist : null,
            neg: d.hist < 0 ? d.hist : null
        }));
    }, [data]);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={histData}>
                <CartesianGrid strokeOpacity={0.2} />
                <XAxis dataKey="date" hide={true} />
                <YAxis />
                <Tooltip />

                <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />

                <Bar dataKey="pos" fill="green" isAnimationActive={false}/>
                <Bar dataKey="neg" fill="red" isAnimationActive={false}/>
            </BarChart>
        </ResponsiveContainer>
    );
}

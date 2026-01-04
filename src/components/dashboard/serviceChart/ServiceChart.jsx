import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ServiceChart({ data }) {
    if (!data || data.length === 0) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: '#af9c9cff' }}>Sem dados suficientes para o gráfico.</div>;
    }

    return (
        <div style={{ width: '100%', height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ebe5e5ff" />
                    <XAxis type="number" hide />
                    <YAxis 
                        dataKey="serv_nome" 
                        type="category" 
                        width={150} 
                        tick={{fontSize: 12, fill: '#634b4bff'}} 
                    />
                    <Tooltip 
                        cursor={{fill: '#f6f3f3ff'}}
                        contentStyle={{
                            borderRadius: '8px',
                            border: '1px solid #ebe5e5ff',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#ffffff'
                        }}
                        labelStyle={{
                            color: '#111827',
                            fontWeight: '700',
                            fontSize: '0.95rem',
                            marginBottom: '0.5rem',
                            borderBottom: '1px solid #f6f3f3ff',
                            paddingBottom: '0.25rem'
                        }}
                        itemStyle={{
                            color: '#513737ff',
                            fontSize: '0.9rem'
                        }}
                    />
                    <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={30}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="var(--primary-red)" />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
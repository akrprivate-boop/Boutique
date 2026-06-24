import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E8DDD5',
      borderRadius: '10px',
      padding: '12px 16px',
      boxShadow: '0 4px 16px rgba(183,110,121,0.12)',
    }}>
      <p style={{ fontWeight: 600, marginBottom: 6, color: '#2D2A26' }}>{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color, fontSize: '13px', marginBottom: 2 }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
};

export default function RevenueChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Revenue Overview</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke="#F0E8E2" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#7A7067', fontSize: 12 }}
            axisLine={{ stroke: '#E8DDD5' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#7A7067', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '13px', paddingTop: '8px' }}
          />
          <Bar
            dataKey="revenue"
            name="Total Revenue"
            fill="#B76E79"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="collected"
            name="Amount Collected"
            fill="#C9A96E"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

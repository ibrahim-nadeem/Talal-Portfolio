import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const defaultGrowth = [
  { month: "Jan", leads: 120, qualified: 42 },
  { month: "Feb", leads: 180, qualified: 71 },
  { month: "Mar", leads: 240, qualified: 104 },
  { month: "Apr", leads: 320, qualified: 158 },
  { month: "May", leads: 460, qualified: 231 },
  { month: "Jun", leads: 610, qualified: 328 },
];

const defaultChannels = [
  { channel: "SEO", value: 34 },
  { channel: "Ads", value: 26 },
  { channel: "Email", value: 18 },
  { channel: "Social", value: 14 },
  { channel: "Referral", value: 8 },
];

const defaultFunnel = [
  { stage: "Visitors", value: 12400 },
  { stage: "Leads", value: 3820 },
  { stage: "MQL", value: 1460 },
  { stage: "Customers", value: 520 },
];

const pieColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const tooltipStyle = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  color: "var(--popover-foreground)",
  fontSize: "12px",
};

export function GrowthChart({ data = defaultGrowth }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.55} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="qualFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.45} />
            <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--border)" }} />
        <Area
          type="monotone"
          dataKey="leads"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          fill="url(#leadsFill)"
        />
        <Area
          type="monotone"
          dataKey="qualified"
          stroke="var(--chart-2)"
          strokeWidth={2.5}
          fill="url(#qualFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ChannelChart({ data = defaultChannels }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Tooltip contentStyle={tooltipStyle} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="channel"
          innerRadius={58}
          outerRadius={92}
          paddingAngle={3}
          stroke="none"
        >
          {data.map((entry, i) => (
            <Cell key={entry.channel} fill={pieColors[i % pieColors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function FunnelChart({ data = defaultFunnel }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 18, right: 16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="stage"
          tickLine={false}
          axisLine={false}
          width={78}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--secondary)" }} />
        <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={22}>
          {data.map((entry, i) => (
            <Cell key={entry.stage} fill={pieColors[i % pieColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function getChannelLegend(data = defaultChannels) {
  return data.map((c, i) => ({
    ...c,
    color: pieColors[i % pieColors.length],
  }));
}
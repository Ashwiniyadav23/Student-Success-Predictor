type MetricCardProps = {
  label: string;
  value: string;
  description?: string;
};

export function MetricCard({ label, value, description }: MetricCardProps) {
  return (
    <section className="metric-card">
      <p className="metric-label">{label}</p>
      <h3 className="metric-value">{value}</h3>
      {description ? <p className="metric-description">{description}</p> : null}
    </section>
  );
}

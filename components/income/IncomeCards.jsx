export default function IncomeCards({ data }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card title="Total Monthly Income" value={`₹ ${data.totalMonthlyIncome || 0}`} />
      <Card title="Active Sources" value={data.activeSources || 0} />
      <Card title="Last Updated" value={data.month || "-"} />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}

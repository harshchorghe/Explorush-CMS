export default function AdminDashboard() {
  return (
    <div>
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "bold",
          marginBottom: "30px",
        }}
      >
        Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
        }}
      >
        <DashboardCard title="Trips" count="0" />
        <DashboardCard title="Blogs" count="0" />
        <DashboardCard title="Vlogs" count="0" />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  count,
}: {
  title: string;
  count: string;
}) {
  return (
    <div
      style={{
        background: "white",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
    >
      <h2>{title}</h2>

      <p
        style={{
          fontSize: "40px",
          fontWeight: "bold",
          marginTop: "10px",
        }}
      >
        {count}
      </p>
    </div>
  );
}
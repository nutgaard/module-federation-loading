import styles from "../ui/CommerceVisuals.module.css";

const orders = [
  { id: "SO-4128", customer: "Northwind Labs", total: "$4,820", status: "Picking" },
  { id: "SO-4130", customer: "Blue Yard", total: "$1,260", status: "Packed" },
  { id: "SO-4131", customer: "Urban Dock", total: "$7,104", status: "Blocked" },
  { id: "SO-4134", customer: "Atlas Retail", total: "$3,950", status: "Shipped" }
];

export function OrdersBoardPage() {
  return (
    <div className={styles.stack}>
      <div className={styles.summaryRow}>
        <Summary title="Open Orders" value="184" delta="+14" />
        <Summary title="Late Shipments" value="7" delta="-3" warn />
        <Summary title="Fulfillment SLA" value="97.2%" delta="+0.8%" />
      </div>
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3>Warehouse Queue</h3>
          <span>Updated 30s ago</span>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.total}</td>
                <td>
                  <span className={`${styles.tag} ${tagClass(order.status, styles)}`}>{order.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Summary({
  title,
  value,
  delta,
  warn = false
}: {
  title: string;
  value: string;
  delta: string;
  warn?: boolean;
}) {
  return (
    <div className={styles.summaryCard}>
      <span>{title}</span>
      <strong>{value}</strong>
      <em className={warn ? styles.warnText : styles.goodText}>{delta}</em>
    </div>
  );
}

function tagClass(status: string, classes: Record<string, string>) {
  switch (status) {
    case "Blocked":
      return classes.blocked;
    case "Shipped":
      return classes.shipped;
    case "Packed":
      return classes.packed;
    default:
      return classes.picking;
  }
}


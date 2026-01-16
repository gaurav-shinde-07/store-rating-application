import { useEffect, useState } from "react";
import { api } from "../api/api";
import UsersList from "./UsersList";
import StoresList from "./StoresList";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api("/admin/dashboard").then(setStats).catch(err => alert(err.message));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <p>Total Users: {stats.totalUsers}</p>
      <p>Total Stores: {stats.totalStores}</p>
      <p>Total Ratings: {stats.totalRatings}</p>

      <hr />

      <UsersList />
      <hr />
      <StoresList />
    </div>
  );
}

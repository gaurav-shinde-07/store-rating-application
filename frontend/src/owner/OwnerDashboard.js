import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function OwnerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api("/owner/dashboard").then(setData).catch(err => alert(err.message));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Store Owner Dashboard</h2>

      <p>Average Rating: {Number(data.averageRating).toFixed(2)}</p>

      <h3>Users Who Rated</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((u, i) => (
            <tr key={i}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function StoresList() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    api("/admin/stores").then(setStores).catch(err => alert(err.message));
  }, []);

  return (
    <div>
      <h3>Stores</h3>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
              <td>{Number(s.rating).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

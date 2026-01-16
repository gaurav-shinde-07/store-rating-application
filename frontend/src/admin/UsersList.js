import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api("/admin/users").then(setUsers).catch(err => alert(err.message));
  }, []);

  return (
    <div>
      <h3>Users</h3>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.address}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

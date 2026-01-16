import { useState } from "react";
import { api } from "../api/api";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: ""
  });

  const signup = async () => {
    try {
      await api("/auth/signup", "POST", form);
      alert("Signup successful. Please login.");
      window.location.href = "/";
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Address" onChange={e => setForm({ ...form, address: e.target.value })} />
      <input
        type="password"
        placeholder="Password"
        onChange={e => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={signup}>Signup</button>
    </div>
  );
}

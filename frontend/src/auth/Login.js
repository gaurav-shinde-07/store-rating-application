import { useState } from "react";
import { api } from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api("/auth/login", "POST", { email, password });
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);

      if (res.role === "ADMIN") window.location.href = "/admin";
      else if (res.role === "STORE_OWNER") window.location.href = "/owner";
      else window.location.href = "/user";
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        New user? <a href="/signup">Signup</a>
      </p>
    </div>
  );
}

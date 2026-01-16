import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function StoreList() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    api("/stores").then(setStores).catch(err => alert(err.message));
  }, []);

  const submitRating = async (storeId, rating) => {
    try {
      await api("/ratings", "POST", { storeId, rating: Number(rating) });
      alert("Rating saved");
      api("/stores").then(setStores);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Stores</h2>

      {stores.map(s => (
        <div key={s.id} style={{ marginBottom: 15 }}>
          <strong>{s.name}</strong><br />
          Address: {s.address}<br />
          Overall Rating: {Number(s.rating).toFixed(2)}<br />
          Your Rating: {s.user_rating ?? "Not rated"}
          <br />
          <select
            defaultValue=""
            onChange={e => submitRating(s.id, e.target.value)}
          >
            <option value="" disabled>Rate</option>
            {[1,2,3,4,5].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

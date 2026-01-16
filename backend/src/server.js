require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authMiddleware = require("./middleware/auth.middleware");
const roleMiddleware = require("./middleware/role.middleware");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/admin", authMiddleware, roleMiddleware("ADMIN"), require("./routes/admin.routes"));
app.use("/api/stores", authMiddleware, roleMiddleware("USER"), require("./routes/store.routes"));
app.use("/api/ratings", authMiddleware, roleMiddleware("USER"), require("./routes/rating.routes"));
app.use("/api/owner", authMiddleware, roleMiddleware("STORE_OWNER"), require("./routes/owner.routes"));

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

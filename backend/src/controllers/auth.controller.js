const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isValidPassword, isValidEmail } = require("../utils/validators");

exports.signup = async (req, res, next) => {
  try {
    const { name, email, address, password } = req.body;

    if (name.length < 20 || name.length > 60)
      return res.status(400).json({ message: "Invalid name length" });

    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email" });

    if (!isValidPassword(password))
      return res.status(400).json({ message: "Invalid password format" });

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (name, email, address, password, role)
       VALUES ($1,$2,$3,$4,'USER')`,
      [name, email, address, hash]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await db.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (!result.rows.length)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    next(err);
  }
};

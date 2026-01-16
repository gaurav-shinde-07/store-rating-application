const db = require("../db");
const bcrypt = require("bcryptjs");
const { isValidEmail, isValidPassword } = require("../utils/validators");

/**
 * Add new user (ADMIN / USER / STORE_OWNER)
 */
exports.addUser = async (req, res, next) => {
  try {
    const { name, email, address, password, role } = req.body;

    if (name.length < 20 || name.length > 60)
      return res.status(400).json({ message: "Name must be 20–60 characters" });

    if (!isValidEmail(email))
      return res.status(400).json({ message: "Invalid email" });

    if (!isValidPassword(password))
      return res.status(400).json({ message: "Invalid password format" });

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (name, email, address, password, role)
       VALUES ($1,$2,$3,$4,$5)`,
      [name, email, address, hash, role]
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    next(err);
  }
};

/**
 * Add store
 */
exports.addStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;

    await db.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1,$2,$3,$4)`,
      [name, email, address, ownerId]
    );

    res.status(201).json({ message: "Store added successfully" });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin dashboard
 */
exports.dashboard = async (req, res, next) => {
  try {
    const users = await db.query("SELECT COUNT(*) FROM users");
    const stores = await db.query("SELECT COUNT(*) FROM stores");
    const ratings = await db.query("SELECT COUNT(*) FROM ratings");

    res.json({
      totalUsers: Number(users.rows[0].count),
      totalStores: Number(stores.rows[0].count),
      totalRatings: Number(ratings.rows[0].count)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * List users with filters + sorting
 */
exports.listUsers = async (req, res, next) => {
  try {
    const { name, email, address, role, sort = "name", order = "asc" } = req.query;

    let query = `SELECT id, name, email, address, role FROM users WHERE 1=1`;
    const params = [];

    if (name) {
      params.push(`%${name}%`);
      query += ` AND name ILIKE $${params.length}`;
    }
    if (email) {
      params.push(`%${email}%`);
      query += ` AND email ILIKE $${params.length}`;
    }
    if (address) {
      params.push(`%${address}%`);
      query += ` AND address ILIKE $${params.length}`;
    }
    if (role) {
      params.push(role);
      query += ` AND role = $${params.length}`;
    }

    query += ` ORDER BY ${sort} ${order.toUpperCase()}`;

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

/**
 * List stores with average rating
 */
exports.listStores = async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT s.id, s.name, s.email, s.address,
             COALESCE(AVG(r.rating), 0) AS rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      GROUP BY s.id
    `);

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

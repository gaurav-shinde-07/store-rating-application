const db = require("../db");

/**
 * List all stores with:
 * - average rating
 * - current user's rating
 */
exports.listStores = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const result = await db.query(`
      SELECT s.id, s.name, s.address,
             COALESCE(AVG(r.rating), 0) AS rating,
             (
               SELECT rating FROM ratings
               WHERE user_id = $1 AND store_id = s.id
             ) AS user_rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      GROUP BY s.id
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

/**
 * Search stores by name / address
 */
exports.searchStores = async (req, res, next) => {
  try {
    const { name = "", address = "" } = req.query;

    const result = await db.query(
      `SELECT id, name, address FROM stores
       WHERE name ILIKE $1 AND address ILIKE $2`,
      [`%${name}%`, `%${address}%`]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

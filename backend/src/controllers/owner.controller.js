const db = require("../db");

/**
 * Store owner dashboard
 */
exports.dashboard = async (req, res, next) => {
  try {
    const ownerId = req.user.userId;

    const avg = await db.query(`
      SELECT COALESCE(AVG(r.rating), 0) AS avg
      FROM ratings r
      JOIN stores s ON s.id = r.store_id
      WHERE s.owner_id = $1
    `, [ownerId]);

    const users = await db.query(`
      SELECT u.name, u.email, r.rating
      FROM ratings r
      JOIN users u ON u.id = r.user_id
      JOIN stores s ON s.id = r.store_id
      WHERE s.owner_id = $1
    `, [ownerId]);

    res.json({
      averageRating: Number(avg.rows[0].avg),
      users: users.rows
    });
  } catch (err) {
    next(err);
  }
};

const db = require("../db");

/**
 * Submit or update rating (1–5)
 */
exports.submitRating = async (req, res, next) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.userId;

    if (rating < 1 || rating > 5)
      return res.status(400).json({ message: "Rating must be between 1 and 5" });

    await db.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1,$2,$3)
       ON CONFLICT (user_id, store_id)
       DO UPDATE SET rating = $3, updated_at = NOW()`,
      [userId, storeId, rating]
    );

    res.json({ message: "Rating saved successfully" });
  } catch (err) {
    next(err);
  }
};

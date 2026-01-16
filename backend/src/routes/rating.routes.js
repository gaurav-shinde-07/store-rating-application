const router = require("express").Router();
const controller = require("../controllers/rating.controller");

router.post("/", controller.submitRating);

module.exports = router;

const router = require("express").Router();
const controller = require("../controllers/owner.controller");

router.get("/dashboard", controller.dashboard);

module.exports = router;

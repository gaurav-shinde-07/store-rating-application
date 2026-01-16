const router = require("express").Router();
const controller = require("../controllers/store.controller");

router.get("/", controller.listStores);
router.get("/search", controller.searchStores);

module.exports = router;

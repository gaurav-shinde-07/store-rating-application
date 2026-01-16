const router = require("express").Router();
const controller = require("../controllers/admin.controller");

router.post("/users", controller.addUser);
router.post("/stores", controller.addStore);
router.get("/dashboard", controller.dashboard);
router.get("/users", controller.listUsers);
router.get("/stores", controller.listStores);

module.exports = router;

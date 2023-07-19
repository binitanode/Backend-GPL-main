const { getAllPermissionData } = require("../controllers/permission");
const { Router } = require("express");
const jwtMiddleware = require("../middleware");
const router = Router();

router.get("/permission", jwtMiddleware, getAllPermissionData);

module.exports = router;

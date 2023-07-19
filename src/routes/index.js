const router = require("express").Router();
const users = require("./usersRoute");
const userRole = require("./roleRoute");
const vendorData = require("./vendorRoute");
const permission = require("./permission");
const vendorDetail = require("./vendorDetailRoute");

const baseRoute = "/api";
router.use(baseRoute, users);

router.use(baseRoute, permission);

router.use(baseRoute, userRole);

router.use(baseRoute, vendorData);

router.use(baseRoute, vendorDetail);

module.exports = router;

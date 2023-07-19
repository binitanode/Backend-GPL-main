const {
    findAllDetail,
    createDetail,
    getByIdDetail,
    scrapping_createDetail
} = require("../controllers/vendorDetailController");

const { Router } = require("express");
const jwtMiddleware = require("../middleware");
const router = Router();

router.get("/getDetail", jwtMiddleware, findAllDetail);

router.post("/creatDetail", createDetail);
// router.post("/creatDetail", jwtMiddleware, createDetail);

router.get("/getByIdDetail/:id", jwtMiddleware, getByIdDetail);

router.get("/scrapping_createDetail", jwtMiddleware, scrapping_createDetail);



module.exports = router;

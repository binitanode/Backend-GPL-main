const {
  createData,
  findAllData,
  updateData,
  deleteById,
  getById,
  csvUploader,
} = require("../controllers/vendorController");
const multer = require('multer');

const { Router } = require("express");
const jwtMiddleware = require("../middleware");
const router = Router();
const upload = multer();

router.get("/getData", jwtMiddleware, findAllData);

router.post("/createData", jwtMiddleware, createData);

router.put("/updateData/:id", jwtMiddleware, updateData);

router.delete("/deletedData/:id", jwtMiddleware, deleteById);

router.get("/byIdData/:id", jwtMiddleware, getById);

router.post("/vendor/uploadCSV", jwtMiddleware, upload.single('csvFile'), csvUploader);

module.exports = router;

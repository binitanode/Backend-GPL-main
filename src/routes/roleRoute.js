const {
  getAllRole,
  createRole,
  updateRole,
  deleteRole,
  getById,
} = require("../controllers/roleController");

const { Router } = require("express");
const jwtMiddleware = require("../middleware");
const router = Router();

router.get("/getRole", jwtMiddleware, getAllRole);

router.post("/createRole", jwtMiddleware, createRole);

router.put("/updateRole/:id", jwtMiddleware, updateRole);

router.delete("/deleteRole/:id", jwtMiddleware, deleteRole);

router.get("/getByIdRole/:id", jwtMiddleware, getById);

module.exports = router;

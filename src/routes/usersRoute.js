const {
  createUser,
  loginUser,
  getAllUsers,
  findById,
  updateUser,
  getUserById,
  deleteUser,
} = require("../controllers/userController");

const { Router } = require("express");
const jwtMiddleware = require("../middleware");
const router = Router();

router.post("/login", loginUser);

router.get("/users/me", jwtMiddleware, findById);

router.get("/getAllUsers", jwtMiddleware, getAllUsers);

router.get("/users/:id", jwtMiddleware, getUserById);

router.post("/createUser", jwtMiddleware, createUser);

router.put("/updateUser/:id", jwtMiddleware, updateUser);

router.delete("/deleteUser/:id", jwtMiddleware, deleteUser);

module.exports = router;

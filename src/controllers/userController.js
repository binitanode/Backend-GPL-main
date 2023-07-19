const { compare, hash } = require("bcrypt");
const UserModel = require("../models/userModel");
const createToken = require("../middleware/createToken");
const Joi = require("joi");
const RoleModel = require("../models/roleModel");
const { findAllUsers } = require("../services/user.service");

const schema = Joi.object({
  fullName: Joi.string().required(),
  role: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

async function findById(req, res) {
  const userId = req.user._id;
  try {
    if (!userId) {
      return res.status(404).json({
        message: "User Is Missing!",
      });
    }
    await UserModel.findOne({ _id: userId })
      .populate("role")
      .then((userData) => {
        if (!userData)
          return res.status(404).json({
            message: "Something went wrong!",
          });
        const Token = createToken(userData);
        res.status(201).json({
          data: userData,
          accessToken: Token.token,
        });
      })
      .catch((error) => {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      });
  } catch (error) {
    res.status(404).json({
      message: error
    })
    console.log("error in findById in userController", error);
  }
}

async function getAllUsers(req, res, next) {
  try {
    const data = await findAllUsers()

    res.status(200).json({
      message: "Get All Data Successfully!",
      data,
      totalUserCount: data.length,
    })
  } catch (error) {
    next(error)
  }
}

async function getUserById(req, res) {
  try {
    if (!req.params) {
      return res.status(404).json({
        message: "req.params is missing",
      });
    }
    const id = req.params.id;
    await UserModel.findById(id)
      .then((getAllUsers) => {
        if (!getAllUsers)
          return res.status(404).json({
            message: "Something went wrong!",
          });
        res.status(201).json({
          message: "Get All Users Successfully!",
          data: getAllUsers,
          rowcount: "100",
        });
      })
      .catch((error) => {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      });
  } catch (error) {
    res.status(404).json({
      message: error
    })
    console.log("error in getUserById in userController", error);
  }
}

async function createUser(req, res) {
  try {
    if (!req.body) {
      return res.status(404).json({
        message: "req.body is missing",
      });
    }
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    } else {
      const userExist = await UserModel.findOne({ email: value.email })
      if (userExist) {
        return res.status(409).json({ message: `This email ${value.email} already is exist!` });
      }
      const setUserType = await RoleModel.findById(value.role);
      if (!setUserType) {
        return res.status(400).json({ message: "Role Type is missing!" });
      }

      const hasedPassword = await hash(value.password, 10);
      const create = await await UserModel.create({
        ...value,
        type: setUserType.name,
        password: hasedPassword,
      });
      return res.status(201).json({
        success: "User Created!",
        create,
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error
    })
    console.log("error in createUser in userController", error);
  }
}

async function updateUser(req, res) {
  try {
    if (!req.params) {
      return res.status(404).json({
        message: "req.params is missing",
      });
    }
    if (!req.body) {
      return res.status(404).json({
        message: "req.body is missing",
      });
    }
    const id = req.params.id;
    const updatedData = req.body;
    await UserModel.findByIdAndUpdate(id, updatedData)
      .then((updateUser) => {
        if (!updateUser)
          return res.status(404).json({
            message: "Role is not found!",
          });
        res.status(201).json({
          message: "Updated data successfully ",
          data: updateUser,
        });
      })
      .catch((error) => {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      });
  } catch (error) {
    res.status(404).json({
      message: error
    })
    console.log("error in updateUser in userController", error);
  }
}

async function deleteUser(req, res) {
  try {
    if (!req.params) {
      return res.status(404).json({
        message: "req.params is missing",
      });
    }
    const id = req.params.id;
    await UserModel.findByIdAndDelete(id)
      .then((updateUser) => {
        if (!updateUser)
          return res.status(404).json({
            message: "Role is not found!",
          });
        res.status(201).json({
          message: "Updated data successfully ",
          data: updateUser,
        });
      })
      .catch((error) => {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      });
  } catch (error) {
    res.status(404).json({
      message: error
    })
    console.log("error in deleteUser in userController", error);
  }
}

async function loginUser(req, res) {
  try {
    if (!req.body) {
      return res.status(404).json({
        message: "req.body is missing",
      });
    }
    const userData = await UserModel.findOne({ email: req.body.email }).populate(
      "role"
    );
    if (userData == null) {
      return res.status(404).json({
        message: "User Not Found !",
      });
    }
    const passCompare = await compare(req.body.password, userData.password);
    if (passCompare) {
      const Token = createToken(userData);
      res.status(200).json({
        message: "Login Successfull!",
        userData,
        accessToken: Token.token,
      });
    } else {
      res.status(404).json({
        message: "Password is incorrect!",
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error
    })
    console.log("error in loginUser in userController", error);
  }
}

module.exports = {
  createUser,
  loginUser,
  getUserById,
  deleteUser,
  getAllUsers,
  findById,
  updateUser,
};

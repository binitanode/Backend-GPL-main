const RoleModel = require("../models/roleModel");

async function getAllRole(req, res) {
  try{
    await RoleModel.find()
      .then((roledata) => {
        if (!roledata)
          return res.status(404).json({
            message: "Not found any data!",
          });
        res.status(201).json({
          data: roledata,
        });
      })
      .catch((error) => {
        res.status(404).json({
          success: "Something went wrong!",
          error: error.message,
        });
      });
  }catch(error){
    console.log("error in getAllRole in roleController",error);
  }
}

async function createRole(req, res) {
  if(!req.body){
    return res.status(404).json({
      message: "req.body is missing",
    });
  }
  const newData = req.body;
  await RoleModel.create(newData)
    .then((createdTask) => {
      if (!createdTask)
        return res.status(404).json({
          message: "Task creation failed",
        });
      res.status(201).json({
        success: "Role create successfully!",
        createdTask,
      });
    })
    .catch((error) => {
      res.status(404).json({
        error: error.message,
      });
    });
}

async function updateRole(req, res) {
  if(!req.params){
    return res.status(404).json({
      message: "req.params is missing",
    });
  }
  if(!req.body){
    return res.status(404).json({
      message: "req.body is missing",
    });
  }
  const id = req.params.id;
  const updatedData = req.body;
  await RoleModel.findByIdAndUpdate(id, updatedData)
    .then((updateRole) => {
      if (!updateRole)
        return res.status(404).json({
          message: "Role is not found!",
        });
      res.status(201).json({
        message: "Updated data successfully ",
        updateRole,
      });
    })
    .catch((error) => {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    });
}

async function deleteRole(req, res) {
  if(!req.params){
    return res.status(404).json({
      message: "req.params is missing",
    });
  }
  const id = req.params.id;
  await RoleModel.findByIdAndDelete(id)
    .then((deleteRole) => {
      if (!deleteRole)
        return res.status(404).json({
          message: "Role is not found!",
        });
      res.status(201).json({
        message: "Delete data successfully ",
        deleteRole,
      });
    })
    .catch((error) => {
      res.status(404).json({
        success: "Something went wrong",
      });
    });
}

async function getById(req, res) {
  if(!req.params){
    return res.status(404).json({
      message: "req.params is missing",
    });
  }

  const id = req.params.id;
  await RoleModel.findById(id)
    .then((findRole) => {
      if (!findRole)
        return res.status(404).json({
          message: "Role is not found!",
        });
      res.status(201).json({
        findRole,
      });
    })
    .catch((error) => {
      res.status(404).json({
        message: "Something is wrong!",
      });
    });
}

module.exports = { getAllRole, createRole, updateRole, deleteRole, getById };

const VendorModel = require("../models/vendorModel");
const LogModel = require("../models/logModel");
const { getAllData, count } = require("../services/vendor.service");
const { URL } = require('url');

async function findAllData(req, res, next) {
  try {
    const findAllData = await getAllData(req)
    const dataCount = await count()
    res.status(200).json({
      message: "Get All Data Successfully!",
      data: findAllData,
      totalCount: dataCount,
      rowCount: findAllData.length
    })
  } catch (error) {
    next(error)
  }
}

async function createData(req, res) {
  if(!req.body){
    return res.status(404).json({
      message: "parameter is missing",
    });
  }
  const reqData = req.body
  const createdBy = req.user._id;
  const webData = reqData.websiteURL;
  const originalUrl = new URL(webData)
  const hostname = originalUrl.hostname
  const strippedHostname = hostname.replace('www.', '').replace(/\s/g, "");
  var create_index = await VendorModel.createIndexes({ websiteDomain: 1, profileLink: 1 }, { unique: true });
  
  const findData = await VendorModel.findOne({ websiteDomain: strippedHostname, profileLink: reqData.profileLink.replace(/\s/g, "") })
  if (findData) {
    return res.status(404).json({
      message: `This domain ${strippedHostname} and vendor url is exist!`,
    });
  } else {
    await VendorModel.create({ ...reqData, websiteURL: reqData.websiteURL.replace(/\s/g, ""), profileLink: reqData.profileLink.replace(/\s/g, ""),
     websiteDomain: strippedHostname.replace(/\s/g, ""), createdBy })
      .then(async (createdTask) => {
        if (!createdTask)
          return res.status(404).json({
            message: "Task creation failed",
          });
          res.status(201).json({
          success: "Data add successfully!",
          createdTask,
        });
      })
      .catch((error) => {
        res.status(404).json({
          error: error.message,
        });
      });
  }
}

async function updateData(req, res) {
  const id = req.params.id;
  const updatedData = req.body;
  if(!id && !updatedData){
    return res.status(404).json({
      message: "parameter is missing",
    });
  }
  // await LogModel.create({ user_id: user_id, action_id: id, module:"VendorModel in updateData", action: "update" });
  await VendorModel.findByIdAndUpdate(id, updatedData)
    .then((updateData) => {
      if (!updateData)
        return res.status(404).json({
          message: "Data is not found!",
        });                                                                                                             
      res.status(201).json({
        message: "Updated data successfully ",
        updateData,
      });
    })
    .catch((error) => {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    });
}

async function deleteById(req, res) {
  const id = req.params.id;
  if(!id){
    return res.status(404).json({
      message: "parameter is missing",
    });
  }
  // await LogModel.create({ user_id: user_id, action_id: id, module:"VendorModel in deleteData", action: "delete" });
  await VendorModel.findByIdAndDelete(id)
    .then((deleteData) => {
      if (!deleteData)
        return res.status(404).json({
          message: "Data is not found!",
        });
      res.status(201).json({
        message: "Delete data successfully ",
        deleteData,
      });
    })
    .catch((error) => {
      res.status(404).json({
        success: "Something went wrong",
      });
    });
}

async function getById(req, res) {
  const id = req.params.id;
  if(!id){
    return res.status(404).json({
      message: "parameter is missing",
    });
  }
  await VendorModel.findById(id)
    .then((createdTask) => {
      if (!createdTask)
        return res.status(404).json({
          message: "Data is not found!",
        });
      res.status(201).json({
        data: createdTask,
        message: "GPL get by Id!",
      });
    })
    .catch((error) => {
      res.status(404).json({
        message: "Something is wrong!",
      });
    });
}

async function csvUploader(req, res) {
  const successData = [];
  const existedData = [];
  const bufferData = req.file.buffer.toString();
  const lines = bufferData.split('\n');

  var lineNum = 0;

  for (const line of lines) {
    if (lineNum === 0) {
      lineNum++;
      continue;
    }
    const row = line.split(',');
    const createdBy = req.user._id;
    const webData = row[0];
    const originalUrl = new URL(webData.replace(/\s/g, ""))
    const hostname = originalUrl.hostname
    var websiteDomain = hostname.replace('www.', '');

    const websiteURL = row[0];
    const name = row[1];
    const profileLink = row[2];

    const findData = await VendorModel.findOne({ websiteDomain, profileLink: profileLink.replace(/\s/g, "") })
    if (findData) {
      const i = { websiteURL, name, profileLink, createdBy, websiteDomain }
      existedData.push(i)
    } else {
      const i = { websiteURL: websiteURL.replace(/\s/g, ""), name, profileLink: profileLink.replace(/\s/g, ""), createdBy, websiteDomain }
      successData.push(i);
    }
    lineNum++;
  };
  // await LogModel.create({ user_id: user_id, module:"csv upload", action: "vendor create" });

  await VendorModel.insertMany(successData).then(function () {
    res.status(200).json({
      message: `Successfully data insert!`,
      successData,
      existedData,
      total: successData.length + existedData.length
    })
  }).catch(function (err) {
    res.status(404).json({
      error: err.message,
    });
  });;
}

module.exports = { createData, findAllData, updateData, deleteById, getById, csvUploader };

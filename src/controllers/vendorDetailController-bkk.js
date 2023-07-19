const VendorDetailModel = require("../models/vendorDetailModel");
const { getVendorDetail, count } = require("../services/vendorDetail.service");

async function findAllDetail(req, res, next) {
    try {
          if(!req){
            return res.status(404).json({
              message: "req is missing",
            });
          }
        const findAllData = await getVendorDetail(req)
        const dataCount = await count()
        res.status(200).json({
            message: "Get All Data Successfully!",
            data: findAllData,
            totalCount: dataCount,
            rowCount: findAllData.length
        })
    } catch (error) {
        // next(error)
        console.log("error in findAllDetail in vendorDetailController");
    }
}

async function createDetail(req, res) {
    try{
          if(!req.body){
            return res.status(404).json({
              message: "req.body is missing",
            });
          }
        const newData = req.body
        await VendorDetailModel.create(newData)
            .then(async (createdTask) => {
                if (!createdTask)
                    return res.status(404).json({
                        message: "Task creation failed",
                    });
                res.status(201).json({
                    message: "Detail add successfully!",
                    data: createdTask,
                });
            })
            .catch((error) => {
                res.status(404).json({
                    error: error.message,
                });
            })
    }catch(error){
        console.log("error in createDetail in vendorDetailController");
    }
}

async function getByIdDetail(req, res) {
    if(!req.params){
        return res.status(404).json({
          message: "req.params is missing",
        });
      }
    const detailsId = req.params.id;
    console.log("detailsId", detailsId)
    await VendorDetailModel.findById(detailsId).populate('vendordata')
        .then((getDetail) => {
            res.status(201).json({
                message: "Detail get successfully!",
                data: getDetail,
            });
        })
        .catch((error) => {
            res.status(404).json({
                error: error.message,
            });
        })
}

module.exports = { findAllDetail, createDetail, getByIdDetail };

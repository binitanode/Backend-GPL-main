const VendorDetailModel = require("../models/vendorDetailModel");

async function getVendorDetail(req) {
    const pageSize = req.query.pageSize
    const page = req.query.page
    const findedAllData = await VendorDetailModel.find()
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .skip(pageSize * (page - 1))
        .populate('vendordata')
    return findedAllData
}

async function count() {
    const totalData = await VendorDetailModel.countDocuments()
    return totalData
}

module.exports = { count, getVendorDetail };

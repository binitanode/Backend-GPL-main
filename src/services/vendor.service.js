const VendorModel = require("../models/vendorModel");

async function getAllData(req) {
    const pageSize = req.query.pageSize
    const skipCount = (req.query.page - 1) * pageSize;
    const findedAllData = await VendorModel.aggregate([
        { $sort: { createdAt: -1 } },
        { $skip: parseInt(skipCount) },
        { $limit: parseInt(pageSize) },
        {
            $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: "$user" },
        {
            $project: {
                name: 1,
                websiteURL: 1,
                websiteDomain: 1,
                profileLink: 1,
                createdAt: 1,
                updatedAt: 1,
                uName: "$user.fullName",
                uEmail: "$user.email",
                uType: "$user.type",
                userId: "$user._id",
            }
        }
    ])

    return findedAllData
}

async function count() {
    const totalData = await VendorModel.countDocuments()
    return totalData
}

module.exports = { count, getAllData };

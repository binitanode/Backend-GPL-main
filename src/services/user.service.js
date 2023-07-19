const UserModel = require("../models/userModel");

async function findAllUsers() {
    const findAllUser = await UserModel.aggregate([
        {
            $lookup: {
                from: 'vendors',
                localField: '_id',
                foreignField: 'createdBy',
                as: 'vendoreDataCount'
            }
        },
        {
            $addFields: {
                vendoreDataCount: { $size: '$vendoreDataCount' }
            }
        }
    ])
    return findAllUser
}


module.exports = {
    findAllUsers,
};
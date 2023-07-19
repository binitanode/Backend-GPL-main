const { Schema, model } = require("mongoose");

const VenderSchema = new Schema(
    {
        vendordata: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'vendordata'
        },
        numOfOrder: {
            type: String,
            required: true,
        },
        review: {
            type: String,
            required: true,
        },
        rejected: {
            type: String,
            required: true,
        },
        aprroed: {
            type: String,
            required: true,
        },
        inProgress: {
            type: String,
            required: true,
        },
        avgCompRate: {
            type: String,
            required: true,
        },
        avgLifeTimeLink: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const VendorDetailModel = model("vendordetail", VenderSchema);

module.exports = VendorDetailModel;
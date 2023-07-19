const { Schema, model } = require("mongoose");

const VenderSchema = new Schema(
    {
        vendor_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'vendordata'
        },
        venor_profile_link: {
            type: String,
            // required: true,
        },
        venor_profile_title: {
            type: String,
            // required: true,
        },
        avg_completion_rate: {
            type: String,
            // required: true,
        },
        rating: {
            type: [],
            // required: true,
        },
        task_initial_domain_price: {
            type: String,
            // required: true,
        },
        avg_lifetime_link: {
            type: String,
            // required: true,
        },
        no_of_complete_task: {
            type: String,
            // required: true,
        },
        no_of_task_progress: {
            type: String,
            // required: true,
        },
        no_of_rejected_task: {
            type: String,
            // required: true,
        },
        no_of_approved_sites: {
            type: String,
            // required: true,
        },
        rating_no: {
            type: String,
            // required: true,
        },
    },
    { timestamps: true }
);

const VendorDetailModel = model("vendordetail", VenderSchema);

module.exports = VendorDetailModel;
const { Schema, model } = require("mongoose");

const MySchema = new Schema(
  {
    websiteURL: {
      type: String,
      required: true,
    },
    websiteDomain: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    profileLink: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    process_status: {
      type: Boolean,
      default: false,
    },
    process_count: {
      type: Number,
      default: 0,
    },
    vendor_profile_obj:{
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

const VendorModel = model("vendordata", MySchema);


module.exports = VendorModel;

const { Schema, model } = require("mongoose");

const MySchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      ref: "role",
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = model("user", MySchema);

module.exports = UserModel;

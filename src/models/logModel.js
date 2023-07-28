const { Schema, model } = require("mongoose");

const MySchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
    },
    name: {
      type: String,
    },
    action_id: {
        type: Schema.Types.ObjectId,
    },
    module: {
        type: String,
    },
    action: {
        type: String,
    },
  },
  { timestamps: true }
);

const LogModel = model("log", MySchema);

module.exports = LogModel;

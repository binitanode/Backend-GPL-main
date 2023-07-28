const express = require("express");
const allRoutes = require("./src/routes");
const { default: mongoose } = require("mongoose");
const app = express();
const cors = require("cors");
require('dotenv').config();
const uri = process.env.MONGODB_URI;
console.log("uri",uri);
// const { scrapping_createDetail } = require('./src/controllers/vendorDetailController/scrapping_createDetail'); 
// const redisClient = require("./redis.js");
// console.log("redisClient",redisClient);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      // `mongodb://127.0.0.1:27017/`,
      uri,
      {
        useNewUrlParser: true,
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};
connectDB();

app.use(cors());
app.use(express.json());

app.use("/", allRoutes);

const port = 8080;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

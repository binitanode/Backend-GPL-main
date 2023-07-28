const express = require("express");
const allRoutes = require("./src/routes");
const { default: mongoose } = require("mongoose");
const app = express();
const cors = require("cors");
const cron = require('node-cron');
const scrapping_api = require('./src/controllers/vendorDetailController'); 

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      // `mongodb+srv://Dhanuskh1206:tbsXLZoYtlQGULJP@gpl0.xh76sio.mongodb.net/`,
      `mongodb://127.0.0.1:27017/`,
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

const serverTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log('Server Time Zone:', serverTimeZone);
const currentDate = new Date();
console.log('Server Current Date and Time:', currentDate);

console.log('Initializing cron job...');

const minDelayMinutes = 5; // 5 minutes
const maxDelayMinutes = 50; // 50 minutes

function getRandomDelayInMinutes() {
    console.log("call random function");
  const randomDelayMinutes = Math.floor(Math.random() * (maxDelayMinutes - minDelayMinutes + 1) + minDelayMinutes);
  console.log('Random Delay in Minutes:', randomDelayMinutes);
  return randomDelayMinutes;
}

console.log('Cron Schedule:');
const scheduledTask = cron.schedule(`*/${getRandomDelayInMinutes()} * * * *`, async () => {
  try {
 
     console.log("cron.schedule run");
    
     console.log('Server Current Date and Time:', new Date());

    await scrapping_api.scrapping_createDetail();

    console.log('API has been executed successfully.');
  } catch (error) {
    console.error('An error occurred during API execution:', error);
  }
});


scheduledTask.start();




const port = 8080;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
